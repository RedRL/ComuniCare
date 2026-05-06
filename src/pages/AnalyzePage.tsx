import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AIModeToggle } from "../components/AIModeToggle";
import { AnalyzingOverlay } from "../components/AnalyzingOverlay";
import { ConfidenceBar } from "../components/ConfidenceBar";
import { DemoVideoPlayer } from "../components/DemoVideoPlayer";
import { Disclaimer } from "../components/Disclaimer";
import { DistributionList } from "../components/DistributionList";
import { FeedbackForm } from "../components/FeedbackForm";
import {
  ArrowRightIcon,
  InfoIcon,
  RefreshIcon,
  SparkleIcon,
} from "../components/Icon";
import { LanguageToggle } from "../components/LanguageToggle";
import { PageHeader } from "../components/PageHeader";
import { ProviderBadge } from "../components/ProviderBadge";
import { RefinementForm } from "../components/RefinementForm";
import { SignalsList } from "../components/SignalsList";
import { StateChip } from "../components/StateChip";
import { SuggestionsList } from "../components/SuggestionsList";
import { UploadCard } from "../components/UploadCard";
import { useAIMode } from "../hooks/useAIMode";
import { useAnalysisHistory } from "../hooks/useAnalysisHistory";
import { useBabyProfile } from "../hooks/useBabyProfile";
import { useLanguage } from "../i18n/LanguageContext";
import type { Messages } from "../i18n/translations";
import type {
  AnalysisInput,
  AnalysisResult,
  ParentFeedback,
  RefinementContext,
} from "../models/types";
import { aiService } from "../services/aiService";

export function AnalyzePage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { profile } = useBabyProfile();
  const { history, addAnalysis, updateAnalysis, setFeedback } =
    useAnalysisHistory();
  const { effectiveMode } = useAIMode();
  const { t, language } = useLanguage();

  const [input, setInput] = useState<AnalysisInput | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [refining, setRefining] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [viewingDemo, setViewingDemo] = useState(false);
  const previewUrlRef = useRef<string | null>(null);
  const demoTimerRef = useRef<number | null>(null);

  const inputType = input?.type ?? "demo";

  // auto-trigger demo from query param
  useEffect(() => {
    if (params.get("demo") === "1" && !input && !result && !analyzing) {
      startDemo();
      params.delete("demo");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (demoTimerRef.current) window.clearTimeout(demoTimerRef.current);
    };
  }, []);

  const onFile = (
    file: File,
    type: Exclude<AnalysisInput["type"], "demo">
  ) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    const next: AnalysisInput = {
      type,
      fileName: file.name,
      mimeType: file.type,
      previewUrl: url,
      file,
    };
    setInput(next);
    setResult(null);
    runAnalysis(next, false);
  };

  const startDemo = () => {
    const demoInput: AnalysisInput = { type: "demo" };
    setInput(demoInput);
    setResult(null);
    setViewingDemo(true);
    if (demoTimerRef.current) window.clearTimeout(demoTimerRef.current);
    demoTimerRef.current = window.setTimeout(() => {
      setViewingDemo(false);
      runAnalysis(demoInput, true);
    }, 3000);
  };

  const skipDemoWait = () => {
    if (demoTimerRef.current) window.clearTimeout(demoTimerRef.current);
    if (!input) return;
    setViewingDemo(false);
    runAnalysis(input, true);
  };

  const reset = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (demoTimerRef.current) window.clearTimeout(demoTimerRef.current);
    setInput(null);
    setResult(null);
    setViewingDemo(false);
  };

  async function runAnalysis(next: AnalysisInput, demo: boolean) {
    setAnalyzing(true);
    try {
      const r = await aiService.analyzeBabyInput(next, profile, history, {
        demo,
        realAI: effectiveMode === "real",
        language,
      });
      setResult(r);
      addAnalysis(r);
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleRefine(ctx: RefinementContext) {
    if (!result) return;
    setRefining(true);
    try {
      const refined = await aiService.refineAnalysisWithContext(
        result,
        ctx,
        profile,
        history,
        { realAI: effectiveMode === "real", language }
      );
      setResult(refined);
      updateAnalysis(refined);
    } finally {
      setRefining(false);
    }
  }

  function handleFeedback(fb: ParentFeedback) {
    if (!result) return;
    setFeedback(result.id, fb);
    setResult({ ...result, feedback: fb });
  }

  return (
    <main className="page">
      <PageHeader
        eyebrow={
          profile ? t.analyze.eyebrowFor(profile.name) : t.analyze.eyebrowDefault
        }
        title={result ? t.analyze.titleResult : t.analyze.titlePrepare}
        subtitle={
          result ? t.analyze.subtitleResult : t.analyze.subtitlePrepare
        }
        action={
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <LanguageToggle compact />
              <AIModeToggle compact />
            </div>
            {result ? (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-ink-700 shadow-sm"
              >
                <RefreshIcon size={14} />
                {t.analyze.new}
              </button>
            ) : !profile ? (
              <button
                onClick={() => navigate("/setup")}
                className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-ink-700 shadow-sm"
              >
                {t.analyze.setUp}
              </button>
            ) : null}
          </div>
        }
      />

      {!result && !analyzing && !viewingDemo && (
        <PrepareSection
          inputType={inputType}
          input={input}
          onFile={onFile}
          onDemo={startDemo}
        />
      )}

      {viewingDemo && <ViewingDemoSection onSkip={skipDemoWait} />}

      {result && (
        <ResultSection
          result={result}
          input={input}
          onRefine={handleRefine}
          refining={refining}
          onFeedback={handleFeedback}
          profile={profile}
          onOpenDashboard={() => navigate("/dashboard")}
        />
      )}

      <AnalyzingOverlay
        visible={analyzing}
        inputType={inputType}
        realAI={effectiveMode === "real" && inputType !== "demo"}
      />
    </main>
  );
}

function demoVideoLabels(t: Messages) {
  return {
    demo: t.demoVideo.demo,
    aiAnalysis: t.demoVideo.aiAnalysis,
    demoLoaded: t.demoVideo.demoLoaded,
    dropHint: t.demoVideo.dropHint,
    mute: t.demoVideo.mute,
    unmute: t.demoVideo.unmute,
  };
}

function ViewingDemoSection({ onSkip }: { onSkip: () => void }) {
  const { t } = useLanguage();
  return (
    <>
      <div className="mb-3">
        <DemoVideoPlayer labels={demoVideoLabels(t)} />
      </div>
      <div className="card flex items-center gap-3 animate-slide-up">
        <span className="relative grid h-10 w-10 shrink-0 place-items-center">
          <span className="absolute inset-0 animate-breathe rounded-full bg-lavender-soft" />
          <span className="relative h-3.5 w-3.5 animate-soft-pulse rounded-full bg-indigo-500" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-ink-900">
            {t.analyze.watchingTitle}
          </div>
          <div className="text-xs text-ink-500">
            {t.analyze.watchingSubtitle}
          </div>
        </div>
        <button
          onClick={onSkip}
          className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-ink-700 shadow-sm"
        >
          {t.analyze.analyzeNow}
        </button>
      </div>
    </>
  );
}

function PrepareSection({
  input,
  inputType,
  onFile,
  onDemo,
}: {
  input: AnalysisInput | null;
  inputType: AnalysisInput["type"];
  onFile: (
    file: File,
    type: Exclude<AnalysisInput["type"], "demo">
  ) => void;
  onDemo: () => void;
}) {
  const { t } = useLanguage();
  return (
    <>
      <button
        onClick={onDemo}
        className="relative mb-5 flex w-full items-center gap-3 overflow-hidden rounded-3xl border border-white bg-gradient-to-r from-lavender-softer via-sky-softer to-mint-softer p-4 text-start shadow-card active:scale-[0.99]"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-ink-900 shadow-sm">
          <SparkleIcon size={22} />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-ink-900">
            {t.analyze.demoCardTitle}
          </span>
          <span className="block text-xs text-ink-500">
            {t.analyze.demoCardSubtitle}
          </span>
        </span>
        <ArrowRightIcon size={18} className="text-ink-400" />
      </button>

      <h2 className="mb-2 text-sm font-semibold text-ink-700">
        {t.analyze.orShare}
      </h2>
      <div className="space-y-2.5">
        <UploadCard
          type="video"
          onFile={(f) => onFile(f, "video")}
          active={inputType === "video"}
        />
        <UploadCard
          type="audio"
          onFile={(f) => onFile(f, "audio")}
          active={inputType === "audio"}
        />
        <UploadCard
          type="image"
          onFile={(f) => onFile(f, "image")}
          active={inputType === "image"}
        />
      </div>

      {input?.previewUrl && input.type !== "demo" && (
        <div className="mt-5 card animate-slide-up">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
            {t.analyze.previewLabel}
          </div>
          <FilePreview input={input} />
        </div>
      )}

      <div className="mt-6">
        <Disclaimer />
      </div>
    </>
  );
}

function FilePreview({ input }: { input: AnalysisInput }) {
  if (input.type === "video" && input.previewUrl) {
    return (
      <video
        src={input.previewUrl}
        className="aspect-video w-full rounded-2xl object-cover"
        controls
        muted
        playsInline
      />
    );
  }
  if (input.type === "audio" && input.previewUrl) {
    return <audio src={input.previewUrl} className="w-full" controls />;
  }
  if (input.type === "image" && input.previewUrl) {
    return (
      <img
        src={input.previewUrl}
        alt="preview"
        className="max-h-72 w-full rounded-2xl object-cover"
      />
    );
  }
  return null;
}

function ResultSection({
  result,
  input,
  onRefine,
  refining,
  onFeedback,
  profile,
  onOpenDashboard,
}: {
  result: AnalysisResult;
  input: AnalysisInput | null;
  onRefine: (ctx: RefinementContext) => void;
  refining: boolean;
  onFeedback: (fb: ParentFeedback) => void;
  profile: ReturnType<typeof useBabyProfile>["profile"];
  onOpenDashboard: () => void;
}) {
  const { t } = useLanguage();
  const showDemoPlayer = result.inputType === "demo";
  const refinementUsed = !!result.refinement;

  const beforeAfter = useMemo(() => {
    if (!result.refinement) return null;
    return {
      from: result.refinement.confidenceBefore,
      to: result.refinement.confidenceAfter,
    };
  }, [result.refinement]);

  return (
    <>
      {showDemoPlayer ? (
        <div className="mb-4">
          <DemoVideoPlayer labels={demoVideoLabels(t)} />
        </div>
      ) : input?.previewUrl ? (
        <div className="mb-4 card">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
            {t.analyze.sourceLabel(input.type)}
          </div>
          <FilePreview input={input} />
        </div>
      ) : null}

      <section className="card animate-slide-up">
        <div className="mb-2 flex items-center gap-2">
          <ProviderBadge
            provider={result.provider}
            note={result.providerNote}
          />
        </div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-500">
              {t.analyze.primary}
            </div>
            <div className="text-xl font-semibold leading-tight text-ink-900">
              {result.primaryLabel}
            </div>
          </div>
          <StateChip state={result.primaryState} size="md" />
        </div>
        <ConfidenceBar
          value={result.confidence}
          showDelta={beforeAfter ?? undefined}
        />
        <p className="mt-3 text-sm leading-relaxed text-ink-700">
          {result.explanation}
        </p>
        {result.providerNote && (
          <p className="mt-2 inline-flex items-start gap-1.5 rounded-2xl bg-peach-softer p-3 text-xs leading-relaxed text-orange-800">
            <InfoIcon size={14} className="mt-0.5 shrink-0" />
            <span>{result.providerNote}</span>
          </p>
        )}
        {result.refinement && (
          <p className="mt-2 rounded-2xl bg-lavender-softer p-3 text-xs leading-relaxed text-indigo-800">
            <strong className="me-1">{t.analyze.whyChanged}</strong>
            {result.refinement.rationale}
          </p>
        )}
      </section>

      <section className="card mt-3">
        <h3 className="mb-3 text-sm font-semibold text-ink-900">
          {t.analyze.breakdown}
        </h3>
        <DistributionList distribution={result.distribution} />
      </section>

      <section className="card mt-3">
        <h3 className="mb-3 text-sm font-semibold text-ink-900">
          {t.analyze.signals}
        </h3>
        <SignalsList signals={result.signals} />
      </section>

      <section className="card mt-3">
        <h3 className="mb-3 text-sm font-semibold text-ink-900">
          {t.analyze.suggestions}
        </h3>
        <SuggestionsList suggestions={result.suggestions} />
      </section>

      {!refinementUsed && (
        <div className="mt-3">
          <RefinementForm
            defaultFeedingIntervalHours={profile?.feedingIntervalHours}
            defaultWakeWindowMinutes={profile?.wakeWindowMinutes}
            onSubmit={onRefine}
            busy={refining}
          />
        </div>
      )}

      <div className="mt-3">
        <FeedbackForm existing={result.feedback} onSubmit={onFeedback} />
      </div>

      <button
        onClick={onOpenDashboard}
        className="btn-secondary mt-4 w-full"
      >
        {t.analyze.seePatterns}
        <ArrowRightIcon size={18} />
      </button>

      <div className="mt-4">
        <Disclaimer tone="tight" />
      </div>
    </>
  );
}
