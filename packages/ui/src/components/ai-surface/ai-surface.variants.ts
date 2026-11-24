import { cva } from "class-variance-authority";
import type { AlertVariant } from "../alert/index.js";
import type { BadgeVariant } from "../badge/index.js";
import type { ButtonVariant } from "../button/index.js";
import type { ProgressTone } from "../progress/index.js";
import type { SurfaceButtonIntent } from "./ai-surface-0-nodes.js";
import type { SurfaceStatus, SurfaceTone } from "./ai-surface.types.js";

export const surfaceRootVariants = cva("flex w-full min-w-0 flex-col gap-3.5 text-foreground", {
  variants: {
    hasDock: {
      true: "@2xl:grid @2xl:grid-cols-[minmax(0,1fr)_16rem] @2xl:items-start @2xl:gap-5",
      false: "",
    },
  },
  defaultVariants: {
    hasDock: false,
  },
});

export const SURFACE_TONE_TEXT: Record<SurfaceTone, string> = {
  neutral: "text-foreground",
  signal: "text-info",
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-700 dark:text-amber-400",
  danger: "text-destructive",
  info: "text-info",
};

export const SURFACE_STATUS_TEXT: Record<SurfaceStatus, string> = {
  idle: "idle",
  pending: "pending",
  running: "running",
  done: "done",
  error: "error",
  cancelled: "cancelled",
};

export const SURFACE_STATUS_META: Record<
  SurfaceStatus,
  { label: string; variant: BadgeVariant; dot: boolean; pulse: boolean }
> = {
  idle: { label: "待命", variant: "outline", dot: false, pulse: false },
  pending: { label: "等待中", variant: "warning", dot: true, pulse: false },
  running: { label: "执行中", variant: "signal", dot: true, pulse: true },
  done: { label: "已完成", variant: "success", dot: true, pulse: false },
  error: { label: "异常", variant: "destructive", dot: true, pulse: false },
  cancelled: { label: "已取消", variant: "secondary", dot: false, pulse: false },
};

export const TONE_TO_BADGE: Record<SurfaceTone, BadgeVariant> = {
  neutral: "secondary",
  signal: "signal",
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "soft",
};

export const TONE_TO_ALERT: Record<SurfaceTone, AlertVariant> = {
  neutral: "neutral",
  signal: "info",
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "info",
};

export const TONE_TO_PROGRESS: Record<SurfaceTone, ProgressTone> = {
  neutral: "primary",
  signal: "signal",
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "signal",
};

export const INTENT_TO_BUTTON: Record<SurfaceButtonIntent, ButtonVariant> = {
  primary: "primary",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  danger: "destructive",
  signal: "signal",
  submit: "primary",
  cancel: "outline",
};

export const STACK_GAP_CLASS = {
  sm: "gap-2",
  md: "gap-3.5",
  lg: "gap-5",
} as const;

export const STACK_ALIGN_CLASS = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  between: "items-center justify-between",
  stretch: "items-stretch",
} as const;

export const GRID_COLS_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-1 @sm:grid-cols-2",
  3: "grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3",
  4: "grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-4",
} as const;

export const CONTROL_INPUT_CLASS =
  "box-border w-full rounded-lg border border-solid border-input bg-card px-3 py-2 font-sans text-sm text-foreground transition-colors placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive";
