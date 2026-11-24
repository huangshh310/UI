"use client";

import { AiImageReveal } from "@matt-ui/motion";
import { useState } from "react";

const encodeSvg = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const ARTWORKS = [
  {
    id: "corridor",
    label: "光影回廊",
    badge: "1024×1024 · Flux",
    prompt: "极简清水混凝土回廊与斜射天光，建筑摄影中性灰调",
    src: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f4f4f5"/>
          <stop offset="52%" stop-color="#e4e4e7"/>
          <stop offset="100%" stop-color="#d4d4d8"/>
        </linearGradient>
        <linearGradient id="shaft" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="wall1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#a1a1aa"/>
          <stop offset="100%" stop-color="#52525b"/>
        </linearGradient>
      </defs>
      <rect width="480" height="480" fill="url(#bg1)"/>
      <polygon points="150,0 380,0 240,480 60,480" fill="url(#shaft)"/>
      <path d="M0 480 L0 118 L184 118 L184 480 Z" fill="#d4d4d8"/>
      <path d="M184 480 L184 118 Q184 68 234 68 L356 68 L356 480 Z" fill="url(#wall1)" opacity="0.72"/>
      <path d="M236 480 L236 210 Q236 160 286 160 L356 160 L356 480 Z" fill="#27272a"/>
      <rect x="0" y="388" width="480" height="92" fill="#18181b" opacity="0.16"/>
    </svg>`),
  },
  {
    id: "skylight",
    label: "静谧天光",
    badge: "1024×1024 · Imagen",
    prompt: "深灰建筑中庭与柔和钴蓝天窗折射，极简几何构图",
    src: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="55%" stop-color="#27272a"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
        <radialGradient id="glow2" cx="64%" cy="24%" r="48%">
          <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.45"/>
          <stop offset="55%" stop-color="#7a5ee4" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#18181b" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="plane" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f4f4f5"/>
          <stop offset="100%" stop-color="#a1a1aa"/>
        </linearGradient>
      </defs>
      <rect width="480" height="480" fill="url(#bg2)"/>
      <rect width="480" height="480" fill="url(#glow2)"/>
      <path d="M56 480 L56 176 Q56 128 104 128 L278 128 L278 480 Z" fill="url(#plane)" opacity="0.92"/>
      <path d="M196 480 L196 226 Q196 188 234 188 L424 188 L424 480 Z" fill="#e4e4e7" opacity="0.82"/>
      <rect x="248" y="248" width="124" height="176" rx="62" fill="#18181b" opacity="0.9"/>
    </svg>`),
  },
];

export default function AiImageRevealBasicDemo() {
  const [index, setIndex] = useState(0);
  const current = ARTWORKS[index]!;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <AiImageReveal
        src={current.src}
        alt={current.label}
        variant="framed"
        badge={current.badge}
        showReplayButton
        aspectRatio={1}
        duration={2.2}
        generatingLabel="正在显影…"
      />
      <div className="inline-flex items-center gap-1 rounded-lg border border-solid border-border bg-muted/60 p-1 dark:border-white/10 dark:bg-white/[0.04]">
        {ARTWORKS.map((art, idx) => (
          <button
            key={art.id}
            type="button"
            aria-pressed={index === idx}
            onClick={() => setIndex(idx)}
            className={`cursor-pointer rounded-md border border-solid px-3 py-1 font-sans text-xs font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset ${
              index === idx
                ? "border-border bg-card text-foreground shadow-xs dark:border-white/10"
                : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {art.label}
          </button>
        ))}
      </div>
    </div>
  );
}
