"use client";

/**
 * 示例：AiImageReveal 画廊框、毛玻璃角标与右下角自定义操作槽。
 */
import { AiImageReveal } from "@matt-ui/motion";
import { Download } from "lucide-react";
import { useState } from "react";

const SUNSET_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="55%" stop-color="#9333ea"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#s)"/>
  <circle cx="300" cy="215" r="82" fill="#fef3c7" opacity="0.9"/>
  <rect x="0" y="255" width="600" height="145" fill="#0f172a" opacity="0.62"/>
</svg>`)}`;

export default function AiImageRevealGalleryDemo() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="w-full max-w-md">
      <AiImageReveal
        src={SUNSET_SRC}
        alt="琥珀色地平线暮光"
        variant="framed"
        radius="xl"
        aspectRatio={3 / 2}
        badge="3:2 · Studio"
        showReplayButton
        prompt="琥珀色地平线暮光与平静海面倒影，胶片颗粒与广角构图"
        actions={
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-solid border-border/75 bg-popover/92 px-2.5 font-sans text-[11px] font-medium text-popover-foreground shadow-xs backdrop-blur-xl transition-colors hover:bg-popover dark:border-white/12"
          >
            <Download aria-hidden="true" className="size-3" />
            <span>{saved ? "已保存" : "下载原图"}</span>
          </button>
        }
      />
    </div>
  );
}
