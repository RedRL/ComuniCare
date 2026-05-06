import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  value: number; // 0..1
  label?: string;
  showDelta?: { from: number; to: number };
}

export function ConfidenceBar({ value, label = "Confidence", showDelta }: Props) {
  const { dir } = useLanguage();
  const pct = Math.round(value * 100);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-ink-500">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          {showDelta && (
            <span className="text-xs text-ink-400">
              {Math.round(showDelta.from * 100)}% {dir === "rtl" ? "←" : "→"}
            </span>
          )}
          <span className="text-2xl font-semibold tabular-nums text-ink-900">
            {pct}%
          </span>
        </div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-ink-900/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
