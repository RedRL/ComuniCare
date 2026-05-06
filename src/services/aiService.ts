import type {
  AnalysisInput,
  AnalysisResult,
  BabyProfile,
  BabyState,
  ParentAdvice,
  PersonalInsight,
  RefinementContext,
  SignalEvidence,
} from "../models/types";
import {
  geminiProvider,
  GeminiUploadTooLargeError,
} from "./providers/geminiProvider";
import { type Language, messages } from "../i18n/translations";
import { mockContent } from "./mockContent";

/**
 * MOCK AI SERVICE
 * ---------------------------------------------------------------
 * This module simulates the behavior of a multimodal baby-signal
 * interpretation model and acts as a dispatcher to a real provider
 * (Gemini) when enabled. To swap in another provider, replace the
 * function bodies — the public signatures stay stable.
 */

const STATE_LABELS: Record<BabyState, string> = {
  tired: "Tired",
  overstimulated: "Overstimulated",
  hungry: "Hungry",
  discomfort: "Discomfort",
  content: "Content",
  playful: "Playful",
  other: "Other",
};

const ALL_STATES: BabyState[] = [
  "tired",
  "overstimulated",
  "hungry",
  "discomfort",
  "content",
  "playful",
  "other",
];

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function normalize(
  dist: Partial<Record<BabyState, number>>
): Record<BabyState, number> {
  const filled: Record<BabyState, number> = {
    tired: 0,
    overstimulated: 0,
    hungry: 0,
    discomfort: 0,
    content: 0,
    playful: 0,
    other: 0,
  };
  for (const s of ALL_STATES) filled[s] = Math.max(0, dist[s] ?? 0);
  const sum = ALL_STATES.reduce((a, s) => a + filled[s], 0) || 1;
  for (const s of ALL_STATES) filled[s] = clamp01(filled[s] / sum);
  return filled;
}

function topState(dist: Record<BabyState, number>): {
  state: BabyState;
  confidence: number;
} {
  let state: BabyState = "other";
  let confidence = 0;
  for (const s of ALL_STATES) {
    if (dist[s] > confidence) {
      confidence = dist[s];
      state = s;
    }
  }
  return { state, confidence };
}

function ageMonths(profile?: BabyProfile | null): number | null {
  if (!profile?.birthDate) return null;
  const birth = new Date(profile.birthDate).getTime();
  if (Number.isNaN(birth)) return null;
  const months = (Date.now() - birth) / (1000 * 60 * 60 * 24 * 30.4375);
  return Math.max(0, months);
}

/* ----------------------------- DEMO BLOCK ----------------------------- */

function buildDemoSignals(lang: Language): SignalEvidence[] {
  const labels = messages[lang].demo.signals;
  return [
    { signal: labels[0], weight: 0.86 },
    { signal: labels[1], weight: 0.78 },
    { signal: labels[2], weight: 0.72 },
    { signal: labels[3], weight: 0.66 },
    { signal: labels[4], weight: 0.41 },
  ];
}

function demoBaseDistribution(): Record<BabyState, number> {
  return normalize({
    tired: 0.74,
    overstimulated: 0.16,
    hungry: 0.07,
    other: 0.03,
  });
}

/* --------------------------- HEURISTIC BLOCK --------------------------- */

function heuristicSignalsFor(input: AnalysisInput): SignalEvidence[] {
  const seedHash = (input.fileName ?? input.type)
    .split("")
    .reduce((a, c) => (a + c.charCodeAt(0)) % 997, 7);

  // signal banks stay in English keywords for stable distribution scoring
  const banks: Record<AnalysisInput["type"], SignalEvidence[][]> = {
    video: [
      [
        { signal: "frequent gaze aversion", weight: 0.74 },
        { signal: "restless limb movement", weight: 0.69 },
        { signal: "tight fists", weight: 0.55 },
        { signal: "arching back briefly", weight: 0.42 },
      ],
      [
        { signal: "soft eye contact", weight: 0.82 },
        { signal: "relaxed shoulders", weight: 0.71 },
        { signal: "rhythmic breathing", weight: 0.6 },
      ],
      [
        { signal: "rooting motion", weight: 0.78 },
        { signal: "hand to mouth", weight: 0.7 },
        { signal: "lip smacking", weight: 0.55 },
      ],
    ],
    audio: [
      [
        { signal: "rhythmic, low-pitch cry", weight: 0.72 },
        { signal: "pauses between cries", weight: 0.58 },
        { signal: "gradual build-up", weight: 0.5 },
      ],
      [
        { signal: "sharp, sudden cry", weight: 0.81 },
        { signal: "high pitch peaks", weight: 0.66 },
        { signal: "brief silence after peak", weight: 0.42 },
      ],
      [
        { signal: "soft cooing", weight: 0.76 },
        { signal: "playful vocal bursts", weight: 0.62 },
      ],
    ],
    image: [
      [
        { signal: "furrowed brow", weight: 0.7 },
        { signal: "half-closed eyelids", weight: 0.66 },
      ],
      [
        { signal: "open, alert eyes", weight: 0.75 },
        { signal: "soft mouth, no tension", weight: 0.6 },
      ],
      [
        { signal: "raised cheeks", weight: 0.78 },
        { signal: "slight smile", weight: 0.7 },
      ],
    ],
    demo: [],
  };

  const bank = banks[input.type] ?? banks.video;
  return bank[seedHash % Math.max(1, bank.length)] ?? [];
}

function distributionFromSignals(
  signals: SignalEvidence[],
  inputType: AnalysisInput["type"]
): Record<BabyState, number> {
  const w = (kw: string[]) =>
    signals
      .filter((s) => kw.some((k) => s.signal.toLowerCase().includes(k)))
      .reduce((a, s) => a + s.weight, 0);

  const tired = w(["gaze", "yawn", "half", "eyelid", "soft eye"]) * 0.9;
  const over = w(["restless", "arch", "tight", "fist", "tension"]) * 0.85;
  const hungry = w(["root", "hand to mouth", "lip", "smack"]) * 1.0;
  const discomfort = w(["sharp", "sudden", "high pitch", "furrow"]) * 0.95;
  const content = w(["relaxed", "rhythmic breath", "soft mouth"]) * 0.9;
  const playful = w(["coo", "smile", "cheek", "playful", "alert"]) * 0.95;

  const bias: Record<
    AnalysisInput["type"],
    Partial<Record<BabyState, number>>
  > = {
    video: { tired: 0.1, overstimulated: 0.08 },
    audio: { discomfort: 0.1, hungry: 0.06 },
    image: { content: 0.08, playful: 0.05 },
    demo: { tired: 0.2, overstimulated: 0.05 },
  };

  const raw: Partial<Record<BabyState, number>> = {
    tired: tired + (bias[inputType].tired ?? 0),
    overstimulated: over + (bias[inputType].overstimulated ?? 0),
    hungry: hungry + (bias[inputType].hungry ?? 0),
    discomfort: discomfort + (bias[inputType].discomfort ?? 0),
    content: content + (bias[inputType].content ?? 0),
    playful: playful + (bias[inputType].playful ?? 0),
    other: 0.04,
  };

  const total = ALL_STATES.reduce((a, s) => a + (raw[s] ?? 0), 0);
  if (total < 0.05) {
    return normalize({ tired: 0.4, content: 0.3, other: 0.3 });
  }
  return normalize(raw);
}

function explanationFor(state: BabyState, lang: Language): string {
  return mockContent[lang].explanations[state];
}

function suggestionsFor(state: BabyState, lang: Language): string[] {
  return mockContent[lang].suggestions[state];
}

/* ------------------------------ PUBLIC API ------------------------------ */

export interface AnalyzeOptions {
  /** when true, returns the canonical demo result */
  demo?: boolean;
  /** simulated processing delay (ms) for nicer UX */
  delayMs?: number;
  /** when true, route to the real provider (Gemini); falls back to mock on error */
  realAI?: boolean;
  /** UI language for textual outputs */
  language?: Language;
}

async function mockAnalyzeBabyInput(
  input: AnalysisInput,
  profile: BabyProfile | null,
  history: AnalysisResult[],
  opts: AnalyzeOptions = {}
): Promise<AnalysisResult> {
  const lang: Language = opts.language ?? "en";
  const t = messages[lang];
  const delay = opts.delayMs ?? (opts.demo ? 1300 : 1100);
  await new Promise((r) => setTimeout(r, delay));

  if (opts.demo || input.type === "demo") {
    const dist = demoBaseDistribution();
    const { state } = topState(dist);
    return {
      id: uid(),
      createdAt: new Date().toISOString(),
      inputType: "demo",
      primaryState: state,
      primaryLabel: t.demo.primaryLabel,
      confidence: 0.74,
      distribution: dist,
      signals: buildDemoSignals(lang),
      explanation: t.demo.explanation,
      suggestions: t.demo.suggestions,
      provider: "mock",
    };
  }

  const signals = heuristicSignalsFor(input);
  const distribution = distributionFromSignals(signals, input.type);
  const { state, confidence } = topState(distribution);

  const months = ageMonths(profile);
  const adjusted =
    months !== null && months < 4 && state === "overstimulated"
      ? Math.min(0.95, confidence + 0.04)
      : confidence;

  const recent = history.slice(0, 5);
  const recurrence =
    recent.filter((r) => r.primaryState === state).length /
    Math.max(1, recent.length);
  const finalConfidence = clamp01(adjusted + recurrence * 0.04);

  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    inputType: input.type,
    primaryState: state,
    primaryLabel: mockContent[lang].likelyTemplate(t.states[state]),
    confidence: finalConfidence,
    distribution,
    signals,
    explanation: explanationFor(state, lang),
    suggestions: suggestionsFor(state, lang),
    provider: "mock",
  };
}

async function mockRefineAnalysisWithContext(
  analysis: AnalysisResult,
  context: RefinementContext,
  profile: BabyProfile | null,
  lang: Language
): Promise<AnalysisResult> {
  const t = messages[lang];
  const mc = mockContent[lang];
  await new Promise((r) => setTimeout(r, 700));

  const dist = { ...analysis.distribution };
  const reasons: string[] = [];

  if (typeof context.wakeDurationMinutes === "number") {
    const expected = profile?.wakeWindowMinutes ?? 75;
    const overBy = context.wakeDurationMinutes - expected;
    if (overBy > 10) {
      dist.tired = (dist.tired ?? 0) + 0.18;
      dist.overstimulated = (dist.overstimulated ?? 0) + 0.04;
      reasons.push(mc.refine.longWake(context.wakeDurationMinutes));
    } else if (overBy < -20) {
      dist.tired = Math.max(0, (dist.tired ?? 0) - 0.08);
      reasons.push(mc.refine.shortWake);
    }
  }

  if (typeof context.hoursSinceLastFeed === "number") {
    const interval = profile?.feedingIntervalHours ?? 3;
    if (context.hoursSinceLastFeed < interval - 0.5) {
      dist.hungry = Math.max(0, (dist.hungry ?? 0) - 0.12);
      reasons.push(mc.refine.recentFeed(context.hoursSinceLastFeed));
    } else if (context.hoursSinceLastFeed > interval + 0.5) {
      dist.hungry = (dist.hungry ?? 0) + 0.14;
      reasons.push(mc.refine.longSinceFeed(context.hoursSinceLastFeed));
    }
  }

  if (context.freeText) {
    const txt = context.freeText.toLowerCase();
    if (
      /loud|guests|tv|noise|busy|רעש|אורח|הומ/.test(txt)
    ) {
      dist.overstimulated = (dist.overstimulated ?? 0) + 0.06;
      reasons.push(mc.refine.busyEnv);
    }
    if (/teeth|gum|שן|חניכ/.test(txt)) {
      dist.discomfort = (dist.discomfort ?? 0) + 0.1;
      reasons.push(mc.refine.teething);
    }
    if (/cold|warm|hot|fever|חום|קר|חמ/.test(txt)) {
      dist.discomfort = (dist.discomfort ?? 0) + 0.08;
      reasons.push(mc.refine.temperature);
    }
  }

  const normalized = normalize(dist);
  const { state, confidence } = topState(normalized);
  const after = clamp01(confidence + 0.06);

  return {
    ...analysis,
    distribution: normalized,
    primaryState: state,
    primaryLabel:
      state === analysis.primaryState
        ? analysis.primaryLabel
        : mc.likelyTemplate(t.states[state]),
    confidence: after,
    explanation: explanationFor(state, lang),
    suggestions: suggestionsFor(state, lang),
    refinement: {
      context,
      confidenceBefore: analysis.confidence,
      confidenceAfter: after,
      rationale:
        reasons.length > 0 ? reasons.join(". ") + "." : mc.refine.aligned,
    },
    provider: "mock",
  };
}

function fallbackNote(err: unknown, lang: Language): string {
  const note =
    lang === "he"
      ? "AI אמיתי אינו זמין. מוצגת תוצאת AI מדומה."
      : "Real AI unavailable. Showing mock result instead.";
  if (err instanceof GeminiUploadTooLargeError) {
    return lang === "he"
      ? "הקובץ גדול מדי לקריאה ישירה ל-AI (מעל 18MB). מוצגת תוצאת AI מדומה."
      : "File too large for inline AI call (>18 MB). Showing mock result instead.";
  }
  return note;
}

export async function analyzeBabyInput(
  input: AnalysisInput,
  profile: BabyProfile | null,
  history: AnalysisResult[],
  opts: AnalyzeOptions = {}
): Promise<AnalysisResult> {
  const lang: Language = opts.language ?? "en";

  if (opts.demo || input.type === "demo") {
    return mockAnalyzeBabyInput(input, profile, history, opts);
  }

  if (opts.realAI && input.file) {
    try {
      return await geminiProvider.analyzeBabyInput(input, profile, history, {
        language: lang,
      });
    } catch (err) {
      console.error("[aiService] Gemini failed, falling back to mock:", err);
      const mock = await mockAnalyzeBabyInput(input, profile, history, opts);
      return {
        ...mock,
        provider: "mock-fallback",
        providerNote: fallbackNote(err, lang),
      };
    }
  }

  return mockAnalyzeBabyInput(input, profile, history, opts);
}

export async function refineAnalysisWithContext(
  analysis: AnalysisResult,
  context: RefinementContext,
  profile: BabyProfile | null,
  history: AnalysisResult[],
  opts: { realAI?: boolean; language?: Language } = {}
): Promise<AnalysisResult> {
  const lang: Language = opts.language ?? "en";

  if (opts.realAI && analysis.provider === "gemini") {
    try {
      return await geminiProvider.refineAnalysisWithContext(
        analysis,
        context,
        profile,
        history,
        { language: lang }
      );
    } catch (err) {
      console.error(
        "[aiService] Gemini refine failed, falling back to mock:",
        err
      );
      const mock = await mockRefineAnalysisWithContext(
        analysis,
        context,
        profile,
        lang
      );
      return {
        ...mock,
        provider: "mock-fallback",
        providerNote: fallbackNote(err, lang),
      };
    }
  }
  return mockRefineAnalysisWithContext(analysis, context, profile, lang);
}

export interface ContentOptions {
  language?: Language;
}

export async function generateParentAdvice(
  profile: BabyProfile | null,
  history: AnalysisResult[],
  opts: ContentOptions = {}
): Promise<ParentAdvice[]> {
  const lang: Language = opts.language ?? "en";
  const mc = mockContent[lang];
  await new Promise((r) => setTimeout(r, 250));

  const advice: ParentAdvice[] = [];

  if (!profile) {
    advice.push({ id: uid(), ...mc.advice.addProfile });
  }

  if (history.length === 0) {
    advice.push({ id: uid(), ...mc.advice.tryDemo });
    return advice;
  }

  const counts = new Map<BabyState, number>();
  for (const r of history) {
    counts.set(r.primaryState, (counts.get(r.primaryState) ?? 0) + 1);
  }
  const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  if (dominant === "tired") advice.push({ id: uid(), ...mc.advice.windDown });
  if (dominant === "overstimulated")
    advice.push({ id: uid(), ...mc.advice.resets });
  if (dominant === "hungry")
    advice.push({ id: uid(), ...mc.advice.catchHunger });

  advice.push({ id: uid(), ...mc.advice.youKnowBest });

  return advice;
}

export async function generatePersonalInsights(
  profile: BabyProfile | null,
  history: AnalysisResult[],
  opts: ContentOptions = {}
): Promise<PersonalInsight[]> {
  const lang: Language = opts.language ?? "en";
  const mc = mockContent[lang];
  await new Promise((r) => setTimeout(r, 250));

  if (history.length === 0) {
    return [
      {
        id: uid(),
        title: mc.insights.firstTime.title,
        detail: mc.insights.firstTime.detail,
        tone: "info",
      },
    ];
  }

  const insights: PersonalInsight[] = [];
  const byHour = new Map<number, BabyState[]>();
  for (const r of history) {
    const h = new Date(r.createdAt).getHours();
    const list = byHour.get(h) ?? [];
    list.push(r.primaryState);
    byHour.set(h, list);
  }

  const tiredEvening = [...byHour.entries()]
    .filter(([h]) => h >= 17 && h <= 21)
    .flatMap(([, s]) => s)
    .filter((s) => s === "tired").length;
  if (tiredEvening >= 2) {
    insights.push({
      id: uid(),
      title: mc.insights.tiredEvening.title,
      detail: mc.insights.tiredEvening.detail,
      tone: "watch",
    });
  }

  const interval = profile?.feedingIntervalHours ?? 3;
  const hungryCount = history.filter((r) => r.primaryState === "hungry").length;
  if (hungryCount >= 2) {
    const i = mc.insights.hungerInterval(interval);
    insights.push({
      id: uid(),
      title: i.title,
      detail: i.detail,
      tone: "info",
    });
  }

  const confirmed = history.filter((r) => r.feedback?.rating === "yes").length;
  if (confirmed > 0) {
    const i = mc.insights.confirmed(confirmed);
    insights.push({
      id: uid(),
      title: i.title,
      detail: i.detail,
      tone: "positive",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: uid(),
      title: mc.insights.forming.title,
      detail: mc.insights.forming.detail,
      tone: "info",
    });
  }
  return insights;
}

export const aiService = {
  analyzeBabyInput,
  refineAnalysisWithContext,
  generateParentAdvice,
  generatePersonalInsights,
  STATE_LABELS,
  ALL_STATES,
};
