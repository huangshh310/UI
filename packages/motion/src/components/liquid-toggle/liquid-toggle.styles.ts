/**
 * LiquidToggle 的样式映射表（不依赖 class-variance-authority）。
 */
import type {
  LiquidToggleSize,
  LiquidToggleTone,
  LiquidToggleVariant,
} from "./liquid-toggle.types.js";

export const TOGGLE_TRACK_BASE =
  "relative m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center rounded-full border-0 transition-[background-color,box-shadow] duration-(--ui-duration-normal) ease-out outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45";

export const TOGGLE_VARIANT_CLASSES: Record<LiquidToggleVariant, string> = {
  filled: "bg-input shadow-[inset_0_1px_2px_rgba(0,0,0,0.16)]",
  subtle:
    "bg-secondary shadow-[inset_0_0_0_1px_var(--ui-input)] data-[state=on]:shadow-[inset_0_1px_2px_rgba(0,0,0,0.14)]",
};

export interface LiquidToggleSizeTokens {
  track: string;
  thumb: string;
  travelPx: number;
}

export const TOGGLE_SIZE_CONFIG: Record<LiquidToggleSize, LiquidToggleSizeTokens> = {
  sm: { track: "h-6 w-11 p-0.5", thumb: "size-5", travelPx: 20 },
  md: { track: "h-8 w-14 p-1", thumb: "size-6", travelPx: 24 },
  lg: { track: "h-9 w-16 p-1", thumb: "size-7", travelPx: 28 },
};

export interface LiquidToggleToneTokens {
  trackOn: string;
  thumb: string;
}

export const TOGGLE_TONE_CONFIG: Record<LiquidToggleTone, LiquidToggleToneTokens> = {
  signal: {
    trackOn: "data-[state=on]:bg-signal",
    thumb: "bg-signal-foreground",
  },
  primary: {
    trackOn: "data-[state=on]:bg-primary",
    thumb: "bg-white in-data-[state=on]:bg-primary-foreground",
  },
  emerald: {
    trackOn: "data-[state=on]:bg-emerald-600 dark:data-[state=on]:bg-emerald-500",
    thumb: "bg-white",
  },
  destructive: {
    trackOn: "data-[state=on]:bg-destructive",
    thumb: "bg-white in-data-[state=on]:bg-destructive-foreground",
  },
};
