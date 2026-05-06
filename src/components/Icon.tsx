import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (props: IconProps) => ({
  width: props.size ?? 24,
  height: props.size ?? 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const directionalStyle = (props: IconProps) => {
  if (typeof document === "undefined" || document.documentElement.dir !== "rtl") {
    return props.style;
  }

  const existingTransform = props.style?.transform;
  return {
    ...props.style,
    transform: existingTransform
      ? `${existingTransform} scaleX(-1)`
      : "scaleX(-1)",
  };
};

export const SparkleIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
);

export const HeartIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="M20.8 8.6a5.2 5.2 0 0 0-9-3.6 5.2 5.2 0 0 0-9 3.6c0 6 9 11.4 9 11.4s9-5.4 9-11.4Z" />
  </svg>
);

export const WaveformIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 11v2" />
  </svg>
);

export const VideoIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <rect x="3" y="6" width="13" height="12" rx="2" />
    <path d="m16 10 5-3v10l-5-3" />
  </svg>
);

export const ImageIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m4 18 5-5 4 4 3-3 4 4" />
  </svg>
);

export const PlayIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="M7 5v14l12-7L7 5Z" />
  </svg>
);

export const HomeIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="m4 11 8-7 8 7v8a2 2 0 0 1-2 2h-3v-6h-6v6H6a2 2 0 0 1-2-2v-8Z" />
  </svg>
);

export const BabyIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <circle cx="12" cy="9" r="5" />
    <path d="M9 9h.01M15 9h.01M10 12s.8 1.2 2 1.2S14 12 14 12" />
    <path d="M5 21c1.8-3 4.4-4 7-4s5.2 1 7 4" />
  </svg>
);

export const InfoIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01M11 12h1v5h1" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base(props)} {...props} style={directionalStyle(props)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...base(props)} {...props} style={directionalStyle(props)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const RefreshIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

export const CloudUploadIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 18 8a4.5 4.5 0 0 1 1 8.9" />
    <path d="M12 12v8M8 16l4-4 4 4" />
  </svg>
);

export const ZapIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
);

export const MoonIcon = (props: IconProps) => (
  <svg {...base(props)} {...props}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);
