"use client";

import { AiImageReveal, type AiImageRevealHandle } from "@matt-ui/motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

const encodeSvg = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const ARTWORKS = [
  {
    label: "晨雾山岚",
    prompt: "极简主义晨雾山谷与微光水面，柔和电影级中性色调",
    src: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="48%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#fed7aa"/>
        </linearGradient>
        <radialGradient id="sun" cx="68%" cy="34%" r="28%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/>
          <stop offset="55%" stop-color="#fde68a" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#fde68a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="480" height="480" fill="url(#sky)"/>
      <circle cx="326" cy="162" r="110" fill="url(#sun)"/>
      <path d="M0 300 Q110 218 220 264 T480 242 L480 480 L0 480 Z" fill="#94a3b8" opacity="0.52"/>
      <path d="M0 342 Q145 270 280 318 T480 296 L480 480 L0 480 Z" fill="#475569" opacity="0.72"/>
      <path d="M0 392 Q130 356 260 384 T480 368 L480 480 L0 480 Z" fill="#1e293b"/>
    </svg>`),
  },
  {
    label: "钴蓝建筑",
    prompt: "午后日光下的极简建筑曲面与钴蓝天空，建筑摄影质感",
    src: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#155dfc"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <rect width="480" height="480" fill="url(#bg)"/>
      <circle cx="364" cy="116" r="54" fill="#93c5fd" opacity="0.32"/>
      <path d="M56 480 L56 172 Q56 120 112 120 L292 120 L292 480 Z" fill="url(#wall)"/>
      <path d="M188 480 L188 228 Q188 188 232 188 L424 188 L424 480 Z" fill="#e2e8f0" opacity="0.92"/>
      <rect x="236" y="246" width="132" height="168" rx="66" fill="#0f172a" opacity="0.86"/>
    </svg>`),
  },
];

export default function AiImageRevealBasicDemo() {
  const revealRef = useRef<AiImageRevealHandle>(null);
  const [index, setIndex] = useState(0);
  const current = ARTWORKS[index]!;

  return (
    <div className="flex w-full max-w-[236px] flex-col items-center gap-3">
      <AiImageReveal
        ref={revealRef}
        src={current.src}
        alt={current.label}
        aspectRatio={1}
        duration={2.2}
        generatingLabel="正在显影…"
      />
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => revealRef.current?.replay()}
          className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 font-sans text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          重播
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % ARTWORKS.length)}
          className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 font-sans text-xs text-muted-foreground shadow-xs transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Sparkles className="size-3" aria-hidden="true" />
          换一幅
        </button>
      </div>
    </div>
  );
}
