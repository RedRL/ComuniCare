import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AIModeToggle } from "../components/AIModeToggle";
import { ArrowLeftIcon, ArrowRightIcon } from "../components/Icon";
import { LanguageToggle } from "../components/LanguageToggle";
import { PageHeader } from "../components/PageHeader";
import { useAIMode } from "../hooks/useAIMode";
import { useBabyProfile } from "../hooks/useBabyProfile";
import { useLanguage } from "../i18n/LanguageContext";
import type { BabyProfile } from "../models/types";
import { storage } from "../services/storageService";

function todayMinusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function normalizeWakeWindow(minutes?: number): number {
  if (!minutes) return 90;
  if (minutes < 60) return 45;
  if (minutes <= 120) return 90;
  if (minutes <= 180) return 150;
  if (minutes <= 240) return 210;
  if (minutes <= 360) return 300;
  return 390;
}

export function SetupPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useBabyProfile();
  const { keyAvailable } = useAIMode();
  const { t } = useLanguage();

  const [name, setName] = useState(profile?.name ?? "");
  const [birthDate, setBirthDate] = useState(
    profile?.birthDate?.slice(0, 10) ?? todayMinusDays(60)
  );
  const [feedingIntervalHours, setFeeding] = useState<number | "">(
    profile?.feedingIntervalHours ?? 3
  );
  const [wakeWindowMinutes, setWake] = useState<number>(
    normalizeWakeWindow(profile?.wakeWindowMinutes)
  );
  const [notes, setNotes] = useState(profile?.notes ?? "");

  const canSave = name.trim().length > 0 && !!birthDate;

  const save = () => {
    if (!canSave) return;
    const next: BabyProfile = {
      id: profile?.id ?? crypto.randomUUID(),
      name: name.trim(),
      birthDate: new Date(birthDate).toISOString(),
      feedingIntervalHours:
        typeof feedingIntervalHours === "number"
          ? feedingIntervalHours
          : undefined,
      wakeWindowMinutes,
      notes: notes.trim() || undefined,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    };
    setProfile(next);
    storage.setOnboarded(true);
    navigate("/analyze");
  };

  return (
    <main className="page">
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="-ms-1 inline-flex items-center gap-1 text-sm text-ink-500"
        >
          <ArrowLeftIcon size={16} />
          {t.setup.back}
        </button>
        <LanguageToggle />
      </div>
      <PageHeader
        eyebrow={t.setup.eyebrow}
        title={t.setup.title}
        subtitle={t.setup.subtitle}
      />

      <section className="card animate-slide-up space-y-4">
        <div>
          <label className="label" htmlFor="name">
            {t.setup.nameLabel}
          </label>
          <input
            id="name"
            className="input"
            placeholder={t.setup.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="bd">
            {t.setup.birthDateLabel}
          </label>
          <input
            id="bd"
            type="date"
            className="input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </section>

      {keyAvailable && (
        <>
          <h2 className="mb-2 mt-6 text-sm font-semibold text-ink-700">
            {t.setup.aiSectionTitle}
          </h2>
          <section className="card flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink-900">
                {t.setup.aiCardTitle}
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
                {t.setup.aiCardBody}
              </p>
            </div>
            <AIModeToggle compact />
          </section>
        </>
      )}

      <h2 className="mb-2 mt-6 text-sm font-semibold text-ink-700">
        {t.setup.optionalTitle}
      </h2>
      <section className="card animate-slide-up space-y-4">
        <div>
          <div>
            <label className="label" htmlFor="feeding">
              {t.setup.feedingLabel}
            </label>
            <input
              id="feeding"
              type="number"
              min={1}
              max={6}
              step={0.5}
              className="input"
              value={feedingIntervalHours}
              onChange={(e) =>
                setFeeding(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>
        </div>

        <fieldset>
          <legend className="label">{t.setup.wakeLabel}</legend>
          <div className="grid grid-cols-2 gap-2">
            {t.setup.wakeOptions.map((option) => (
              <label
                key={option.value}
                className={[
                  "flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition",
                  wakeWindowMinutes === option.value
                    ? "border-brand-coral bg-brand-coralWash text-brand-navy shadow-sm"
                    : "border-ink-900/10 bg-white/70 text-ink-700",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="wakeWindowMinutes"
                  value={option.value}
                  checked={wakeWindowMinutes === option.value}
                  onChange={() => setWake(option.value)}
                  className="h-4 w-4 accent-brand-coral"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="notes">
            {t.setup.notesLabel}
          </label>
          <textarea
            id="notes"
            className="input min-h-[88px]"
            placeholder={t.setup.notesPlaceholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[440px] px-5 pb-3 safe-bottom">
        <button
          disabled={!canSave}
          onClick={save}
          className="btn-primary w-full disabled:opacity-50"
        >
          {t.setup.save}
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </main>
  );
}
