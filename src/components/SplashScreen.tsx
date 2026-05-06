import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  /** total time the splash stays fully visible, in ms */
  durationMs?: number;
  /** when the splash finishes (after fade-out), notifies the parent */
  onDone?: () => void;
}

/**
 * ComuniCare splash screen.
 * Shows the full-screen brand banner with a heart loader floating near the bottom.
 */
export function SplashScreen({ durationMs = 5000, onDone }: Props) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setPhase("out"), durationMs);
    return () => window.clearTimeout(enterTimer);
  }, [durationMs]);

  useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => onDone?.(), 420);
    return () => window.clearTimeout(t);
  }, [phase, onDone]);

  return (
    <div
      className={[
        "fixed inset-0 z-[60] flex justify-center overflow-hidden",
        "bg-[#fcf2ee]",
        phase === "out" ? "animate-fade-out" : "animate-fade-in",
      ].join(" ")}
      aria-label={t.app.name}
      role="status"
    >
      <div className="relative h-full w-full max-w-[440px]">
        <img
          src={`${import.meta.env.BASE_URL}banner.png`}
          alt={t.app.name}
          className="absolute inset-0 h-full w-full select-none object-contain"
          draggable={false}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-[10%] flex flex-col items-center">
          <HeartLoader />
        </div>
      </div>
    </div>
  );
}

function HeartLoader() {
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <svg
        className="absolute inset-0 h-full w-full animate-spin-slow"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cc-arc" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#F2A287" />
            <stop offset="60%" stopColor="#ED7B5A" />
            <stop offset="100%" stopColor="#D9603F" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="rgba(237,123,90,0.18)"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="url(#cc-arc)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 200"
          transform="rotate(-90 50 50)"
        />
      </svg>

      <svg
        className="relative h-10 w-10 animate-heart-beat text-brand-coral"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16 28S3 19.5 3 11.2C3 7.2 6.2 4 10.2 4c2.4 0 4.5 1.2 5.8 3 1.3-1.8 3.4-3 5.8-3C25.8 4 29 7.2 29 11.2 29 19.5 16 28 16 28Z" />
        <path
          d="M16 28S3 19.5 3 11.2C3 7.2 6.2 4 10.2 4c2.4 0 4.5 1.2 5.8 3 1.3-1.8 3.4-3 5.8-3C25.8 4 29 7.2 29 11.2 29 19.5 16 28 16 28Z"
          fill="none"
          stroke="#1E2966"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
