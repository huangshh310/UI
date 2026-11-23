// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * HoldToConfirm：C 端触感长按蓄力确认按钮，
 * 支持指针与键盘 Space/Enter 蓄力，松手、移出、触摸取消或失焦时立即回弹防误触。
 */

import { cn } from "@/lib/utils";
import { Check, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";

/** 蓄力进度与确认后的语义色调 */
export type HoldToConfirmTone = "signal" | "destructive" | "emerald";

/** 按钮底面视觉变体 */
export type HoldToConfirmVariant = "surface" | "solid" | "outline";

/** 按钮尺寸 */
export type HoldToConfirmSize = "sm" | "md" | "lg";

/** 圆角风格 */
export type HoldToConfirmRadius = "pill" | "default";

export interface HoldToConfirmProps {
  /** 默认按住提示文案 */
  label?: string;
  /** 完成确认后的文案 */
  confirmedLabel?: string;
  /** 需要持续按住的毫秒数（默认 900ms） */
  holdDurationMs?: number;
  /** 语义色调，默认 signal */
  tone?: HoldToConfirmTone;
  /** 底面视觉变体，默认 surface */
  variant?: HoldToConfirmVariant;
  /** 按钮尺寸，默认 md */
  size?: HoldToConfirmSize;
  /** 圆角风格，默认 pill */
  radius?: HoldToConfirmRadius;
  /** 未确认状态的可选前置图标 */
  icon?: ReactNode;
  /** 确认后是否显示重置按钮，默认显示 */
  showReset?: boolean;
  /** 完成确认回调 */
  onConfirm?: () => void;
  /** 点击重置按钮后的回调 */
  onReset?: () => void;
  /** 禁用状态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
const HOLD_BUTTON_BASE =
  "relative inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center overflow-hidden border border-solid font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-fast) ease-out outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const HOLD_VARIANT_CLASSES: Record<HoldToConfirmVariant, string> = {
  surface:
    "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/50 dark:bg-card/85 dark:hover:bg-accent/60",
  solid:
    "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-primary/92 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_3px_rgba(0,0,0,0.3)]",
  outline:
    "border-border bg-transparent text-foreground hover:border-foreground/22 hover:bg-accent/50",
};

const HOLD_SIZE_CLASSES: Record<HoldToConfirmSize, string> = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

const HOLD_RADIUS_CLASSES: Record<HoldToConfirmRadius, string> = {
  pill: "rounded-full",
  default: "rounded-xl",
};

interface HoldToneTokens {
  fill: string;
  activeBorder: string;
  confirmed: string;
}

const HOLD_TONE_CONFIG: Record<HoldToConfirmTone, HoldToneTokens> = {
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

const HOLD_SOLID_FILL_CLASS = "bg-primary-foreground/22";

const RESET_BUTTON_CLASSES =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-solid border-border bg-card text-muted-foreground shadow-xs transition-colors hover:border-foreground/22 hover:text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid";
const DEFAULTS = {
  label: "长按以确认执行",
  confirmedLabel: "已确认执行",
  holdDurationMs: 900,
  tone: "signal",
  variant: "surface",
  size: "md",
  radius: "pill",
  showReset: true,
  disabled: false,
} as const;

const HoldFill = ({
  holding,
  tone,
  variant,
  holdDurationMs,
  reduced,
}: {
  holding: boolean;
  tone: HoldToConfirmTone;
  variant: HoldToConfirmVariant;
  holdDurationMs: number;
  reduced: boolean | null;
}) => (
  <motion.span
    aria-hidden="true"
    initial={false}
    animate={{ width: holding ? "100%" : "0%" }}
    transition={{
      duration: reduced ? 0 : holding ? holdDurationMs / 1000 : 0.18,
      ease: holding ? "linear" : "easeOut",
    }}
    className={cn(
      "pointer-events-none absolute inset-y-0 left-0",
      variant === "solid" ? HOLD_SOLID_FILL_CLASS : HOLD_TONE_CONFIG[tone].fill,
    )}
  />
);

interface HoldButtonProps {
  holding: boolean;
  confirmed: boolean;
  disabled: boolean;
  tone: HoldToConfirmTone;
  variant: HoldToConfirmVariant;
  size: HoldToConfirmSize;
  radius: HoldToConfirmRadius;
  icon?: ReactNode;
  label: string;
  confirmedLabel: string;
  holdDurationMs: number;
  reduced: boolean | null;
  onStart: () => void;
  onCancel: () => void;
}

const HoldButton = (p: HoldButtonProps) => {
  const toneTokens = HOLD_TONE_CONFIG[p.tone];
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (!e.repeat) p.onStart();
  };
  const handleKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") p.onCancel();
  };

  return (
    <button
      type="button"
      disabled={p.disabled}
      onPointerDown={p.onStart}
      onPointerUp={p.onCancel}
      onPointerLeave={p.onCancel}
      onPointerCancel={p.onCancel}
      onBlur={p.onCancel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={cn(
        HOLD_BUTTON_BASE,
        HOLD_SIZE_CLASSES[p.size],
        HOLD_RADIUS_CLASSES[p.radius],
        p.holding && "scale-[0.985] motion-reduce:scale-100",
        p.confirmed
          ? toneTokens.confirmed
          : cn(
              HOLD_VARIANT_CLASSES[p.variant],
              p.holding && p.variant !== "solid" && toneTokens.activeBorder,
            ),
      )}
    >
      {!p.confirmed && (
        <HoldFill
          holding={p.holding}
          tone={p.tone}
          variant={p.variant}
          holdDurationMs={p.holdDurationMs}
          reduced={p.reduced}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-1.5" aria-live="polite">
        {p.confirmed ? <Check aria-hidden="true" /> : p.icon}
        <span>{p.confirmed ? p.confirmedLabel : p.label}</span>
      </span>
    </button>
  );
};

const ResetHoldButton = ({ onReset }: { onReset: () => void }) => (
  <button
    type="button"
    aria-label="重置确认状态"
    onClick={onReset}
    className={RESET_BUTTON_CLASSES}
  >
    <RotateCcw aria-hidden="true" className="size-3.5" />
  </button>
);

const useHoldController = ({
  disabled,
  holdDurationMs,
  onConfirm,
  onReset,
}: {
  disabled: boolean;
  holdDurationMs: number;
  onConfirm?: (() => void) | undefined;
  onReset?: (() => void) | undefined;
}) => {
  const [holding, setHolding] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const startHold = () => {
    if (disabled || confirmed || holding) return;
    setHolding(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      setConfirmed(true);
      onConfirm?.();
    }, holdDurationMs);
  };

  const cancelHold = () => {
    if (!holding) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setHolding(false);
  };

  const reset = () => {
    setConfirmed(false);
    onReset?.();
  };

  return { holding, confirmed, reset, startHold, cancelHold };
};

export const HoldToConfirm = (inputProps: HoldToConfirmProps) => {
  const p = { ...DEFAULTS, ...inputProps };
  const reduced = useReducedMotion();
  const { holding, confirmed, reset, startHold, cancelHold } = useHoldController(p);

  return (
    <div
      data-slot="hold-to-confirm"
      data-tone={p.tone}
      data-variant={p.variant}
      data-size={p.size}
      data-radius={p.radius}
      data-holding={holding ? "" : undefined}
      data-confirmed={confirmed ? "" : undefined}
      className={cn("inline-flex items-center gap-2", p.className)}
    >
      <HoldButton
        holding={holding}
        confirmed={confirmed}
        disabled={p.disabled}
        tone={p.tone}
        variant={p.variant}
        size={p.size}
        radius={p.radius}
        icon={p.icon}
        label={p.label}
        confirmedLabel={p.confirmedLabel}
        holdDurationMs={p.holdDurationMs}
        reduced={reduced}
        onStart={startHold}
        onCancel={cancelHold}
      />
      {confirmed && p.showReset && <ResetHoldButton onReset={reset} />}
    </div>
  );
};
