"use client";

/**
 * HoldToConfirm：C 端触感长按蓄力确认按钮（参考 interior.dev Hold to Confirm），
 * 支持指针与键盘 Space/Enter 蓄力，松手、移出、触摸取消或失焦时立即回弹防误触。
 */
import { cn } from "@matt-ui/utils";
import { Check, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { HoldToConfirmProps, HoldToConfirmTone } from "./hold-to-confirm.types.js";

const HoldFill = ({
  holding,
  tone,
  holdDurationMs,
  reduced,
}: {
  holding: boolean;
  tone: HoldToConfirmTone;
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
      tone === "destructive" ? "bg-destructive/22" : "bg-signal/22",
    )}
  />
);

interface HoldButtonProps {
  holding: boolean;
  confirmed: boolean;
  disabled: boolean;
  tone: HoldToConfirmTone;
  label: string;
  confirmedLabel: string;
  holdDurationMs: number;
  reduced: boolean | null;
  onStart: () => void;
  onCancel: () => void;
}

const HoldButton = (p: HoldButtonProps) => {
  const activeBorder = p.tone === "destructive" ? "border-destructive/60" : "border-signal/60";
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
        "relative inline-flex h-11 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-solid px-5 font-sans text-sm font-medium tracking-[-0.01em] transition-[background-color,border-color,transform,box-shadow] select-none outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45",
        p.holding && "scale-[0.985]",
        p.confirmed
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : cn(
              "border-border bg-card text-foreground shadow-sm hover:border-foreground/20 dark:bg-secondary",
              p.holding && activeBorder,
            ),
      )}
    >
      {!p.confirmed && (
        <HoldFill
          holding={p.holding}
          tone={p.tone}
          holdDurationMs={p.holdDurationMs}
          reduced={p.reduced}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-1.5">
        {p.confirmed && <Check aria-hidden="true" className="size-3.5" />}
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
    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-solid border-border bg-card text-muted-foreground shadow-xs transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <RotateCcw aria-hidden="true" className="size-3.5" />
  </button>
);

const useHoldController = ({
  disabled,
  holdDurationMs,
  onConfirm,
}: {
  disabled: boolean;
  holdDurationMs: number;
  onConfirm?: (() => void) | undefined;
}) => {
  const [holding, setHolding] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  const startHold = () => {
    if (disabled || confirmed || holding) return;
    setHolding(true);
    clearTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      setConfirmed(true);
      onConfirm?.();
    }, holdDurationMs);
  };
  const cancelHold = () => {
    if (!holding) return;
    clearTimer();
    setHolding(false);
  };
  return { holding, confirmed, setConfirmed, startHold, cancelHold };
};

export const HoldToConfirm = ({
  label = "长按以确认执行",
  confirmedLabel = "已确认执行",
  holdDurationMs = 900,
  tone = "signal",
  onConfirm,
  disabled = false,
  className,
}: HoldToConfirmProps) => {
  const reduced = useReducedMotion();
  const { holding, confirmed, setConfirmed, startHold, cancelHold } = useHoldController({
    disabled,
    holdDurationMs,
    onConfirm,
  });

  return (
    <div data-slot="hold-to-confirm" className={cn("inline-flex items-center gap-2", className)}>
      <HoldButton
        holding={holding}
        confirmed={confirmed}
        disabled={disabled}
        tone={tone}
        label={label}
        confirmedLabel={confirmedLabel}
        holdDurationMs={holdDurationMs}
        reduced={reduced}
        onStart={startHold}
        onCancel={cancelHold}
      />
      {confirmed && <ResetHoldButton onReset={() => setConfirmed(false)} />}
    </div>
  );
};
