"use client";

import { AiImageReveal } from "@matt-ui/motion";
import { useState } from "react";

const SAMPLE_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="fsky" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0%" stop-color="#dfe4de"/>
      <stop offset="56%" stop-color="#ecece6"/>
      <stop offset="100%" stop-color="#d5ddd5"/>
    </linearGradient>
    <radialGradient id="fmist" cx="68%" cy="32%" r="48%">
      <stop offset="0%" stop-color="#fffef9" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#ecebe2" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#dfe4de" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fbeam" x1="0.7" y1="0" x2="0.2" y2="1">
      <stop offset="0%" stop-color="#fffdf5" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#fffdf5" stop-opacity="0"/>
    </linearGradient>
    <filter id="fb14"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
  <rect width="800" height="600" fill="url(#fsky)"/>
  <rect width="800" height="600" fill="url(#fmist)"/>
  <path d="M0 392 Q180 296 370 362 T800 318 L800 600 L0 600 Z" fill="#8fa096" opacity="0.48"/>
  <ellipse cx="420" cy="408" rx="380" ry="60" fill="#f4f3ee" opacity="0.65" filter="url(#fb14)"/>
  <path d="M0 464 Q210 366 445 434 T800 396 L800 600 L0 600 Z" fill="#4f6359" opacity="0.72"/>
  <polygon points="480,0 645,0 385,600 205,600" fill="url(#fbeam)" filter="url(#fb14)"/>
  <path d="M0 520 Q240 462 510 506 T800 486 L800 600 L0 600 Z" fill="#22302b"/>
</svg>`)}`;

const PRESETS = [
  { id: "square", label: "Square", ratio: 1, badge: "1024 × 1024", width: "max-w-[280px]" },
  { id: "portrait", label: "Portrait", ratio: 3 / 4, badge: "896 × 1152", width: "max-w-[230px]" },
  {
    id: "landscape",
    label: "Landscape",
    ratio: 4 / 3,
    badge: "1344 × 768",
    width: "max-w-[360px]",
  },
] as const;

export default function AiImageRevealGeneratingDemo() {
  const [generating, setGenerating] = useState(true);
  const [presetId, setPresetId] = useState<(typeof PRESETS)[number]["id"]>("square");
  const preset = PRESETS.find((item) => item.id === presetId) ?? PRESETS[0];

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border bg-muted/60 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={presetId === item.id}
              onClick={() => setPresetId(item.id)}
              className={`cursor-pointer rounded-full border border-solid px-2.5 py-1 font-sans text-xs font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset ${
                presetId === item.id
                  ? "border-border bg-card text-foreground shadow-xs dark:border-white/12"
                  : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setGenerating((prev) => !prev)}
          className="inline-flex h-7 cursor-pointer items-center rounded-full border border-solid border-border bg-card px-3 font-sans text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted/70 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/12 dark:hover:bg-white/[0.08]"
        >
          {generating ? "完成显影" : "回到点阵等待"}
        </button>
      </div>

      <div className={`w-full transition-all duration-300 ${preset.width}`}>
        <AiImageReveal
          src={generating ? undefined : SAMPLE_SRC}
          generating={generating}
          variant="default"
          radius="xl"
          badge={preset.badge}
          alt="清晨薄雾山谷松林"
          aspectRatio={preset.ratio}
          generatingLabel="正在生成图像"
          prompt="a calm mountain lake at dawn, misty cedar forest"
          showReplayButton
        />
      </div>
    </div>
  );
}
