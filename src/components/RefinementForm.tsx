import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { RefinementContext } from "../models/types";
import { ArrowRightIcon, SparkleIcon } from "./Icon";

interface Props {
  defaultFeedingIntervalHours?: number;
  defaultWakeWindowMinutes?: number;
  onSubmit: (ctx: RefinementContext) => void;
  busy?: boolean;
}

export function RefinementForm({
  defaultFeedingIntervalHours,
  defaultWakeWindowMinutes,
  onSubmit,
  busy,
}: Props) {
  const { t } = useLanguage();
  const [hoursSinceLastFeed, setHours] = useState<number | "">(
    defaultFeedingIntervalHours ?? 2.5
  );
  const [wakeDurationMinutes, setWake] = useState<number | "">(
    defaultWakeWindowMinutes ? defaultWakeWindowMinutes + 20 : 90
  );
  const [freeText, setFreeText] = useState("");

  const submit = () => {
    onSubmit({
      hoursSinceLastFeed:
        typeof hoursSinceLastFeed === "number" ? hoursSinceLastFeed : undefined,
      wakeDurationMinutes:
        typeof wakeDurationMinutes === "number" ? wakeDurationMinutes : undefined,
      freeText: freeText.trim() || undefined,
    });
  };

  return (
    <div className="card animate-slide-up">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-lavender-soft text-indigo-700">
          <SparkleIcon size={18} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-ink-900">
            {t.refine.title}
          </h3>
          <p className="text-xs text-ink-500">{t.refine.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{t.refine.lastFeedLabel}</label>
          <input
            type="number"
            min={0}
            max={12}
            step={0.5}
            className="input"
            value={hoursSinceLastFeed}
            onChange={(e) =>
              setHours(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>
        <div>
          <label className="label">{t.refine.awakeLabel}</label>
          <input
            type="number"
            min={0}
            max={300}
            step={5}
            className="input"
            value={wakeDurationMinutes}
            onChange={(e) =>
              setWake(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="label">{t.refine.freeTextLabel}</label>
        <textarea
          className="input min-h-[64px]"
          placeholder={t.refine.freeTextPlaceholder}
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
        />
      </div>

      <button
        onClick={submit}
        disabled={busy}
        className="btn-primary mt-4 w-full disabled:opacity-50"
      >
        {busy ? t.refine.submitting : t.refine.submit}
        <ArrowRightIcon size={18} />
      </button>
    </div>
  );
}
