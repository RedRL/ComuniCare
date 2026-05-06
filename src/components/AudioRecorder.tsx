import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { MicIcon, RefreshIcon, StopIcon } from "./Icon";

interface Props {
  onCancel: () => void;
  onFile: (file: File) => void;
}

type Phase = "idle" | "recording" | "review" | "denied" | "unsupported";

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/mp4;codecs=mp4a.40.2",
    "audio/mpeg",
    "audio/aac",
  ];
  for (const m of candidates) {
    if (MediaRecorder.isTypeSupported?.(m)) return m;
  }
  return undefined;
}

function extensionFor(mime: string | undefined): string {
  if (!mime) return "webm";
  if (mime.includes("mp4")) return "m4a";
  if (mime.includes("mpeg")) return "mp3";
  if (mime.includes("aac")) return "aac";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function AudioRecorder({ onCancel, onFile }: Props) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileRef = useRef<File | null>(null);
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices) {
      setPhase("unsupported");
    }
    return () => {
      stopTicker();
      stopStream();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function stopTicker() {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMimeType();
      const recorder = new MediaRecorder(
        stream,
        mime ? { mimeType: mime } : undefined
      );
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const usedMime = recorder.mimeType || mime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: usedMime });
        const file = new File(
          [blob],
          `recording-${Date.now()}.${extensionFor(usedMime)}`,
          { type: usedMime }
        );
        fileRef.current = file;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(blob));
        stopStream();
        stopTicker();
        setPhase("review");
      };
      recorderRef.current = recorder;
      recorder.start();
      startedAtRef.current = Date.now();
      setElapsed(0);
      tickRef.current = window.setInterval(() => {
        setElapsed(Date.now() - startedAtRef.current);
      }, 200);
      setPhase("recording");
    } catch {
      stopStream();
      setPhase("denied");
    }
  }

  function stop() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }

  function retake() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    fileRef.current = null;
    setElapsed(0);
    setPhase("idle");
  }

  function confirmUse() {
    if (fileRef.current) {
      onFile(fileRef.current);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink-900/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-3 mb-3 w-full max-w-[420px] animate-slide-up rounded-3xl bg-white p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink-900">
            {t.recorder.title}
          </h3>
          <button
            onClick={onCancel}
            className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-700"
          >
            {t.recorder.cancel}
          </button>
        </div>

        {phase === "unsupported" && (
          <p className="text-sm text-ink-700">{t.recorder.unsupported}</p>
        )}

        {phase === "denied" && (
          <p className="text-sm text-ink-700">{t.recorder.permissionDenied}</p>
        )}

        {(phase === "idle" || phase === "denied") && (
          <button
            onClick={start}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-coral px-4 py-3 text-sm font-semibold text-white shadow-card active:scale-[0.99]"
          >
            <MicIcon size={18} />
            {t.recorder.start}
          </button>
        )}

        {phase === "recording" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-peach-softer px-4 py-3">
              <span className="relative grid h-3 w-3">
                <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/60" />
                <span className="relative h-3 w-3 rounded-full bg-rose-500" />
              </span>
              <span className="text-sm font-medium text-ink-900">
                {t.recorder.elapsed(formatElapsed(elapsed))}
              </span>
            </div>
            <button
              onClick={stop}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white shadow-card active:scale-[0.99]"
            >
              <StopIcon size={18} />
              {t.recorder.stop}
            </button>
          </div>
        )}

        {phase === "review" && previewUrl && (
          <div className="space-y-3">
            <audio src={previewUrl} controls className="w-full" />
            <div className="flex gap-2">
              <button
                onClick={retake}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cream-100 px-4 py-3 text-sm font-semibold text-ink-900 active:scale-[0.99]"
              >
                <RefreshIcon size={16} />
                {t.recorder.retake}
              </button>
              <button
                onClick={confirmUse}
                className="flex-1 rounded-2xl bg-brand-coral px-4 py-3 text-sm font-semibold text-white shadow-card active:scale-[0.99]"
              >
                {t.recorder.use}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
