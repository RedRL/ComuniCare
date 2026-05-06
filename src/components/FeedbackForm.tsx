import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { BabyState, ParentFeedback } from "../models/types";
import { aiService } from "../services/aiService";
import { CheckIcon, HeartIcon } from "./Icon";

interface Props {
  existing?: ParentFeedback;
  onSubmit: (fb: ParentFeedback) => void;
}

export function FeedbackForm({ existing, onSubmit }: Props) {
  const { t } = useLanguage();
  const [rating, setRating] = useState<ParentFeedback["rating"] | null>(
    existing?.rating ?? null
  );
  const [actualState, setActualState] = useState<BabyState | undefined>(
    existing?.actualState
  );
  const [note, setNote] = useState(existing?.note ?? "");
  const [submitted, setSubmitted] = useState(!!existing);

  const ratingLabels: Record<ParentFeedback["rating"], string> = {
    yes: t.feedback.yes,
    partly: t.feedback.partly,
    no: t.feedback.no,
  };

  const choose = (r: ParentFeedback["rating"]) => {
    setRating(r);
    setSubmitted(false);
    if (r === "yes") {
      const fb: ParentFeedback = { rating: r };
      onSubmit(fb);
      setSubmitted(true);
    }
  };

  const submit = () => {
    if (!rating) return;
    const fb: ParentFeedback = {
      rating,
      actualState,
      note: note.trim() || undefined,
    };
    onSubmit(fb);
    setSubmitted(true);
  };

  return (
    <div className="card animate-slide-up">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-peach-soft text-orange-700">
          <HeartIcon size={18} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-ink-900">
            {t.feedback.title}
          </h3>
          <p className="text-xs text-ink-500">{t.feedback.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(["yes", "partly", "no"] as const).map((r) => (
          <button
            key={r}
            onClick={() => choose(r)}
            className={[
              "rounded-2xl border px-3 py-2.5 text-sm font-semibold transition",
              rating === r
                ? "border-ink-900 bg-ink-900 text-white"
                : "border-ink-900/10 bg-white text-ink-700 hover:bg-cream-100",
            ].join(" ")}
          >
            {ratingLabels[r]}
          </button>
        ))}
      </div>

      {(rating === "no" || rating === "partly") && (
        <div className="mt-4 space-y-3 animate-slide-up">
          <div>
            <label className="label">{t.feedback.actualState}</label>
            <div className="flex flex-wrap gap-2">
              {aiService.ALL_STATES
                .filter((s) => s !== "other")
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => setActualState(s)}
                    className={[
                      "pill border transition",
                      actualState === s
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-ink-900/10 bg-white text-ink-700",
                    ].join(" ")}
                  >
                    {t.states[s]}
                  </button>
                ))}
            </div>
          </div>
          <div>
            <label className="label">{t.feedback.noteLabel}</label>
            <input
              className="input"
              placeholder={t.feedback.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <button
            onClick={submit}
            disabled={!actualState}
            className="btn-primary w-full disabled:opacity-50"
          >
            {t.feedback.save}
          </button>
        </div>
      )}

      {submitted && rating === "yes" && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <CheckIcon size={14} /> {t.feedback.savedYes}
        </p>
      )}
      {submitted && rating !== "yes" && rating !== null && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <CheckIcon size={14} /> {t.feedback.savedOther}
        </p>
      )}
    </div>
  );
}
