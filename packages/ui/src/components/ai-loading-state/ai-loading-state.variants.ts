/**
 * AiLoadingState 的样式映射与 3×3 像素矩阵编排帧序列。
 */
import { cva } from "class-variance-authority";
import type { AiLoadingPattern, AiLoadingSize } from "./ai-loading-state.types.js";

export const aiLoadingStateVariants = cva(
  "inline-flex items-center font-sans tracking-tight select-none",
  {
    variants: {
      variant: {
        inline: "",
        pill: "rounded-full border border-solid border-border bg-card/90 shadow-xs dark:border-white/10 dark:bg-card/80",
      },
      size: {
        sm: "gap-2 text-xs",
        md: "gap-2.5 text-[13px]",
        lg: "gap-3 text-sm",
      },
    },
    compoundVariants: [
      { variant: "pill", size: "sm", className: "px-2.5 py-1" },
      { variant: "pill", size: "md", className: "px-3.5 py-1.5" },
      { variant: "pill", size: "lg", className: "px-4 py-2" },
    ],
    defaultVariants: {
      variant: "inline",
      size: "md",
    },
  },
);

export const AI_LOADING_GRID_CLASS: Record<AiLoadingSize, string> = {
  sm: "size-3 gap-[1.5px]",
  md: "size-3.5 gap-[2px]",
  lg: "size-4 gap-[2px]",
};

/** 3×3 网格外圈顺时针索引顺序 */
const ORBIT_RING = [0, 1, 2, 5, 8, 7, 6, 3] as const;

/** 计算 3×3 矩阵中每个单元在当前节拍下的亮度（0.16 – 1） */
export const computeMatrixOpacities = (
  pattern: AiLoadingPattern,
  step: number,
  paused: boolean,
): number[] => {
  if (paused) return [0.35, 0.75, 0.35, 0.75, 1, 0.75, 0.35, 0.75, 0.35];

  if (pattern === "orbit") {
    const out = Array<number>(9).fill(0.14);
    out[4] = 0.22;
    const head = step % ORBIT_RING.length;
    out[ORBIT_RING[head]!] = 1;
    out[ORBIT_RING[(head + 7) % 8]!] = 0.58;
    out[ORBIT_RING[(head + 6) % 8]!] = 0.28;
    return out;
  }

  if (pattern === "surfer") {
    const wave = step % 6;
    return Array.from({ length: 9 }, (_, i) => {
      const diag = Math.floor(i / 3) + (i % 3);
      const dist = Math.abs(diag - wave);
      if (dist === 0) return 1;
      if (dist === 1) return 0.52;
      return 0.16;
    });
  }

  if (pattern === "dots") {
    const order = [0, 4, 8, 2, 6, 1, 7, 3, 5];
    const activeA = order[step % 9]!;
    const activeB = order[(step + 3) % 9]!;
    const activeC = order[(step + 6) % 9]!;
    return Array.from({ length: 9 }, (_, i) => {
      if (i === activeA) return 1;
      if (i === activeB) return 0.62;
      if (i === activeC) return 0.34;
      return 0.14;
    });
  }

  // drive：上下对称驱动推演节奏
  const phase = step % 4;
  const colBright = [
    phase === 0 ? 1 : 0.24,
    phase === 1 || phase === 3 ? 0.95 : 0.32,
    phase === 2 ? 1 : 0.24,
  ];
  return Array.from({ length: 9 }, (_, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const centerBoost = row === 1 ? 0.16 : 0;
    return Math.min(1, colBright[col]! + centerBoost);
  });
};
