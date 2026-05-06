import { useLanguage } from "../i18n/LanguageContext";
import type { BabyState } from "../models/types";
import { aiService } from "../services/aiService";

interface Props {
  distribution: Record<BabyState, number>;
}

const COLORS: Record<BabyState, string> = {
  tired: "bg-indigo-400",
  overstimulated: "bg-orange-400",
  hungry: "bg-emerald-400",
  discomfort: "bg-rose-400",
  content: "bg-sky-400",
  playful: "bg-amber-400",
  other: "bg-ink-400",
};

export function DistributionList({ distribution }: Props) {
  const { t } = useLanguage();
  const items = aiService.ALL_STATES.map((s) => ({
    state: s,
    value: distribution[s] ?? 0,
  }))
    .filter((x) => x.value >= 0.01)
    .sort((a, b) => b.value - a.value);

  return (
    <ul className="space-y-2.5">
      {items.map(({ state, value }) => {
        const pct = Math.round(value * 100);
        return (
          <li key={state} className="flex items-center gap-3">
            <span className="w-28 text-sm text-ink-700">{t.states[state]}</span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-ink-900/5">
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${COLORS[state]} transition-[width] duration-500`}
                style={{ width: `${Math.max(2, pct)}%` }}
              />
            </div>
            <span className="w-10 text-end text-sm font-semibold tabular-nums text-ink-900">
              {pct}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}
