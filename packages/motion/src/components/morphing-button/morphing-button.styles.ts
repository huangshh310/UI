/**
 * MorphingButton 的样式映射表（不依赖 class-variance-authority）。
 */
import type {
  MorphingButtonRadius,
  MorphingButtonSize,
  MorphingButtonStatus,
  MorphingButtonSuccessTone,
  MorphingButtonVariant,
} from "./morphing-button.types.js";

export const MORPHING_BASE_CLASSES =
  "m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center overflow-hidden border border-solid font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-normal) ease-out active:scale-[0.98] motion-reduce:active:scale-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 data-[status=loading]:cursor-progress [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const IDLE_VARIANT_CLASSES: Record<MorphingButtonVariant, string> = {
  primary:
    "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-primary/92 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_3px_rgba(0,0,0,0.3)]",
  signal:
    "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_-2px_color-mix(in_oklab,var(--ui-signal)_40%,transparent)] hover:bg-signal/92",
  outline:
    "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
};

const SUCCESS_TONE_CLASSES: Record<MorphingButtonSuccessTone, string> = {
  signal:
    "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_-2px_color-mix(in_oklab,var(--ui-signal)_40%,transparent)]",
  emerald:
    "border-transparent bg-emerald-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_10px_-2px_rgba(4,120,87,0.36)] dark:bg-emerald-500 dark:text-neutral-950",
};

const ERROR_CLASSES =
  "border-transparent bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.08)]";

export const MORPHING_SIZE_CLASSES: Record<MorphingButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

export const MORPHING_RADIUS_CLASSES: Record<MorphingButtonRadius, string> = {
  pill: "rounded-full",
  default: "rounded-xl",
};

/** 根据当前阶段与主题变体解析表面色调 */
export const resolveMorphingTone = (
  status: MorphingButtonStatus,
  variant: MorphingButtonVariant,
  successTone: MorphingButtonSuccessTone,
): string => {
  if (status === "success") return SUCCESS_TONE_CLASSES[successTone];
  if (status === "error") return ERROR_CLASSES;
  return IDLE_VARIANT_CLASSES[variant];
};
