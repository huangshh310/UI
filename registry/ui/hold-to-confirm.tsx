// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * HoldToConfirm：C 端触感长按蓄力确认按钮（参考 interior.dev Hold to Confirm），
 * 支持指针与键盘 Space/Enter 蓄力，松手、移出、触摸取消或失焦时立即回弹防误触。
 */

import { cn } from "@/lib/utils";
import { Check, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

export type HoldToConfirmTone = "signal" | "destructive";

export interface HoldToConfirmProps {
  /** 默认按住提示文案 */
  label?: string;
  /** 完成确认后的文案 */
  confirmedLabel?: string;
  /** 需要持续按住的毫秒数（默认 900ms） */
  holdDurationMs?: number;
  /** 语义色调 */
  tone?: HoldToConfirmTone;
  /** 完成确认回调 */
  onConfirm?: () => void;
  /** 禁用状态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
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

const HoldButton = ({
  holding,
  confirmed,
  disabled,
  tone,
  label,
  confirmedLabel,
  holdDurationMs,
  reduced,
  onStart,
  onCancel,
}: HoldButtonProps) => {
  const activeBorder = tone === "destructive" ? "border-destructive/60" : "border-signal/60";
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (!e.repeat) onStart();
  };
  const handleKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") onCancel();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={onStart}
      onPointerUp={onCancel}
      onPointerLeave={onCancel}
      onPointerCancel={onCancel}
      onBlur={onCancel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={cn(
        "relative inline-flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-solid px-4 font-sans text-xs font-medium transition-all select-none outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        confirmed
          ? "border-signal bg-signal text-signal-foreground shadow-sm"
          : cn("border-border bg-card text-foreground shadow-sm", holding && activeBorder),
      )}
    >
      {!confirmed && (
        <HoldFill holding={holding} tone={tone} holdDurationMs={holdDurationMs} reduced={reduced} />
      )}
      <span className="relative z-10 inline-flex items-center gap-1.5">
        {confirmed && <Check aria-hidden="true" className="size-3.5" />}
        <span>{confirmed ? confirmedLabel : label}</span>
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
