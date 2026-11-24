/**
 * ThinkingOrb 的样式定义：极简悬浮、精密刻度玻璃表圈、双环氛围光环与微光状态胶囊。
 */
import { cva } from "class-variance-authority";
import type { ThinkingOrbState } from "./thinking-orb.types.js";

export const THINKING_ORB_STATE_LABELS: Record<ThinkingOrbState, string> = {
  working: "处理中",
  searching: "检索中",
  solving: "求解中",
  listening: "聆听中",
  connecting: "连接中",
  weaving: "编织上下文",
  composing: "组织回答",
  breathing: "静候待命",
  shaping: "构思塑形",
};

export interface OrbThemeAccent {
  dot: string;
  glow: string;
  haloTint: string;
}

/** 各认知态的光学主题色（用于外环微光与状态胶囊脉冲点平滑呼应） */
export const ORB_STATE_ACCENTS: Record<ThinkingOrbState, OrbThemeAccent> = {
  working: { dot: "#7a5ee4", glow: "rgba(122,94,228,0.45)", haloTint: "rgba(122,94,228,0.16)" },
  searching: { dot: "#0ea5e9", glow: "rgba(14,165,233,0.45)", haloTint: "rgba(14,165,233,0.16)" },
  solving: { dot: "#6366f1", glow: "rgba(99,102,241,0.48)", haloTint: "rgba(99,102,241,0.18)" },
  listening: { dot: "#06b6d4", glow: "rgba(6,182,212,0.44)", haloTint: "rgba(6,182,212,0.16)" },
  connecting: { dot: "#818cf8", glow: "rgba(56,189,248,0.46)", haloTint: "rgba(129,140,248,0.17)" },
  weaving: { dot: "#c026d3", glow: "rgba(192,38,211,0.44)", haloTint: "rgba(168,85,247,0.17)" },
  composing: { dot: "#f59e0b", glow: "rgba(245,158,11,0.44)", haloTint: "rgba(245,158,11,0.16)" },
  breathing: { dot: "#8b73f2", glow: "rgba(139,115,242,0.36)", haloTint: "rgba(139,115,242,0.12)" },
  shaping: { dot: "#10b981", glow: "rgba(16,185,129,0.44)", haloTint: "rgba(16,185,129,0.16)" },
};

export const thinkingOrbFrameVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-full transition-[transform,box-shadow,border-color] duration-(--ui-duration-fast)",
  {
    variants: {
      variant: {
        minimal: "",
        framed:
          "border border-solid border-foreground/12 bg-gradient-to-b from-card via-card/95 to-muted/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(19,20,24,0.05),0_2px_6px_-2px_rgba(19,20,24,0.08),0_10px_24px_-12px_rgba(19,20,24,0.18)] dark:border-white/14 dark:from-white/[0.08] dark:via-card/90 dark:to-black/40 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_-1px_2px_rgba(0,0,0,0.45),0_12px_28px_-12px_rgba(0,0,0,0.72)]",
        halo: "border border-solid border-foreground/12 bg-gradient-to-b from-card/95 via-card/85 to-muted/65 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_0_0_4px_color-mix(in_oklab,var(--ui-foreground)_3%,transparent),0_14px_34px_-14px_rgba(19,20,24,0.22)] backdrop-blur-md dark:border-white/16 dark:from-white/[0.09] dark:via-card/80 dark:to-black/45 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_0_0_4px_rgba(255,255,255,0.045),0_16px_38px_-14px_rgba(0,0,0,0.78)]",
      },
      interactive: {
        true: "cursor-pointer hover:scale-[1.03] hover:border-foreground/22 active:scale-[0.99] dark:hover:border-white/26",
        false: "",
      },
    },
    defaultVariants: {
      variant: "minimal",
      interactive: false,
    },
  },
);

export const thinkingOrbRootVariants = cva("inline-flex shrink-0 items-center justify-center", {
  variants: {
    hasLabel: {
      true: "",
      false: "relative",
    },
    placement: {
      bottom: "flex-col gap-3",
      right: "flex-row gap-2.5",
    },
  },
  defaultVariants: {
    hasLabel: false,
    placement: "bottom",
  },
});

export const thinkingOrbLabelVariants = cva(
  "inline-flex items-center gap-2 font-sans text-xs font-medium tracking-tight text-foreground/85",
  {
    variants: {
      placement: {
        bottom:
          "rounded-full border border-solid border-border bg-card/90 px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_2px_8px_-4px_rgba(19,20,24,0.12)] backdrop-blur-sm dark:border-white/12 dark:bg-card/80 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_-4px_rgba(0,0,0,0.5)]",
        right: "text-foreground/90",
      },
    },
    defaultVariants: {
      placement: "bottom",
    },
  },
);
