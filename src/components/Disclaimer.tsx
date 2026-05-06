import { useLanguage } from "../i18n/LanguageContext";
import { InfoIcon } from "./Icon";

export function Disclaimer({ tone = "soft" }: { tone?: "soft" | "tight" }) {
  const { t } = useLanguage();
  return (
    <p
      className={[
        "flex items-start gap-2 text-xs leading-relaxed text-ink-500",
        tone === "tight" ? "" : "rounded-2xl bg-cream-100/80 p-3",
      ].join(" ")}
    >
      <InfoIcon size={14} className="mt-0.5 shrink-0" />
      <span>{t.disclaimer}</span>
    </p>
  );
}
