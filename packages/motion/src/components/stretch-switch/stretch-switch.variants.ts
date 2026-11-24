/**
 * StretchSwitch 的样式与几何尺寸定义：支持 default / card / pill / row 四种形态与 sm / md / lg 尺寸。
 */
import type {
  StretchSwitchSize,
  StretchSwitchTone,
  StretchSwitchVariant,
} from "./stretch-switch.types.js";

export interface SwitchGeometry {
  rest: number;
  stretch: number;
  travel: number;
  trackClass: string;
  thumbClass: string;
}

export const SWITCH_GEOMETRY: Record<StretchSwitchSize, SwitchGeometry> = {
  sm: {
    rest: 14,
    stretch: 18,
    travel: 16,
    trackClass: "h-5 w-9 p-[2px]",
    thumbClass: "h-3.5",
  },
  md: {
    rest: 18,
    stretch: 23,
    travel: 20,
    trackClass: "h-6 w-11 p-[2px]",
    thumbClass: "h-[18px]",
  },
  lg: {
    rest: 22,
    stretch: 28,
    travel: 24,
    trackClass: "h-7 w-13 p-[2px]",
    thumbClass: "h-[22px]",
  },
};

export const SWITCH_TRACK_BASE =
  "relative m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center rounded-full border border-solid border-input bg-secondary shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] transition-[background-color,border-color,box-shadow] duration-(--ui-duration-normal) outline-none hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid data-disabled:pointer-events-none data-disabled:opacity-50";

export const SWITCH_TONE_CLASSES: Record<StretchSwitchTone, string> = {
  primary: "data-checked:border-transparent data-checked:bg-primary data-checked:shadow-none",
  signal:
    "data-checked:border-transparent data-checked:bg-signal data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
  success:
    "data-checked:border-transparent data-checked:bg-emerald-500 data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
};

export const SWITCH_THUMB_BASE =
  "inline-flex items-center justify-center rounded-full bg-white text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.18),0_0.5px_1px_rgba(0,0,0,0.08)]";

export const SWITCH_WRAPPER_VARIANTS: Record<StretchSwitchVariant, string> = {
  default: "inline-flex items-center gap-3",
  card: "flex w-full items-center justify-between gap-4 rounded-2xl border border-solid border-border bg-card px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) hover:border-foreground/20 has-data-checked:border-foreground/25 has-data-checked:bg-secondary/35 dark:has-data-checked:bg-white/[0.04]",
  pill: "inline-flex items-center gap-2.5 rounded-full border border-solid border-border bg-card py-1.5 pr-3.5 pl-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[border-color,background-color] duration-(--ui-duration-fast) hover:border-foreground/22 has-data-checked:border-foreground/25 has-data-checked:bg-secondary/40",
  row: "flex w-full items-center justify-between gap-4 rounded-xl px-2 py-2 transition-colors duration-(--ui-duration-fast) hover:bg-secondary/45",
};
