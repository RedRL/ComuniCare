export type BabyState =
  | "tired"
  | "overstimulated"
  | "hungry"
  | "discomfort"
  | "content"
  | "playful"
  | "other";

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string; // ISO date
  feedingIntervalHours?: number;
  wakeWindowMinutes?: number;
  notes?: string;
  createdAt: string;
}

export type AnalysisInputType = "video" | "audio" | "image" | "demo";

export interface AnalysisInput {
  type: AnalysisInputType;
  fileName?: string;
  mimeType?: string;
  durationSec?: number;
  /** transient blob url for preview only; not persisted */
  previewUrl?: string;
  /** transient File reference for real-AI providers; not persisted */
  file?: File;
}

export type AIMode = "mock" | "real";
export type AIProviderTag = "mock" | "gemini" | "mock-fallback";

export interface SignalEvidence {
  signal: string;
  weight: number; // 0..1
}

export interface RefinementContext {
  hoursSinceLastFeed?: number;
  wakeDurationMinutes?: number;
  freeText?: string;
}

export interface ParentFeedback {
  rating: "yes" | "partly" | "no";
  actualState?: BabyState;
  note?: string;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  inputType: AnalysisInputType;
  primaryState: BabyState;
  primaryLabel: string;
  confidence: number; // 0..1
  distribution: Record<BabyState, number>;
  signals: SignalEvidence[];
  explanation: string;
  suggestions: string[];
  refinement?: {
    context: RefinementContext;
    confidenceBefore: number;
    confidenceAfter: number;
    rationale: string;
  };
  feedback?: ParentFeedback;
  /** which engine produced this result */
  provider?: AIProviderTag;
  /** human-readable note when fallback occurred */
  providerNote?: string;
}

export interface PersonalInsight {
  id: string;
  title: string;
  detail: string;
  tone: "info" | "positive" | "watch";
}

export interface ParentAdvice {
  id: string;
  title: string;
  body: string;
}
