import type {
  AnalysisInput,
  AnalysisResult,
  BabyProfile,
  BabyState,
  RefinementContext,
} from "../../models/types";
import type { Language } from "../../i18n/translations";

const ENDPOINT_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

const DEFAULT_MODEL =
  (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim() ||
  "gemini-2.0-flash";

const ALL_STATES: BabyState[] = [
  "tired",
  "overstimulated",
  "hungry",
  "discomfort",
  "content",
  "playful",
  "other",
];

/** ~18 MB — Gemini's inline_data hard limit is ~20 MB. */
const INLINE_LIMIT_BYTES = 18 * 1024 * 1024;

export class GeminiUploadTooLargeError extends Error {
  constructor(public readonly bytes: number) {
    super(
      `File too large for inline Gemini call (${Math.round(
        bytes / 1024 / 1024
      )} MB). Try a clip under 18 MB.`
    );
    this.name = "GeminiUploadTooLargeError";
  }
}

export class GeminiUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiUnavailableError";
  }
}

function getKey(): string {
  const k = (import.meta.env.VITE_GEMINI_API_KEY ?? "").toString().trim();
  if (!k) throw new GeminiUnavailableError("Missing VITE_GEMINI_API_KEY");
  return k;
}

interface InlinePart {
  inline_data: { mime_type: string; data: string };
}
interface TextPart {
  text: string;
}
type Part = InlinePart | TextPart;

async function fileToInlineData(file: File): Promise<InlinePart> {
  if (file.size > INLINE_LIMIT_BYTES) {
    throw new GeminiUploadTooLargeError(file.size);
  }
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  // chunked btoa to avoid stack overflow on large inputs
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + CHUNK))
    );
  }
  const data = btoa(binary);
  const mime = file.type || guessMime(file.name);
  return { inline_data: { mime_type: mime, data } };
}

function guessMime(name?: string): string {
  if (!name) return "application/octet-stream";
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    ogg: "audio/ogg",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  return map[ext ?? ""] ?? "application/octet-stream";
}

const RESULT_SCHEMA = {
  type: "object",
  properties: {
    primaryState: {
      type: "string",
      enum: ALL_STATES,
    },
    primaryLabel: { type: "string" },
    confidence: { type: "number" },
    distribution: {
      type: "object",
      properties: Object.fromEntries(
        ALL_STATES.map((s) => [s, { type: "number" }])
      ),
      required: ALL_STATES,
    },
    signals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          signal: { type: "string" },
          weight: { type: "number" },
        },
        required: ["signal", "weight"],
      },
    },
    explanation: { type: "string" },
    suggestions: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "primaryState",
    "primaryLabel",
    "confidence",
    "distribution",
    "signals",
    "explanation",
    "suggestions",
  ],
} as const;

const REFINE_SCHEMA = {
  type: "object",
  properties: {
    primaryState: { type: "string", enum: ALL_STATES },
    primaryLabel: { type: "string" },
    confidence: { type: "number" },
    distribution: {
      type: "object",
      properties: Object.fromEntries(
        ALL_STATES.map((s) => [s, { type: "number" }])
      ),
      required: ALL_STATES,
    },
    rationale: { type: "string" },
  },
  required: [
    "primaryState",
    "primaryLabel",
    "confidence",
    "distribution",
    "rationale",
  ],
} as const;

const LANGUAGE_INSTRUCTIONS: Record<Language, string> = {
  en: "Respond in English. All natural-language fields (primaryLabel, explanation, signals, suggestions, rationale) MUST be in clear, calm English.",
  he: "ענה/י בעברית בלבד. כל שדות הטקסט החופשי (primaryLabel, explanation, signals, suggestions, rationale) חייבים להיות בעברית טבעית, רגועה ומכבדת. שמור/י על מזהי המצב (primaryState, distribution keys) באנגלית כפי שמופיעים בסכמה.",
};

const SYSTEM_INSTRUCTION_BASE = `You are ComuniCare, an AI that gently interprets a baby's non-verbal communication.

You read whatever the parent provides — a short video clip, an audio clip (e.g. crying), or a photo of the baby's face — and infer the most likely communicative state.

Allowed states (use these exact ids):
- tired         (sleepy, fading attention, fatigue)
- overstimulated(overwhelmed by environment)
- hungry        (rooting, hand-to-mouth, lip smacking)
- discomfort    (pain, gas, temperature, teething)
- content       (calm, settled, regulated)
- playful       (alert, engaged, ready for connection)
- other         (mixed or unclear)

Rules you MUST follow:
1. Output STRICT JSON matching the schema. No prose outside JSON.
2. Use cautious language in "explanation" and "suggestions": "may indicate", "could suggest", "worth trying". Never use "diagnose", "certain", "definitely".
3. "distribution" values are probabilities in [0,1] and should approximately sum to 1.
4. "confidence" is in [0,1] and roughly equals the highest distribution value.
5. "signals" are 3–6 short phrases describing the cues you actually observed (e.g. "reduced eye engagement", "rhythmic low-pitch cry"). "weight" in [0,1] expresses how strongly each cue contributed.
6. "primaryLabel" is a short natural sentence like "Likely tired and slightly overstimulated".
7. "suggestions" are 3–5 calm, parent-friendly actions ("Dim the lights", "Offer a quiet sleep space", etc.). Never medical advice.
8. If the input is unclear or unreadable, set primaryState to "other", lower confidence accordingly, and say so kindly in the explanation.
9. Never claim medical diagnosis. If something looks like it could be physical pain or illness, suggest the parent contact their pediatrician.`;

function systemInstructionFor(lang: Language): string {
  return `${SYSTEM_INSTRUCTION_BASE}\n\n10. ${LANGUAGE_INSTRUCTIONS[lang]}`;
}

async function callGemini(
  parts: Part[],
  schema: object,
  systemInstruction: string
): Promise<string> {
  const key = getKey();
  const url = `${ENDPOINT_BASE}/${DEFAULT_MODEL}:generateContent?key=${encodeURIComponent(
    key
  )}`;
  const body = {
    contents: [{ role: "user", parts }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.4,
      maxOutputTokens: 1024,
    },
    safetySettings: [],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.error?.message ?? "";
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new GeminiUnavailableError(
      `Gemini ${res.status}${detail ? ` — ${detail}` : ""}`
    );
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new GeminiUnavailableError("Gemini returned empty response");
  return text;
}

function clamp01(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function normalizeDistribution(
  raw: unknown
): Record<BabyState, number> {
  const out: Record<BabyState, number> = {
    tired: 0,
    overstimulated: 0,
    hungry: 0,
    discomfort: 0,
    content: 0,
    playful: 0,
    other: 0,
  };
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    for (const s of ALL_STATES) out[s] = clamp01(r[s]);
  }
  const sum = ALL_STATES.reduce((a, s) => a + out[s], 0);
  if (sum > 0) for (const s of ALL_STATES) out[s] = out[s] / sum;
  return out;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function buildContextText(
  input: AnalysisInput,
  profile: BabyProfile | null
): string {
  const parts: string[] = [];
  parts.push(`Input modality: ${input.type}.`);
  if (input.fileName) parts.push(`Filename: ${input.fileName}.`);
  if (profile) {
    parts.push(`Baby's name: ${profile.name}.`);
    if (profile.birthDate) {
      const months =
        (Date.now() - new Date(profile.birthDate).getTime()) /
        (1000 * 60 * 60 * 24 * 30.4375);
      if (Number.isFinite(months) && months >= 0) {
        parts.push(`Approx age: ${months.toFixed(1)} months.`);
      }
    }
    if (profile.feedingIntervalHours)
      parts.push(`Typical feeding interval: ${profile.feedingIntervalHours} h.`);
    if (profile.wakeWindowMinutes)
      parts.push(`Typical wake window: ${profile.wakeWindowMinutes} min.`);
    if (profile.notes) parts.push(`Parent notes: ${profile.notes}.`);
  } else {
    parts.push("No baby profile provided.");
  }
  parts.push(
    "Please analyze the attached media and respond with the structured JSON only."
  );
  return parts.join(" ");
}

export interface GeminiOptions {
  language?: Language;
}

export async function analyzeBabyInput(
  input: AnalysisInput,
  profile: BabyProfile | null,
  _history: AnalysisResult[],
  opts: GeminiOptions = {}
): Promise<AnalysisResult> {
  if (!input.file) {
    throw new GeminiUnavailableError(
      "No file attached for real-AI analysis."
    );
  }
  const lang: Language = opts.language ?? "en";

  const mediaPart = await fileToInlineData(input.file);
  const textPart: TextPart = { text: buildContextText(input, profile) };

  const raw = await callGemini(
    [textPart, mediaPart],
    RESULT_SCHEMA,
    systemInstructionFor(lang)
  );

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new GeminiUnavailableError("Could not parse Gemini JSON output.");
  }

  const distribution = normalizeDistribution(parsed.distribution);
  let primaryState =
    (parsed.primaryState as BabyState) ?? "other";
  if (!ALL_STATES.includes(primaryState)) primaryState = "other";

  const confidence = clamp01(
    parsed.confidence ?? distribution[primaryState] ?? 0
  );

  const signals = Array.isArray(parsed.signals)
    ? (parsed.signals as { signal?: string; weight?: number }[])
        .map((s) => ({
          signal: String(s.signal ?? "").trim(),
          weight: clamp01(s.weight ?? 0.5),
        }))
        .filter((s) => s.signal.length > 0)
        .slice(0, 6)
    : [];

  const suggestions = Array.isArray(parsed.suggestions)
    ? (parsed.suggestions as unknown[])
        .map((s) => String(s).trim())
        .filter((s) => s.length > 0)
        .slice(0, 5)
    : [];

  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    inputType: input.type,
    primaryState,
    primaryLabel:
      String(parsed.primaryLabel ?? "").trim() ||
      `Likely ${primaryState}`,
    confidence,
    distribution,
    signals,
    explanation: String(parsed.explanation ?? "").trim(),
    suggestions,
    provider: "gemini",
  };
}

export async function refineAnalysisWithContext(
  analysis: AnalysisResult,
  context: RefinementContext,
  profile: BabyProfile | null,
  _history: AnalysisResult[],
  opts: GeminiOptions = {}
): Promise<AnalysisResult> {
  const lang: Language = opts.language ?? "en";
  const ctxText = [
    `Previous interpretation: ${analysis.primaryLabel} (${Math.round(analysis.confidence * 100)}% confidence).`,
    `Previous distribution: ${JSON.stringify(analysis.distribution)}.`,
    `Previous signals: ${analysis.signals.map((s) => s.signal).join(", ")}.`,
    typeof context.hoursSinceLastFeed === "number"
      ? `Hours since last feed: ${context.hoursSinceLastFeed}.`
      : "",
    typeof context.wakeDurationMinutes === "number"
      ? `Wake duration so far: ${context.wakeDurationMinutes} minutes.`
      : "",
    context.freeText ? `Parent notes: ${context.freeText}.` : "",
    profile?.feedingIntervalHours
      ? `Typical feeding interval: ${profile.feedingIntervalHours} h.`
      : "",
    profile?.wakeWindowMinutes
      ? `Typical wake window: ${profile.wakeWindowMinutes} min.`
      : "",
    "Re-evaluate the baby's state given this added context. Adjust the distribution and confidence accordingly. Keep the same JSON shape and provide a one-sentence rationale explaining what changed and why.",
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await callGemini(
    [{ text: ctxText }],
    REFINE_SCHEMA,
    systemInstructionFor(lang)
  );

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new GeminiUnavailableError("Could not parse Gemini JSON output.");
  }

  const distribution = normalizeDistribution(parsed.distribution);
  let primaryState = (parsed.primaryState as BabyState) ?? analysis.primaryState;
  if (!ALL_STATES.includes(primaryState)) primaryState = analysis.primaryState;

  const confidence = clamp01(
    parsed.confidence ?? distribution[primaryState] ?? analysis.confidence
  );

  return {
    ...analysis,
    distribution,
    primaryState,
    primaryLabel:
      String(parsed.primaryLabel ?? analysis.primaryLabel).trim() ||
      analysis.primaryLabel,
    confidence,
    refinement: {
      context,
      confidenceBefore: analysis.confidence,
      confidenceAfter: confidence,
      rationale:
        String(parsed.rationale ?? "").trim() ||
        "Context aligns with the original interpretation.",
    },
    provider: "gemini",
  };
}

export const geminiProvider = {
  analyzeBabyInput,
  refineAnalysisWithContext,
};
