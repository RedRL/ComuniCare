import { Disclaimer } from "../components/Disclaimer";
import {
  HeartIcon,
  InfoIcon,
  SparkleIcon,
  ZapIcon,
} from "../components/Icon";
import { LanguageToggle } from "../components/LanguageToggle";
import { PageHeader } from "../components/PageHeader";
import { useLanguage } from "../i18n/LanguageContext";

export function AboutPage() {
  const { t } = useLanguage();
  return (
    <main className="page">
      <PageHeader
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        subtitle={t.about.subtitle}
        action={<LanguageToggle compact />}
      />

      <Section
        tone="bg-sky-softer"
        icon={<SparkleIcon size={20} />}
        title={t.about.s1Title}
        body={t.about.s1Body}
      />

      <Section
        tone="bg-lavender-softer"
        icon={<ZapIcon size={20} />}
        title={t.about.s2Title}
        body={t.about.s2Body}
      />

      <Section
        tone="bg-mint-softer"
        icon={<HeartIcon size={20} />}
        title={t.about.s3Title}
        body={t.about.s3Body}
      />

      <Section
        tone="bg-peach-softer"
        icon={<InfoIcon size={20} />}
        title={t.about.s4Title}
        body={t.about.s4Body}
      />

      <section className="card mt-3">
        <h3 className="mb-2 text-sm font-semibold text-ink-900">
          {t.about.whyTitle}
        </h3>
        <ul className="space-y-2 text-sm leading-relaxed text-ink-700">
          {[t.about.why1, t.about.why2, t.about.why3].map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-700" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-3">
        <h3 className="mb-2 text-sm font-semibold text-ink-900">
          {t.about.privacyTitle}
        </h3>
        <p className="text-sm leading-relaxed text-ink-700">
          {t.about.privacyBody}
        </p>
      </section>

      <div className="mt-4">
        <Disclaimer />
      </div>

      <p className="mt-6 text-center text-xs text-ink-400">
        {t.about.footer}
      </p>
    </main>
  );
}

function Section({
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
      className={`mb-3 flex items-start gap-3 rounded-3xl border border-white p-4 shadow-card ${tone}`}
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
