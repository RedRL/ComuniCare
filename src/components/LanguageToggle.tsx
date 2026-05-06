import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/translations";

const LABELS: Record<Language, string> = {
  en: "EN",
  he: "עב",
};

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage();

  const next: Language = language === "en" ? "he" : "en";

  return (
    <button
      onClick={() => setLanguage(next)}
      title={t.language.label}
      aria-label={`${t.language.label}: ${language === "en" ? t.language.he : t.language.en}`}
      className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-ink-700 shadow-sm transition active:scale-95"
    >
      <GlobeIcon />
      {compact ? (
        <span className="tabular-nums">{LABELS[language]}</span>
      ) : (
        <span>
          {LABELS[language]} · {LABELS[next]}
        </span>
      )}
    </button>
  );
}

function GlobeIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
