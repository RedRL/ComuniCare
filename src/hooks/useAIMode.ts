import { useCallback, useEffect, useState } from "react";
import type { AIMode } from "../models/types";
import { storage } from "../services/storageService";

export function isGeminiKeyAvailable(): boolean {
  const k = (import.meta.env.VITE_GEMINI_API_KEY ?? "").toString().trim();
  return k.length > 0;
}

export function useAIMode() {
  const [mode, setModeState] = useState<AIMode>(() => storage.getAIMode());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tinysignals.aiMode") setModeState(storage.getAIMode());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setMode = useCallback((next: AIMode) => {
    storage.setAIMode(next);
    setModeState(next);
  }, []);

  const keyAvailable = isGeminiKeyAvailable();
  const effectiveMode: AIMode = mode === "real" && keyAvailable ? "real" : "mock";

  return { mode, setMode, keyAvailable, effectiveMode };
}
