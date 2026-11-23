/**
 * ThinkingOrb 的样式定义：极简无框、利落表圈、柔光氛围环与禅意等宽微标。
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
          "border border-solid border-border bg-card shadow-xs dark:border-white/10 dark:bg-card/85",
        halo: "border border-solid border-border bg-background/85 shadow-[0_0_0_4px_color-mix(in_oklab,var(--ui-foreground)_5%,transparent)] backdrop-blur-md dark:border-white/12 dark:bg-card/70 dark:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]",
      },
      interactive: {
        true: "hover:scale-[1.02] hover:border-foreground/20 dark:hover:border-white/20",
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
  "inline-flex items-center font-mono text-[11px] font-medium tracking-tight text-muted-foreground",
);
