import { useLanguage } from "../i18n/LanguageContext";
import type { AIProviderTag } from "../models/types";
import { InfoIcon, SparkleIcon, ZapIcon } from "./Icon";

interface Props {
  provider?: AIProviderTag;
  note?: string;
}

export function ProviderBadge({ provider, note }: Props) {
  const { t } = useLanguage();
  if (!provider) return null;
  if (provider === "gemini") {
    return (
      <span className="pill bg-gradient-to-r from-indigo-100 to-emerald-100 text-indigo-800">
        <ZapIcon size={12} />
        {t.ai.realBadge}
      </span>
    );
  }
  if (provider === "mock-fallback") {
    return (
      <span title={note} className="pill bg-peach-soft text-orange-800">
        <InfoIcon size={12} />
        {t.ai.fallbackBadge}
      </span>
    );
  }
  return (
    <span className="pill bg-ink-900/5 text-ink-700">
      <SparkleIcon size={12} />
      {t.ai.mockBadge}
    </span>
  );
}
