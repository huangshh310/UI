/**
 * ThinkingOrb 的样式定义：极简无框、毛玻璃表圈与环境光晕变体。
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

export const thinkingOrbFrameVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-full transition-[transform,box-shadow,border-color] duration-(--ui-duration-fast)",
  {
    variants: {
      variant: {
        minimal: "",
        framed:
          "border border-solid border-border/80 bg-card/85 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md dark:border-white/10 dark:bg-card/70 dark:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]",
        halo: "border border-solid border-border/70 bg-background/75 shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-foreground)_4%,transparent),0_10px_28px_-12px_rgba(0,0,0,0.16)] backdrop-blur-md dark:border-white/12 dark:bg-card/60 dark:shadow-[0_0_0_4px_rgba(255,255,255,0.04),0_14px_36px_-10px_rgba(0,0,0,0.72)]",
      },
      interactive: {
        true: "hover:scale-103 hover:border-foreground/22 dark:hover:border-white/22",
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
      bottom: "flex-col gap-2",
      right: "flex-row gap-2.5",
    },
  },
  defaultVariants: {
    hasLabel: false,
    placement: "bottom",
  },
});

export const thinkingOrbLabelVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border border-solid border-border/80 bg-card/90 px-2.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-card/75",
);
