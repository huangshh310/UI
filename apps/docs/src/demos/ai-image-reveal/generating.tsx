"use client";

import { AiImageReveal } from "@matt-ui/motion";
import { useState } from "react";

const SAMPLE_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="52%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>
  <rect width="640" height="400" fill="url(#g)"/>
  <circle cx="470" cy="128" r="72" fill="#ffffff" opacity="0.88"/>
  <path d="M0 290 Q180 210 340 262 T640 232 L640 400 L0 400 Z" fill="#0f172a" opacity="0.65"/>
</svg>`)}`;

export default function AiImageRevealGeneratingDemo() {
  const [generating, setGenerating] = useState(true);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <AiImageReveal
        src={generating ? undefined : SAMPLE_SRC}
        generating={generating}
        variant="glass"
        badge="16:10 · HD"
        alt="静谧海湾夜色"
        aspectRatio={16 / 10}
        generatingLabel="扩散采样中…"
        prompt="提示词：极简海湾日暮，低饱和蓝调与细腻胶片颗粒"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setGenerating((prev) => !prev)}
          className="h-8 cursor-pointer rounded-full border-0 bg-primary px-4 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-transform active:scale-[0.98] outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
        >
          {generating ? "完成生成并显影" : "重新进入粒子等待态"}
        </button>
      </div>
    </div>
  );
}
