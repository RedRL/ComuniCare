import { useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { AnalysisInputType } from "../models/types";
import {
  CloudUploadIcon,
  ImageIcon,
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const meta = {
    video: {
      label: t.upload.videoLabel,
      hint: t.upload.videoHint,
      accept: "video/*",
      Icon: VideoIcon,
      bg: "bg-sky-softer",
    },
    audio: {
      label: t.upload.audioLabel,
      hint: t.upload.audioHint,
      accept: "audio/*",
      Icon: WaveformIcon,
      bg: "bg-mint-softer",
    },
    image: {
      label: t.upload.imageLabel,
      hint: t.upload.imageHint,
      accept: "image/*",
      Icon: ImageIcon,
      bg: "bg-lavender-softer",
    },
  }[type];

  const Icon = meta.Icon;

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={[
        "flex w-full items-center gap-3 rounded-2xl border border-white p-4 text-start shadow-card transition active:scale-[0.99]",
        meta.bg,
        active ? "ring-2 ring-ink-900" : "",
      ].join(" ")}
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-ink-900 shadow-sm">
        <Icon size={22} />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-ink-900">
          {meta.label}
        </span>
        <span className="block text-xs text-ink-500">{meta.hint}</span>
      </span>
      <CloudUploadIcon size={20} className="text-ink-400" />
      <input
        ref={inputRef}
        type="file"
        accept={meta.accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </button>
  );
}
