import { useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { AnalysisInputType } from "../models/types";
import { AudioRecorder } from "./AudioRecorder";
import {
  CameraIcon,
  CloudUploadIcon,
  ImageIcon,
  MicIcon,
  VideoIcon,
  WaveformIcon,
} from "./Icon";

interface Props {
  type: Exclude<AnalysisInputType, "demo">;
  onFile: (file: File) => void;
  active?: boolean;
}

export function UploadCard({ type, onFile, active }: Props) {
  const { t } = useLanguage();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const captureInputRef = useRef<HTMLInputElement | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);

  const meta = {
    video: {
      label: t.upload.videoLabel,
      hint: t.upload.videoHint,
      accept: "video/*",
      Icon: VideoIcon,
      bg: "bg-sky-softer",
      captureLabel: t.upload.recordVideoAction,
      CaptureIcon: VideoIcon,
    },
    audio: {
      label: t.upload.audioLabel,
      hint: t.upload.audioHint,
      accept: "audio/*",
      Icon: WaveformIcon,
      bg: "bg-mint-softer",
      captureLabel: t.upload.recordAudioAction,
      CaptureIcon: MicIcon,
    },
    image: {
      label: t.upload.imageLabel,
      hint: t.upload.imageHint,
      accept: "image/*",
      Icon: ImageIcon,
      bg: "bg-lavender-softer",
      captureLabel: t.upload.takePhotoAction,
      CaptureIcon: CameraIcon,
    },
  }[type];

  const Icon = meta.Icon;
  const CaptureIcon = meta.CaptureIcon;

  const onCaptureClick = () => {
    if (type === "audio") {
      setShowRecorder(true);
    } else {
      captureInputRef.current?.click();
    }
  };

  return (
    <div
      className={[
        "rounded-2xl border border-white p-4 shadow-card transition",
        meta.bg,
        active ? "ring-2 ring-ink-900" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-ink-900 shadow-sm">
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-ink-900">{meta.label}</div>
          <div className="text-xs text-ink-500">{meta.hint}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-white/80 px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm active:scale-[0.99]"
        >
          <CloudUploadIcon size={16} />
          {t.upload.uploadAction}
        </button>
        <button
          type="button"
          onClick={onCaptureClick}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-ink-900 px-3 py-2 text-sm font-semibold text-white shadow-sm active:scale-[0.99]"
        >
          <CaptureIcon size={16} />
          {meta.captureLabel}
        </button>
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        accept={meta.accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      {type !== "audio" && (
        <input
          ref={captureInputRef}
          type="file"
          accept={meta.accept}
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      )}

      {showRecorder && (
        <AudioRecorder
          onCancel={() => setShowRecorder(false)}
          onFile={(file) => {
            setShowRecorder(false);
            onFile(file);
          }}
        />
      )}
    </div>
  );
}
