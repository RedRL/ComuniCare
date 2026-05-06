import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { storage } from "../services/storageService";
import {
  RTL_LANGUAGES,
  isLanguage,
  messages,
  type Language,
  type Messages,
} from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (l: Language) => void;
  t: Messages;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLanguage(): Language {
  const stored = storage.getLanguage();
  if (isLanguage(stored)) return stored;
  if (typeof navigator !== "undefined") {
    const lang = (navigator.language || "en").toLowerCase();
    if (lang.startsWith("he")) return "he";
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    detectInitialLanguage()
  );

  const dir: "ltr" | "rtl" = RTL_LANGUAGES.includes(language) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.body.dir = dir;
    document.title = messages[language].common.pageTitle;
  }, [language, dir]);

  const setLanguage = useCallback((l: Language) => {
    storage.setLanguage(l);
    setLanguageState(l);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t: messages[language], dir }),
    [language, setLanguage, dir]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}
