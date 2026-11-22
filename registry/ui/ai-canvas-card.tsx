// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiCanvasCard：AI 多模态视觉生成结果画布卡片（参考 Midjourney / Sora / Lovable），
 * 支持一键生成视觉变体、放大倍率切换与收藏反馈。
 */

import { cn } from "@/lib/utils";
import { Heart, Maximize2, Shuffle, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export interface AiCanvasCardProps {
  /** 生成提示词文案 */
  prompt?: string;
  /** 画幅比例标识 */
  aspectLabel?: string;
  /** 视觉风格标签 */
  styleLabel?: string;
  /** 生成变体回调 */
  onRemix?: (seedIndex: number) => void;
  /** 收藏回调 */
  onFavoriteChange?: (favorited: boolean) => void;
  /** 自定义类名 */
  className?: string;
}
const DEFAULT_SCENE = {
  name: "极光琉璃 · #4092",
  bg: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 46%, #7c3aed 78%, #06b6d4 100%)",
  orbA: "rgba(56, 189, 248, 0.72)",
  orbB: "rgba(192, 132, 252, 0.65)",
};

const SCENES = [
  DEFAULT_SCENE,
  {
    name: "曜石琥珀 · #7814",
    bg: "linear-gradient(135deg, #18181b 0%, #4338ca 48%, #e11d48 82%, #f59e0b 100%)",
    orbA: "rgba(251, 191, 36, 0.7)",
    orbB: "rgba(244, 63, 94, 0.6)",
  },
  {
    name: "翠雾微光 · #9256",
    bg: "linear-gradient(135deg, #064e3b 0%, #0d9488 45%, #2563eb 82%, #818cf8 100%)",
    orbA: "rgba(52, 211, 153, 0.75)",
    orbB: "rgba(96, 165, 250, 0.68)",
  },
];

const GenerativeArtwork = ({
  scene,
  aspectLabel,
  styleLabel,
  upscaled,
  reduced,
}: {
  scene: (typeof SCENES)[number];
  aspectLabel: string;
  styleLabel: string;
  upscaled: boolean;
  reduced: boolean | null;
}) => (
  <div
    style={{ background: scene.bg }}
    className="relative flex h-36 w-full flex-col justify-between overflow-hidden rounded-2xl p-3 text-white shadow-inner"
  >
    <motion.span
      aria-hidden="true"
      animate={reduced ? undefined : { x: [-8, 12, -8], y: [-4, 8, -4] }}
      transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: scene.orbA }}
      className="pointer-events-none absolute -top-8 -left-6 size-32 rounded-full blur-2xl"
    />
    <motion.span
      aria-hidden="true"
      animate={reduced ? undefined : { x: [8, -10, 8], y: [6, -6, 6] }}
      transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: scene.orbB }}
      className="pointer-events-none absolute -right-8 -bottom-10 size-36 rounded-full blur-2xl"
    />
    <div className="relative z-10 flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-md">
        <Sparkles aria-hidden="true" className="size-2.5" />
        {styleLabel}
      </span>
      <span className="rounded-full bg-black/45 px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-md">
        {upscaled ? "4K UHD" : aspectLabel}
      </span>
    </div>
    <div className="relative z-10 flex items-center justify-between">
      <span className="rounded-lg bg-black/45 px-2 py-0.5 font-mono text-[10px] text-white/95 backdrop-blur-md">
        {scene.name}
      </span>
    </div>
  </div>
);

const FavButton = ({ favorited, onClick }: { favorited: boolean; onClick: () => void }) => (
  <button
    type="button"
    aria-label={favorited ? "取消收藏画作" : "收藏画作"}
    aria-pressed={favorited}
    onClick={onClick}
    className={cn(
      "inline-flex size-7.5 cursor-pointer items-center justify-center rounded-full border border-solid transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
      favorited
        ? "border-rose-500/35 bg-rose-500/12 text-rose-700 dark:text-rose-300"
        : "border-border bg-card text-muted-foreground hover:text-foreground",
    )}
  >
    <Heart aria-hidden="true" className={cn("size-3.5", favorited && "fill-current")} />
  </button>
);

const CanvasFooter = (p: {
  upscaled: boolean;
  favorited: boolean;
  onRemix: () => void;
  onToggleUpscale: () => void;
  onToggleFav: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-solid border-border/70 pt-2.5">
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={p.onRemix}
        className="inline-flex h-7.5 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-signal bg-signal px-3 font-sans text-xs font-medium text-signal-foreground shadow-sm transition-opacity hover:opacity-92 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <Shuffle aria-hidden="true" className="size-3" />
        <span>生成变体</span>
      </button>
      <button
        type="button"
        aria-pressed={p.upscaled}
        onClick={p.onToggleUpscale}
        className={cn(
          "inline-flex h-7.5 cursor-pointer items-center gap-1 rounded-full border border-solid px-2.5 font-sans text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          p.upscaled
            ? "border-blue-600/35 bg-blue-500/10 text-blue-800 dark:border-blue-400/35 dark:bg-blue-400/15 dark:text-blue-200"
            : "border-border bg-secondary/45 text-foreground hover:bg-accent",
        )}
      >
        <Maximize2 aria-hidden="true" className="size-3" />
        <span>{p.upscaled ? "已放大 4K" : "高清放大"}</span>
      </button>
    </div>
    <FavButton favorited={p.favorited} onClick={p.onToggleFav} />
  </div>
);

const useCanvasState = (
  onRemix?: (seedIndex: number) => void,
  onFavoriteChange?: (favorited: boolean) => void,
) => {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [upscaled, setUpscaled] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const remix = () => {
    const next = (sceneIdx + 1) % SCENES.length;
    setSceneIdx(next);
    onRemix?.(next);
  };
  const toggleFav = () => {
    const next = !favorited;
    setFavorited(next);
    onFavoriteChange?.(next);
  };
  return {
    scene: SCENES[sceneIdx % SCENES.length] ?? DEFAULT_SCENE,
    upscaled,
    setUpscaled,
    favorited,
    remix,
    toggleFav,
  };
};

export const AiCanvasCard = ({
  prompt = "极简玻璃态极光雕塑，柔焦镜面高光与宝石蓝环境反射",
  aspectLabel = "16:9",
  styleLabel = "赛博陶瓷",
  onRemix,
  onFavoriteChange,
  className,
}: AiCanvasCardProps) => {
  const reduced = useReducedMotion();
  const s = useCanvasState(onRemix, onFavoriteChange);
  return (
    <div
      data-slot="ai-canvas-card"
      className={cn(
        "flex w-full max-w-md flex-col gap-3 rounded-[22px] border border-solid border-border/90 bg-card p-3.5 text-card-foreground shadow-md",
        className,
      )}
    >
      <GenerativeArtwork
        scene={s.scene}
        aspectLabel={aspectLabel}
        styleLabel={styleLabel}
        upscaled={s.upscaled}
        reduced={reduced}
      />
      <p className="m-0 line-clamp-2 px-0.5 text-xs leading-relaxed text-muted-foreground">
        {prompt}
      </p>
      <CanvasFooter
        upscaled={s.upscaled}
        favorited={s.favorited}
        onRemix={s.remix}
        onToggleUpscale={() => s.setUpscaled((prev) => !prev)}
        onToggleFav={s.toggleFav}
      />
    </div>
  );
};
