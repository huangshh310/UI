"use client";

/**
 * 示例：AiImageReveal 画廊框、角标与右下角自定义操作槽。
 */
import { AiImageReveal } from "@matt-ui/motion";
import { Download } from "lucide-react";
import { useState } from "react";

const ARCHITECTURAL_HORIZON_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="56%" stop-color="#3f3f46"/>
      <stop offset="100%" stop-color="#d6d3d1"/>
    </linearGradient>
    <radialGradient id="mist" cx="62%" cy="54%" r="42%">
      <stop offset="0%" stop-color="#f5f5f4" stop-opacity="0.72"/>
      <stop offset="60%" stop-color="#d6d3d1" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#27272a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="400" fill="url(#sky)"/>
  <rect width="600" height="400" fill="url(#mist)"/>
  <rect x="64" y="138" width="210" height="122" fill="#27272a" opacity="0.78"/>
  <rect x="132" y="168" width="142" height="92" fill="#f5f5f4" opacity="0.22"/>
  <rect x="0" y="256" width="600" height="144" fill="#18181b" opacity="0.82"/>
  <line x1="0" y1="256" x2="600" y2="256" stroke="#e7e5e4" stroke-opacity="0.45" stroke-width="1"/>
</svg>`)}`;

export default function AiImageRevealGalleryDemo() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="w-full max-w-lg">
      <AiImageReveal
        src={ARCHITECTURAL_HORIZON_SRC}
        alt="暮石水岸建筑剪影"
        variant="framed"
        radius="xl"
        aspectRatio={3 / 2}
        badge="3:2 · Studio"
        showReplayButton
        prompt="极简暖灰水岸建筑剪影与低饱和薄雾地平线，柔焦胶片质感"
        actions={
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border border-solid border-border/70 bg-background/80 px-2.5 font-sans text-[11px] font-medium text-foreground backdrop-blur-md transition-colors hover:bg-background/95 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/12 dark:bg-neutral-950/75 dark:text-neutral-100 dark:hover:bg-neutral-900/90"
          >
            <Download aria-hidden="true" className="size-3" />
            <span>{saved ? "已保存" : "下载原图"}</span>
          </button>
        }
      />
    </div>
  );
}
