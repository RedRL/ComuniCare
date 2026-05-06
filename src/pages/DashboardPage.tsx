import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Disclaimer } from "../components/Disclaimer";
import {
  ArrowRightIcon,
  CheckIcon,
  HeartIcon,
  MoonIcon,
  RefreshIcon,
  SparkleIcon,
  ZapIcon,
} from "../components/Icon";
import { LanguageToggle } from "../components/LanguageToggle";
import { PageHeader } from "../components/PageHeader";
import { StateBar } from "../components/StateBar";
import { StateChip } from "../components/StateChip";
import { StateDonut } from "../components/StateDonut";
import { useAnalysisHistory } from "../hooks/useAnalysisHistory";
import { useBabyAge } from "../hooks/useBabyAge";
import { useBabyProfile } from "../hooks/useBabyProfile";
import { useLanguage } from "../i18n/LanguageContext";
import type { Messages } from "../i18n/translations";
import type {
  BabyState,
  ParentAdvice,
  PersonalInsight,
} from "../models/types";
import { aiService } from "../services/aiService";

function formatAge(
  age: ReturnType<typeof useBabyAge>,
  t: Messages
): string | undefined {
  if (!age) return undefined;
  if (age.totalDays < 14) return t.age.days(age.totalDays);
  if (age.totalDays < 90) return t.age.weeks(Math.floor(age.totalDays / 7));
  return t.age.months(Math.floor(age.totalMonths));
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile, clearProfile } = useBabyProfile();
  const { history, clearHistory } = useAnalysisHistory();
  const age = useBabyAge(profile);
  const { t, language } = useLanguage();

  const [insights, setInsights] = useState<PersonalInsight[]>([]);
  const [advice, setAdvice] = useState<ParentAdvice[]>([]);

  useEffect(() => {
    let cancelled = false;
    aiService
      .generatePersonalInsights(profile, history, { language })
      .then((r) => !cancelled && setInsights(r));
    aiService
      .generateParentAdvice(profile, history, { language })
      .then((r) => !cancelled && setAdvice(r));
    return () => {
      cancelled = true;
    };
  }, [profile, history, language]);

  const stats = useMemo(() => {
    const counts: Record<BabyState, number> = {
      tired: 0,
      overstimulated: 0,
      hungry: 0,
      discomfort: 0,
      content: 0,
      playful: 0,
      other: 0,
    };
    let confirmed = 0;
    for (const r of history) {
      counts[r.primaryState] = (counts[r.primaryState] ?? 0) + 1;
      if (r.feedback?.rating === "yes") confirmed++;
    }
    const total = history.length;
    const distribution = aiService.ALL_STATES.map((s) => ({
      state: s,
      value: total > 0 ? counts[s] / total : 0,
    }));
    return { counts, confirmed, total, distribution };
  }, [history]);

  if (!profile) {
    return <EmptyProfileState onSetup={() => navigate("/setup")} />;
  }

  return (
    <main className="page">
      <PageHeader
        eyebrow={t.dashboard.eyebrow}
        title={profile.name}
        subtitle={formatAge(age, t)}
        action={
          <div className="flex flex-col items-end gap-1.5">
            <LanguageToggle compact />
            <button
              onClick={() => navigate("/setup")}
              className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-ink-700 shadow-sm"
            >
              {t.dashboard.edit}
            </button>
          </div>
        }
      />

      <section className="mb-3 grid grid-cols-3 gap-2">
        <Stat
          label={t.dashboard.statAnalyses}
          value={String(stats.total)}
          tone="bg-sky-softer"
        />
        <Stat
          label={t.dashboard.statConfirmed}
          value={String(stats.confirmed)}
          tone="bg-mint-softer"
        />
        <Stat
          label={t.dashboard.statPatterns}
          value={String(insights.length)}
          tone="bg-lavender-softer"
        />
      </section>

      <section className="card mb-3">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-900">
            {t.dashboard.distributionTitle}
          </h3>
          <span className="text-xs text-ink-400">
            {t.dashboard.distributionTotal(stats.total)}
          </span>
        </div>
        <StateDonut data={stats.distribution} />
        <DistributionLegend
          data={stats.distribution.filter((d) => d.value > 0)}
        />
      </section>

      <section className="card mb-3">
        <h3 className="mb-2 text-sm font-semibold text-ink-900">
          {t.dashboard.barTitle}
        </h3>
        <StateBar counts={stats.counts} />
      </section>

      <section className="mb-3">
        <h2 className="mb-2 px-1 text-sm font-semibold text-ink-700">
          {t.dashboard.insightsTitle}
        </h2>
        <ul className="space-y-2">
          {insights.map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </ul>
      </section>

      <section className="mb-3">
        <h2 className="mb-2 px-1 text-sm font-semibold text-ink-700">
          {t.dashboard.adviceTitle}
        </h2>
        <ul className="space-y-2">
          {advice.map((a) => (
            <li key={a.id} className="card flex items-start gap-3 !p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-peach-soft text-orange-700">
                <HeartIcon size={18} />
              </span>
              <div>
                <div className="text-sm font-semibold text-ink-900">
                  {a.title}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-700">
                  {a.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-ink-700">
            {t.dashboard.historyTitle}
          </h2>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm(t.dashboard.confirmClear)) clearHistory();
              }}
              className="text-xs text-ink-400 underline-offset-2 hover:underline"
            >
              {t.dashboard.clear}
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <div className="card text-center">
            <p className="text-sm text-ink-500">{t.dashboard.noHistoryYet}</p>
            <button
              onClick={() => navigate("/analyze")}
              className="btn-primary mt-3 w-full"
            >
              {t.dashboard.runFirst}
              <ArrowRightIcon size={18} />
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {history.map((r) => (
              <li key={r.id} className="card flex items-start gap-3 !p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cream-100 text-ink-700">
                  {r.inputType === "demo" ? (
                    <SparkleIcon size={18} />
                  ) : r.inputType === "video" ? (
                    <ZapIcon size={18} />
                  ) : r.inputType === "audio" ? (
                    <MoonIcon size={18} />
                  ) : (
                    <HeartIcon size={18} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StateChip state={r.primaryState} />
                    <span className="text-xs text-ink-400">
                      {Math.round(r.confidence * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 truncate text-xs text-ink-500">
                    {new Date(r.createdAt).toLocaleString(
                      language === "he" ? "he-IL" : "en-US"
                    )}{" "}
                    · {r.inputType}
                  </div>
                  {r.feedback && (
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      <CheckIcon size={12} />
                      {r.feedback.rating === "yes"
                        ? t.dashboard.youConfirmed
                        : r.feedback.actualState
                          ? t.dashboard.actually(
                              t.states[r.feedback.actualState]
                            )
                          : t.dashboard.refinedByYou}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        onClick={() => {
          if (confirm(t.dashboard.confirmReset)) {
            clearProfile();
          }
        }}
        className="mt-2 inline-flex items-center gap-1 text-xs text-ink-400"
      >
        <RefreshIcon size={12} />
        {t.dashboard.resetProfile}
      </button>

      <div className="mt-4">
        <Disclaimer tone="tight" />
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white p-3 text-center shadow-card ${tone}`}
    >
      <div className="text-2xl font-semibold leading-none text-ink-900">
        {value}
      </div>
      <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-ink-500">
        {label}
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: PersonalInsight }) {
  const tone =
    insight.tone === "positive"
      ? "bg-mint-softer"
      : insight.tone === "watch"
        ? "bg-peach-softer"
        : "bg-sky-softer";
  return (
    <li className={`rounded-3xl border border-white p-4 shadow-card ${tone}`}>
      <div className="text-sm font-semibold text-ink-900">{insight.title}</div>
      <p className="mt-0.5 text-xs leading-relaxed text-ink-700">
        {insight.detail}
      </p>
    </li>
  );
}

function DistributionLegend({
  data,
}: {
  data: { state: BabyState; value: number }[];
}) {
  const { t } = useLanguage();
  if (data.length === 0) return null;
  const sorted = [...data].sort((a, b) => b.value - a.value);
  return (
    <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
      {sorted.map((d) => (
        <li
          key={d.state}
          className="flex items-center justify-between text-xs text-ink-700"
        >
          <span className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: stateColor(d.state) }}
            />
            {t.states[d.state]}
          </span>
          <span className="tabular-nums text-ink-500">
            {Math.round(d.value * 100)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

function stateColor(s: BabyState): string {
  return (
    {
      tired: "#7C7AE6",
      overstimulated: "#F2A66B",
      hungry: "#5DC9A1",
      discomfort: "#E97A8A",
      content: "#7CB6E8",
      playful: "#E9C46A",
      other: "#B6BCC9",
    } as Record<BabyState, string>
  )[s];
}

function EmptyProfileState({ onSetup }: { onSetup: () => void }) {
  const { t } = useLanguage();
  return (
    <main className="page">
      <PageHeader
        eyebrow={t.dashboard.eyebrow}
        title={t.dashboard.profileEmptyTitle}
        subtitle={t.dashboard.profileEmptySubtitle}
        action={<LanguageToggle compact />}
      />
      <div className="card text-center">
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-lavender-softer text-indigo-700">
          <HeartIcon size={28} />
        </div>
        <h2 className="text-base font-semibold text-ink-900">
          {t.dashboard.profileEmptyCardTitle}
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          {t.dashboard.profileEmptyCardSubtitle}
        </p>
        <button onClick={onSetup} className="btn-primary mt-4 w-full">
          {t.dashboard.quickSetup}
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </main>
  );
}
