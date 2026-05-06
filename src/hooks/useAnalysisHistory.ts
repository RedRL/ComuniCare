import { useCallback, useEffect, useState } from "react";
import type { AnalysisResult, ParentFeedback } from "../models/types";
import { storage } from "../services/storageService";

export function useAnalysisHistory() {
  const [history, setHistoryState] = useState<AnalysisResult[]>(() =>
    storage.getHistory()
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tinysignals.analysisHistory") {
        setHistoryState(storage.getHistory());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: AnalysisResult[]) => {
    storage.setHistory(next);
    setHistoryState(next);
  }, []);

  const addAnalysis = useCallback(
    (result: AnalysisResult) => {
      const next = [result, ...storage.getHistory()].slice(0, 200);
      persist(next);
    },
    [persist]
  );

  const updateAnalysis = useCallback(
    (result: AnalysisResult) => {
      const cur = storage.getHistory();
      const next = cur.map((r) => (r.id === result.id ? result : r));
      persist(next);
    },
    [persist]
  );

  const setFeedback = useCallback(
    (id: string, feedback: ParentFeedback) => {
      const cur = storage.getHistory();
      const next = cur.map((r) => (r.id === id ? { ...r, feedback } : r));
      persist(next);
    },
    [persist]
  );

  const clearHistory = useCallback(() => {
    persist([]);
  }, [persist]);

  return {
    history,
    addAnalysis,
    updateAnalysis,
    setFeedback,
    clearHistory,
  };
}
