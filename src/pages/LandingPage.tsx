import { useNavigate } from "react-router-dom";
import { Disclaimer } from "../components/Disclaimer";
import {
  ArrowRightIcon,
  HeartIcon,
  SparkleIcon,
  ZapIcon,
} from "../components/Icon";
import { LanguageToggle } from "../components/LanguageToggle";
import { useBabyProfile } from "../hooks/useBabyProfile";
import { useLanguage } from "../i18n/LanguageContext";

export function LandingPage() {
  const navigate = useNavigate();
  const { profile } = useBabyProfile();
  const { t } = useLanguage();

  const startCta = profile ? t.landing.ctaContinue : t.landing.ctaStart;
  const startGo = () => navigate(profile ? "/analyze" : "/setup");

  return (
    <main className="page">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt={t.app.name}
            className="h-9 w-9 rounded-2xl object-contain"
          />
          <div className="leading-tight">
            <div className="text-[15px] font-semibold text-brand-navy">
              {t.app.name}
            </div>
            <div className="text-[10px] text-ink-500">{t.app.subtitle}</div>
          </div>
        </div>
        <LanguageToggle />
      </div>

      <section className="relative mb-6 overflow-hidden rounded-3xl border border-white bg-white/70 p-6 shadow-card">
        <div className="absolute inset-0 grid-bg opacity-90" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink-700 shadow-sm">
            <SparkleIcon size={14} />
            {t.landing.eyebrow}
          </div>
          <h1 className="text-[28px] font-semibold leading-[1.15] text-brand-navy">
            {t.landing.titleLine1}
            <br />
            <span className="bg-gradient-to-r from-brand-coral via-brand-coralDeep to-brand-navy bg-clip-text text-transparent">
              {t.landing.titleLine2}
            </span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            {t.landing.body}
          </p>

          <button onClick={startGo} className="btn-primary mt-5 w-full">
            {startCta}
            <ArrowRightIcon size={18} />
          </button>
          <button
            onClick={() => navigate("/analyze?demo=1")}
            className="btn-secondary mt-2 w-full"
          >
            <SparkleIcon size={18} />
            {t.landing.ctaDemo}
          </button>
        </div>
      </section>

      <section className="mb-6 space-y-3">
        <FeatureCard
          tone="bg-sky-softer"
          icon={<SparkleIcon size={20} />}
          title={t.landing.feature1Title}
          body={t.landing.feature1Body}
        />
        <FeatureCard
          tone="bg-mint-softer"
          icon={<ZapIcon size={20} />}
          title={t.landing.feature2Title}
          body={t.landing.feature2Body}
        />
        <FeatureCard
          tone="bg-lavender-softer"
          icon={<HeartIcon size={20} />}
          title={t.landing.feature3Title}
          body={t.landing.feature3Body}
        />
      </section>

      <section className="mb-6 grid grid-cols-2 gap-2.5">
        <Pill text={t.landing.pillsImmediate} />
        <Pill text={t.landing.pillsNoTracking} />
        <Pill text={t.landing.pillsOptionalContext} />
        <Pill text={t.landing.pillsIntuition} />
      </section>

      <Disclaimer />
    </main>
  );
}

function FeatureCard({
  tone,
  icon,
  title,
  body,
}: {
  tone: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article
      className={`flex items-start gap-3 rounded-3xl border border-white p-4 shadow-card ${tone}`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-ink-900 shadow-sm">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-700">{body}</p>
      </div>
    </article>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-2.5 text-center text-xs font-medium text-ink-700 shadow-sm">
      {text}
    </div>
  );
}
