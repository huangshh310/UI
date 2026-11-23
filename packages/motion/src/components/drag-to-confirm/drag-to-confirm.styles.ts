/**
 * DragToConfirm 的样式映射表（不依赖 class-variance-authority）。
 */
import type {
  DragToConfirmSize,
  DragToConfirmTone,
  DragToConfirmVariant,
} from "./drag-to-confirm.types.js";

export const TRACK_BASE_CLASSES =
  "relative flex max-w-full items-center overflow-hidden rounded-full border border-solid p-1 font-sans font-medium tracking-[-0.01em] select-none transition-colors duration-(--ui-duration-normal)";

export const TRACK_VARIANT_CLASSES: Record<DragToConfirmVariant, string> = {
  subtle:
    "border-border bg-secondary/75 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:bg-card dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]",
  glass: "border-border/90 bg-card/90 shadow-sm backdrop-blur-md dark:bg-card/85",
};

export const HANDLE_BASE_CLASSES =
  "relative z-10 flex shrink-0 cursor-grab touch-none items-center justify-center rounded-full border-0 outline-none transition-colors duration-(--ui-duration-normal) active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid";

export interface DragSizeTokens {
  track: string;
  handle: string;
  handlePx: number;
  hintPad: string;
  confirmedPad: string;
  icon: string;
}

export const DRAG_SIZE_CONFIG: Record<DragToConfirmSize, DragSizeTokens> = {
  sm: {
    track: "h-12 w-64 text-xs",
    handle: "size-10",
    handlePx: 40,
    hintPad: "pl-10",
    confirmedPad: "pr-10",
    icon: "size-4",
  },
  md: {
    track: "h-14 w-72 text-sm",
    handle: "size-12",
    handlePx: 48,
    hintPad: "pl-12",
    confirmedPad: "pr-12",
    icon: "size-5",
  },
  lg: {
    track: "h-16 w-80 text-[15px]",
    handle: "size-14",
    handlePx: 56,
    hintPad: "pl-14",
    confirmedPad: "pr-14",
    icon: "size-5",
  },
};

export interface DragToneTokens {
  fill: string;
  handleIdle: string;
  handleConfirmed: string;
  confirmedBorder: string;
}

export const DRAG_TONE_CONFIG: Record<DragToConfirmTone, DragToneTokens> = {
  signal: {
    fill: "bg-signal/16 dark:bg-signal/22",
    handleIdle:
      "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_2px_8px_rgba(0,0,0,0.16)]",
    handleConfirmed:
      "bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_color-mix(in_oklab,var(--ui-signal)_40%,transparent)]",
    confirmedBorder: "border-signal/45",
  },
  destructive: {
    fill: "bg-destructive/16 dark:bg-destructive/22",
    handleIdle:
      "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(220,38,38,0.28)]",
    handleConfirmed:
      "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_10px_rgba(220,38,38,0.34)]",
    confirmedBorder: "border-destructive/50",
  },
  emerald: {
    fill: "bg-emerald-600/16 dark:bg-emerald-500/22",
    handleIdle:
      "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_2px_8px_rgba(0,0,0,0.16)]",
    handleConfirmed:
      "bg-emerald-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_10px_rgba(4,120,87,0.34)] dark:bg-emerald-500 dark:text-neutral-950",
    confirmedBorder: "border-emerald-600/45 dark:border-emerald-500/50",
  },
};
