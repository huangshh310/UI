/**
 * HoldToConfirm 的样式映射表（不依赖 class-variance-authority）。
 */
import type {
  HoldToConfirmRadius,
  HoldToConfirmSize,
  HoldToConfirmTone,
  HoldToConfirmVariant,
} from "./hold-to-confirm.types.js";

export const HOLD_BUTTON_BASE =
  "relative inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center overflow-hidden border border-solid font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-fast) ease-out outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

export const HOLD_VARIANT_CLASSES: Record<HoldToConfirmVariant, string> = {
  surface:
    "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/50 dark:bg-card/85 dark:hover:bg-accent/60",
  solid:
    "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-primary/92 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_3px_rgba(0,0,0,0.3)]",
  outline:
    "border-border bg-transparent text-foreground hover:border-foreground/22 hover:bg-accent/50",
};

export const HOLD_SIZE_CLASSES: Record<HoldToConfirmSize, string> = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export const HOLD_RADIUS_CLASSES: Record<HoldToConfirmRadius, string> = {
  pill: "rounded-full",
  default: "rounded-xl",
};

export interface HoldToneTokens {
  fill: string;
  activeBorder: string;
  confirmed: string;
}

export const HOLD_TONE_CONFIG: Record<HoldToConfirmTone, HoldToneTokens> = {
  signal: {
    fill: "bg-signal/22 dark:bg-signal/28",
    activeBorder: "border-signal/60",
    confirmed:
      "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_-2px_color-mix(in_oklab,var(--ui-signal)_40%,transparent)]",
  },
  destructive: {
    fill: "bg-destructive/22 dark:bg-destructive/28",
    activeBorder: "border-destructive/60",
    confirmed:
      "border-transparent bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.08)]",
  },
  emerald: {
    fill: "bg-emerald-600/20 dark:bg-emerald-500/26",
    activeBorder: "border-emerald-600/60 dark:border-emerald-500/60",
    confirmed:
      "border-transparent bg-emerald-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_10px_-2px_rgba(4,120,87,0.34)] dark:bg-emerald-500 dark:text-neutral-950",
  },
};

export const HOLD_SOLID_FILL_CLASS = "bg-primary-foreground/22";

export const RESET_BUTTON_CLASSES =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-solid border-border bg-card text-muted-foreground shadow-xs transition-colors hover:border-foreground/22 hover:text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid";
