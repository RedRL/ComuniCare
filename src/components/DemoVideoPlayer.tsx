import { useEffect, useRef, useState } from "react";
import { SparkleIcon } from "./Icon";

interface Props {
  /** path under /public, e.g. "/demo-baby-video.mp4" */
  src?: string;
  showOverlay?: boolean;
  /** controls the playing video's mute state from the outside (optional) */
  startMuted?: boolean;
  labels?: {
    demo: string;
    aiAnalysis: string;
    demoLoaded: string;
    dropHint: string;
    unmute: string;
    mute: string;
  };
}

const DEFAULT_LABELS = {
  demo: "Demo video",
  aiAnalysis: "AI video analysis",
  demoLoaded: "Demo baby video loaded",
  dropHint: "(drop a clip at /public/demo-baby-video.mp4 to replace)",
  unmute: "Unmute",
  mute: "Mute",
};

export function DemoVideoPlayer({
  src = `${import.meta.env.BASE_URL}demo-baby-video.mp4`,
  showOverlay = true,
  startMuted = false,
  labels = DEFAULT_LABELS,
}: Props) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [muted, setMuted] = useState<boolean>(startMuted);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setAvailable(r.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Try unmuted autoplay first; on rejection, fall back to muted autoplay
  useEffect(() => {
    if (!available) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        // browser blocked autoplay with sound — fall back to muted
        if (!v.muted) {
          v.muted = true;
          setMuted(true);
          try {
            await v.play();
          } catch {
            /* ignore */
          }
        }
      }
    };
    tryPlay();
  }, [available, muted]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) {
      setMuted((m) => !m);
      return;
    }
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
      });
    }
  };

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white bg-gradient-to-br from-sky-soft via-lavender-softer to-mint-soft shadow-card">
      {available ? (
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          autoPlay
          loop
          playsInline
        />
      ) : (
        <DemoPlaceholder
          title={labels.demoLoaded}
          subtitle={labels.dropHint}
        />
      )}

      {showOverlay && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-ink-900/10" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="pill bg-white/85 text-ink-900 shadow-sm">
              <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-rose-500" />
              {labels.demo}
            </span>
            <span className="pill bg-ink-900/80 text-white">
              <SparkleIcon size={14} /> {labels.aiAnalysis}
            </span>
          </div>

          {available && (
            <button
              onClick={toggleMute}
              aria-label={muted ? labels.unmute : labels.mute}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-900 shadow-sm backdrop-blur active:scale-95"
            >
              {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16 9c1.2 1 1.2 5 0 6" />
      <path d="M19 6c2.5 2.4 2.5 9.6 0 12" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="m17 9 5 6M22 9l-5 6" />
    </svg>
  );
}

function DemoPlaceholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="relative grid h-28 w-28 place-items-center">
          <div className="absolute inset-0 animate-breathe rounded-full bg-white/70" />
          <div className="absolute inset-3 rounded-full bg-white shadow-soft" />
          <BabyFace />
        </div>
        <div className="text-base font-semibold text-ink-900">{title}</div>
        <div className="text-xs text-ink-500">{subtitle}</div>
      </div>
    </div>
  );
}

function BabyFace() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="relative h-16 w-16 text-ink-900"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="22" cy="28" r="2.5" fill="currentColor" />
      <circle cx="42" cy="28" r="2.5" fill="currentColor" />
      <path d="M22 40c4 3 16 3 20 0" />
      <circle cx="32" cy="32" r="22" />
    </svg>
  );
}
