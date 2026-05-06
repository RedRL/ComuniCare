import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  visible: boolean;
  inputType: "video" | "audio" | "image" | "demo";
  realAI?: boolean;
}

export function AnalyzingOverlay({ visible, inputType, realAI }: Props) {
  const { t } = useLanguage();
  const stages =
    inputType === "video"
      ? t.overlay.stagesVideo
      : inputType === "audio"
        ? t.overlay.stagesAudio
        : inputType === "image"
          ? t.overlay.stagesImage
          : t.overlay.stagesDemo;
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStage(0);
      return;
    }
    const interval = setInterval(
      () => {
        setStage((s) => Math.min(stages.length - 1, s + 1));
      },
      realAI ? 800 : 320
    );
    return () => clearInterval(interval);
  }, [visible, stages.length, realAI]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-cream-50/85 backdrop-blur-md">
      <div className="card mx-5 w-full max-w-sm text-center">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center">
          <span className="absolute h-20 w-20 animate-breathe rounded-full bg-lavender-soft" />
          <span className="absolute h-14 w-14 animate-soft-pulse rounded-full bg-sky-soft" />
          <span className="relative h-8 w-8 rounded-full bg-white shadow-soft" />
        </div>
        <div className="text-lg font-semibold text-ink-900">
          {t.overlay.title}
        </div>
        <div className="mt-1 min-h-[1.25rem] text-sm text-ink-500">
          {stages[stage]}
        </div>
        {realAI && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-emerald-100 px-3 py-1 text-[11px] font-semibold text-indigo-800">
            {t.overlay.realAIBadge}
          </div>
        )}
      </div>
    </div>
  );
}
