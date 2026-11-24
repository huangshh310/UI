"use client";

import { AiImageReveal } from "@matt-ui/motion";
import { useState } from "react";

const encodeSvg = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const ARTWORKS = [
  {
    id: "ceramic",
    label: "午后陶艺",
    badge: "1024×1024 · Portra 400",
    prompt: "洞石台面上的哑光手作白陶花瓶与午后斜射窗影，暖沙胶片质感",
    src: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f5f0e6"/>
          <stop offset="56%" stop-color="#e8dfd1"/>
          <stop offset="100%" stop-color="#d5c8b6"/>
        </linearGradient>
        <linearGradient id="sunbeam" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stop-color="#fffdf8" stop-opacity="0.9"/>
          <stop offset="65%" stop-color="#fff9eb" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#e8dfd1" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="plinth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ddd2c1"/>
          <stop offset="100%" stop-color="#bcae99"/>
        </linearGradient>
        <linearGradient id="vase" x1="0.15" y1="0.1" x2="0.9" y2="0.95">
          <stop offset="0%" stop-color="#fbf8f2"/>
          <stop offset="48%" stop-color="#eae2d4"/>
          <stop offset="100%" stop-color="#bcae9b"/>
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.045"/></feComponentTransfer>
        </filter>
      </defs>
      <rect width="600" height="600" fill="url(#wall)"/>
      <polygon points="0,40 310,0 560,360 110,460" fill="url(#sunbeam)"/>
      <polygon points="0,190 250,150 480,460 60,510" fill="url(#sunbeam)" opacity="0.65"/>
      <rect y="438" width="600" height="162" fill="url(#plinth)"/>
      <line x1="0" y1="438" x2="600" y2="438" stroke="#f7f2e8" stroke-width="1.5" stroke-opacity="0.8"/>
      <ellipse cx="348" cy="468" rx="118" ry="22" fill="#6b5d4d" opacity="0.22" filter="url(#soft)"/>
      <g stroke="#5b5748" stroke-linecap="round" fill="none" opacity="0.32" filter="url(#soft)">
        <path d="M352 290 Q418 220 470 148" stroke-width="4"/>
        <ellipse cx="430" cy="202" rx="18" ry="6" transform="rotate(-35 430 202)" fill="#5b5748"/>
        <ellipse cx="458" cy="172" rx="16" ry="5" transform="rotate(-24 458 172)" fill="#5b5748"/>
      </g>
      <path d="M294 218 Q304 160 356 102" fill="none" stroke="#5b5847" stroke-width="3" stroke-linecap="round"/>
      <path d="M312 184 Q346 168 378 144" fill="none" stroke="#5b5847" stroke-width="2" stroke-linecap="round"/>
      <g fill="#6c6d56">
        <ellipse cx="332" cy="134" rx="14" ry="5" transform="rotate(-48 332 134)"/>
        <ellipse cx="358" cy="108" rx="15" ry="5" transform="rotate(-36 358 108)"/>
        <ellipse cx="366" cy="150" rx="14" ry="5" transform="rotate(-18 366 150)"/>
        <ellipse cx="316" cy="156" rx="12" ry="4.5" transform="rotate(-70 316 156)"/>
      </g>
      <path d="M266 220 C266 238, 240 264, 224 314 C208 366, 220 434, 246 462 L338 462 C364 434, 376 366, 360 314 C344 264, 318 238, 318 220 Z" fill="url(#vase)"/>
      <ellipse cx="292" cy="220" rx="26" ry="6.5" fill="#d7cbb9"/>
      <ellipse cx="292" cy="220" rx="20" ry="4.2" fill="#8b7d6b" opacity="0.55"/>
      <path d="M242 322 C232 362, 238 408, 254 440" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.48" filter="url(#soft)"/>
      <rect width="600" height="600" filter="url(#grain)"/>
    </svg>`),
  },
  {
    id: "courtyard",
    label: "暖砂庭院",
    badge: "1024×1024 · Medium Format",
    prompt: "地中海暖石灰岩拱门与利落斜射午后阳光，Cereal 建筑编辑美学",
    src: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="csky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9d6df"/>
          <stop offset="52%" stop-color="#e3e6e4"/>
          <stop offset="100%" stop-color="#f2ece1"/>
        </linearGradient>
        <linearGradient id="facade" x1="0" y1="0" x2="1" y2="0.8">
          <stop offset="0%" stop-color="#efe6d8"/>
          <stop offset="55%" stop-color="#decbb5"/>
          <stop offset="100%" stop-color="#c7ab8e"/>
        </linearGradient>
        <linearGradient id="terracotta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#b98667"/>
          <stop offset="100%" stop-color="#8b5d44"/>
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e8dfd0"/>
          <stop offset="100%" stop-color="#c9b8a1"/>
        </linearGradient>
        <filter id="cgrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.04"/></feComponentTransfer>
        </filter>
      </defs>
      <rect width="600" height="600" fill="url(#csky)"/>
      <rect x="0" y="96" width="600" height="364" fill="url(#facade)"/>
      <path d="M188 460 L188 262 A112 112 0 0 1 412 262 L412 460 Z" fill="#443229"/>
      <path d="M222 460 L222 272 A96 96 0 0 1 412 272 L412 460 Z" fill="url(#terracotta)" opacity="0.88"/>
      <polygon points="222,460 222,295 362,190 412,262 412,460" fill="#d8b99c"/>
      <rect x="0" y="458" width="600" height="142" fill="url(#floor)"/>
      <polygon points="0,458 188,458 92,600 0,600" fill="#8b735c" opacity="0.34"/>
      <polygon points="412,458 600,458 600,600 326,600" fill="#7c634d" opacity="0.28"/>
      <polygon points="188,458 378,458 292,600 92,600" fill="#fffaf0" opacity="0.45"/>
      <rect width="600" height="600" filter="url(#cgrain)"/>
    </svg>`),
  },
  {
    id: "coast",
    label: "北欧晨雾海",
    badge: "1024×1024 · Classic Chrome",
    prompt: "清晨淡雾笼罩的北欧灰蓝海岸与静谧水面微光，低饱和胶片色调",
    src: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#cfd9de"/>
          <stop offset="58%" stop-color="#e5e8e6"/>
          <stop offset="100%" stop-color="#f3efe8"/>
        </linearGradient>
        <radialGradient id="mdawn" cx="64%" cy="46%" r="44%">
          <stop offset="0%" stop-color="#fffcf5" stop-opacity="0.95"/>
          <stop offset="55%" stop-color="#efe8dc" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#cfd9de" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="mwater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#a8b7c0"/>
          <stop offset="48%" stop-color="#768b98"/>
          <stop offset="100%" stop-color="#475863"/>
        </linearGradient>
        <filter id="mblur"><feGaussianBlur stdDeviation="16"/></filter>
        <filter id="mgrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.04"/></feComponentTransfer>
        </filter>
      </defs>
      <rect width="600" height="360" fill="url(#msky)"/>
      <rect width="600" height="360" fill="url(#mdawn)"/>
      <path d="M0 332 Q120 278 238 322 Q348 352 478 292 Q545 268 600 296 L600 354 L0 354 Z" fill="#6b7c87" opacity="0.42"/>
      <ellipse cx="260" cy="336" rx="280" ry="30" fill="#f2f0ec" opacity="0.72" filter="url(#mblur)"/>
      <rect y="346" width="600" height="254" fill="url(#mwater)"/>
      <ellipse cx="382" cy="368" rx="140" ry="26" fill="#fffaf0" opacity="0.45" filter="url(#mblur)"/>
      <path d="M0 448 Q95 418 176 456 Q224 474 264 510 L0 510 Z" fill="#2c373f" opacity="0.82"/>
      <g stroke="#f5f3ee" stroke-linecap="round">
        <line x1="304" y1="382" x2="452" y2="382" stroke-width="2" stroke-opacity="0.5"/>
        <line x1="278" y1="412" x2="470" y2="412" stroke-width="1.5" stroke-opacity="0.34"/>
        <line x1="322" y1="448" x2="442" y2="448" stroke-width="1.2" stroke-opacity="0.24"/>
      </g>
      <rect width="600" height="600" filter="url(#mgrain)"/>
    </svg>`),
  },
];

export default function AiImageRevealBasicDemo() {
  const [index, setIndex] = useState(0);
  const current = ARTWORKS[index]!;

  return (
    <div className="flex w-full max-w-[360px] flex-col items-center gap-4">
      <AiImageReveal
        src={current.src}
        alt={current.label}
        variant="framed"
        radius="xl"
        badge={current.badge}
        prompt={current.prompt}
        showReplayButton
        aspectRatio={1}
        duration={2.4}
        generatingLabel="正在显影中…"
      />
      <div className="inline-flex items-center gap-1 rounded-xl border border-solid border-border bg-muted/70 p-1 shadow-xs dark:border-white/10 dark:bg-white/[0.05]">
        {ARTWORKS.map((art, idx) => (
          <button
            key={art.id}
            type="button"
            aria-pressed={index === idx}
            onClick={() => setIndex(idx)}
            className={`cursor-pointer rounded-lg border border-solid px-3 py-1.5 font-sans text-xs font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset ${
              index === idx
                ? "border-border bg-card text-foreground shadow-xs dark:border-white/12 dark:bg-card"
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
