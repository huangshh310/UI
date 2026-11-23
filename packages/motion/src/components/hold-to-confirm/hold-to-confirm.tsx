"use client";

/**
 * HoldToConfirm：C 端触感长按蓄力确认按钮，
 * 支持指针与键盘 Space/Enter 蓄力，松手、移出、触摸取消或失焦时立即回弹防误触。
 */
import { cn } from "@matt-ui/utils";
import { Check, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  HOLD_BUTTON_BASE,
  HOLD_RADIUS_CLASSES,
  HOLD_SIZE_CLASSES,
  HOLD_SOLID_FILL_CLASS,
  HOLD_TONE_CONFIG,
  HOLD_VARIANT_CLASSES,
  RESET_BUTTON_CLASSES,
} from "./hold-to-confirm.styles.js";
import type {
  HoldToConfirmProps,
  HoldToConfirmRadius,
  HoldToConfirmSize,
  HoldToConfirmTone,
  HoldToConfirmVariant,
} from "./hold-to-confirm.types.js";

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
