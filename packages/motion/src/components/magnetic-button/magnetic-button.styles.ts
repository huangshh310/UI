/**
 * MagneticButton 的样式映射表（不依赖 class-variance-authority）。
 */
import type {
  MagneticButtonRadius,
  MagneticButtonSize,
  MagneticButtonVariant,
} from "./magnetic-button.types.js";

export const MAGNETIC_BASE_CLASSES =
  "m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center border border-solid font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.97] motion-reduce:active:scale-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

export const MAGNETIC_VARIANT_CLASSES: Record<MagneticButtonVariant, string> = {
  primary:
    "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_8px_-2px_rgba(0,0,0,0.14)] hover:bg-primary/92 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_2px_10px_-2px_rgba(0,0,0,0.45)]",
  signal:
    "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_4px_14px_-4px_color-mix(in_oklab,var(--ui-signal)_45%,transparent)] hover:bg-signal/92",
  secondary:
    "border-border/70 bg-secondary text-secondary-foreground shadow-xs hover:border-border hover:bg-accent",
  outline:
    "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-accent/80",
};

export const MAGNETIC_SIZE_CLASSES: Record<MagneticButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

export const MAGNETIC_RADIUS_CLASSES: Record<MagneticButtonRadius, string> = {
  pill: "rounded-full",
  default: "rounded-xl",
};
