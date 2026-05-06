import type { AIMode, AnalysisResult, BabyProfile } from "../models/types";

const KEYS = {
  profile: "tinysignals.babyProfile",
  history: "tinysignals.analysisHistory",
  onboarded: "tinysignals.onboarded",
  aiMode: "tinysignals.aiMode",
  language: "tinysignals.language",
} as const;

function safeRead<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors silently in demo
  }
}

export const storage = {
  getProfile(): BabyProfile | null {
    return safeRead<BabyProfile>(KEYS.profile);
  },
  setProfile(profile: BabyProfile | null): void {
    if (!profile) {
      localStorage.removeItem(KEYS.profile);
      return;
    }
    safeWrite(KEYS.profile, profile);
  },
  getHistory(): AnalysisResult[] {
    return safeRead<AnalysisResult[]>(KEYS.history) ?? [];
  },
  setHistory(history: AnalysisResult[]): void {
    safeWrite(KEYS.history, history);
  },
  getOnboarded(): boolean {
    return safeRead<boolean>(KEYS.onboarded) === true;
  },
  setOnboarded(value: boolean): void {
    safeWrite(KEYS.onboarded, value);
  },
  getAIMode(): AIMode {
    return safeRead<AIMode>(KEYS.aiMode) ?? "mock";
  },
  setAIMode(value: AIMode): void {
    safeWrite(KEYS.aiMode, value);
  },
  getLanguage(): string | null {
    return safeRead<string>(KEYS.language);
  },
  setLanguage(value: string): void {
    safeWrite(KEYS.language, value);
  },
  reset(): void {
    localStorage.removeItem(KEYS.profile);
    localStorage.removeItem(KEYS.history);
    localStorage.removeItem(KEYS.onboarded);
    localStorage.removeItem(KEYS.aiMode);
    localStorage.removeItem(KEYS.language);
  },
};
