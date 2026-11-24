"use client";

/**
 * 示例：AiImageReveal C 端美术馆画廊双卡与中性毛玻璃操作胶囊。
 */
import { AiImageReveal } from "@matt-ui/motion";
import { Download, Heart } from "lucide-react";
import { useState } from "react";

const encodeSvg = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const DUNES_SRC = encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">
  <defs>
    <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d8cbb8"/>
      <stop offset="56%" stop-color="#ece2d4"/>
      <stop offset="100%" stop-color="#f5ede2"/>
    </linearGradient>
    <linearGradient id="dune1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d7b693"/>
      <stop offset="100%" stop-color="#a87e5c"/>
    </linearGradient>
    <linearGradient id="dune2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c39a74"/>
      <stop offset="100%" stop-color="#7c593f"/>
    </linearGradient>
    <filter id="dgrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.04"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="600" height="450" fill="url(#dsky)"/>
  <circle cx="436" cy="132" r="34" fill="#fffaf2" opacity="0.82"/>
  <path d="M0 284 Q158 196 320 264 Q458 318 600 228 L600 450 L0 450 Z" fill="url(#dune1)"/>
  <path d="M0 342 Q192 268 386 350 Q492 390 600 328 L600 450 L0 450 Z" fill="url(#dune2)"/>
  <path d="M236 244 Q330 278 446 346 L256 450 L0 450 L0 342 Z" fill="#5e412d" opacity="0.34"/>
  <rect width="600" height="450" filter="url(#dgrain)"/>
</svg>`);

const FJORD_SRC = encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">
  <defs>
    <linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#cfd8dc"/>
      <stop offset="65%" stop-color="#e7ebeb"/>
      <stop offset="100%" stop-color="#f3f3f0"/>
    </linearGradient>
    <linearGradient id="lwater" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#b4c0c6"/>
      <stop offset="55%" stop-color="#8898a1"/>
      <stop offset="100%" stop-color="#5d6e78"/>
    </linearGradient>
    <filter id="lblur"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id="lgrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.04"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="600" height="275" fill="url(#lsky)"/>
  <polygon points="0,275 138,148 274,242 426,128 600,236 600,275" fill="#6f8089" opacity="0.65"/>
  <polygon points="184,275 344,174 510,275" fill="#4f606a" opacity="0.72"/>
  <ellipse cx="300" cy="264" rx="280" ry="22" fill="#f0f1ee" opacity="0.68" filter="url(#lblur)"/>
  <rect y="272" width="600" height="178" fill="url(#lwater)"/>
  <polygon points="184,272 344,358 510,272" fill="#3a4952" opacity="0.28" filter="url(#lblur)"/>
  <rect width="600" height="450" filter="url(#lgrain)"/>
</svg>`);

const GLASS_ACTION_BTN =
  "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-white/16 bg-neutral-950/76 px-2.5 font-sans text-[11px] font-medium text-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl transition-all hover:scale-[1.03] hover:bg-neutral-950/90 active:scale-[0.98] outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export default function AiImageRevealGalleryDemo() {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <AiImageReveal
        src={DUNES_SRC}
        alt="日落暖砂沙丘"
        variant="framed"
        radius="xl"
        aspectRatio={4 / 3}
        badge="4:3 · Framed"
        showReplayButton
        prompt="日落暖砂与绵延沙脊光影，美术馆实体装裱卡"
        actions={
          <button type="button" onClick={() => setSaved(true)} className={GLASS_ACTION_BTN}>
            <Download aria-hidden="true" className="size-3" />
            <span>{saved ? "已保存" : "下载"}</span>
          </button>
        }
      />
      <AiImageReveal
        src={FJORD_SRC}
        alt="北欧静湖雾山"
        variant="glass"
        radius="xl"
        aspectRatio={4 / 3}
        badge="4:3 · Glass"
        showReplayButton
        prompt="雨后薄雾山影与镜面湖泊，通透毛玻璃浮框"
        actions={
          <button
            type="button"
            aria-pressed={liked}
            onClick={() => setLiked((prev) => !prev)}
            className={GLASS_ACTION_BTN}
          >
            <Heart
              aria-hidden="true"
              className={`size-3 ${liked ? "fill-white text-white" : ""}`}
            />
            <span>{liked ? "已收藏" : "收藏"}</span>
          </button>
        }
      />
    </div>
  );
}
