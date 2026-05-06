import { useAIMode } from "../hooks/useAIMode";
import { useLanguage } from "../i18n/LanguageContext";
import { SparkleIcon, ZapIcon } from "./Icon";

export function AIModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, keyAvailable } = useAIMode();
  const { t } = useLanguage();

  if (!keyAvailable) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-ink-500 shadow-sm"
        title={t.ai.titleNoKey}
      >
        <SparkleIcon size={14} />
        {t.ai.mockOnly}
      </span>
    );
  }

  const isReal = mode === "real";

  return (
    <button
      onClick={() => setMode(isReal ? "mock" : "real")}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition",
        isReal
          ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white"
          : "bg-white/80 text-ink-700",
      ].join(" ")}
      title={isReal ? t.ai.titleSwitchOn : t.ai.titleSwitchOff}
    >
      {isReal ? <ZapIcon size={14} /> : <SparkleIcon size={14} />}
      {compact
        ? isReal
          ? t.ai.geminiShort
          : t.ai.mockShort
        : isReal
          ? t.ai.geminiLong
          : t.ai.mockLong}
    </button>
  );
}
