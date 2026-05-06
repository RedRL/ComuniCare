import { useLanguage } from "../i18n/LanguageContext";
import type { BabyState } from "../models/types";

const TONES: Record<BabyState, string> = {
  tired: "bg-lavender-soft text-indigo-700",
  overstimulated: "bg-peach-soft text-orange-700",
  hungry: "bg-mint-soft text-emerald-700",
  discomfort: "bg-rose-100 text-rose-700",
  content: "bg-sky-soft text-sky-800",
  playful: "bg-yellow-100 text-amber-700",
  other: "bg-ink-900/5 text-ink-700",
};

interface Props {
  state: BabyState;
  size?: "sm" | "md";
}

export function StateChip({ state, size = "sm" }: Props) {
  const { t } = useLanguage();
  const cls = TONES[state] ?? TONES.other;
  return (
    <span
      className={[
        "pill",
        cls,
        size === "md" ? "px-3.5 py-1.5 text-sm" : "",
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {t.states[state]}
    </span>
  );
}
