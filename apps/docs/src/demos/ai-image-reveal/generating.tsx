"use client";

import { AiImageReveal } from "@matt-ui/motion";
import { useState } from "react";

const SAMPLE_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#09090b"/>
      <stop offset="54%" stop-color="#27272a"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <radialGradient id="beam" cx="72%" cy="28%" r="44%">
      <stop offset="0%" stop-color="#dbeafe" stop-opacity="0.72"/>
      <stop offset="55%" stop-color="#60a5fa" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="400" fill="url(#g)"/>
  <rect width="640" height="400" fill="url(#beam)"/>
  <polygon points="0,280 280,192 440,248 640,204 640,400 0,400" fill="#18181b" opacity="0.72"/>
  <line x1="0" y1="280" x2="640" y2="204" stroke="#f4f4f5" stroke-opacity="0.25" stroke-width="1"/>
</svg>`)}`;

export default function AiImageRevealGeneratingDemo() {
  const [generating, setGenerating] = useState(true);

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <AiImageReveal
        src={generating ? undefined : SAMPLE_SRC}
        generating={generating}
        variant="glass"
        badge="16:10 · HD"
        alt="雾蓝建筑立面"
        aspectRatio={16 / 10}
        generatingLabel="扩散采样中…"
        prompt="提示词：极简建筑折面与冷雾天光，低饱和中性灰蓝调"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setGenerating((prev) => !prev)}
          className="h-8 cursor-pointer rounded-lg border border-solid border-transparent bg-primary px-3.5 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-92 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
        >
          {generating ? "完成生成并显影" : "重新进入粒子等待态"}
        </button>
      </div>
    </div>
  );
}
