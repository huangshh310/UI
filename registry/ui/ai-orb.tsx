// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiOrb：C 端多模态 AI 状态球（参考 aicss.dev Orbs 与 Apple Intelligence / ChatGPT Voice 流体极光球）。
 * 支持流体极光球（aurora）、暗夜玻璃点阵（lattice）与交互式胶囊形态（pill）。
 */

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

export type AiOrbState = "idle" | "thinking" | "listening" | "speaking";
export type AiOrbVariant = "aurora" | "lattice";
export type AiOrbSize = "sm" | "md" | "lg";

export interface AiOrbProps {
  /** 智能体当前状态 */
  state?: AiOrbState;
  /** 视觉形态：流光球体（aurora）或 3x3 像素点阵（lattice，参考 aicss.dev） */
  variant?: AiOrbVariant;
  /** 尺寸规格 */
  size?: AiOrbSize;
  /** 是否包裹在触感状态胶囊中 */
  pill?: boolean;
  /** 状态文案（默认按 state 自动匹配） */
  label?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}
const STATE_LABEL: Record<AiOrbState, string> = {
  idle: "AI 待命",
  thinking: "深度思考中…",
  listening: "正在聆听…",
  speaking: "语音回应中…",
};

const SIZE_MAP: Record<AiOrbSize, string> = {
  sm: "size-7",
  md: "size-12",
  lg: "size-16",
};

const AURORA_MESH: Record<AiOrbState, string> = {
  idle: "conic-gradient(from 40deg, #52525b, #3b82f6, #60a5fa, #71717a, #52525b)",
  thinking: "conic-gradient(from 0deg, #155dfc, #3b82f6, #38bdf8, #818cf8, #155dfc)",
  listening: "conic-gradient(from 90deg, #0284c7, #155dfc, #38bdf8, #60a5fa, #0284c7)",
  speaking: "conic-gradient(from 180deg, #10b981, #14b8a6, #3b82f6, #60a5fa, #10b981)",
};

const LATTICE_DOT_TONE: Record<AiOrbState, string> = {
  idle: "bg-muted-foreground/45",
  thinking: "bg-signal shadow-[0_0_6px_color-mix(in_srgb,var(--ui-signal)_45%,transparent)]",
  listening: "bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.45)]",
  speaking: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.45)]",
};

const LATTICE_CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const LatticeOrb = ({
  state,
  size,
  reduced,
}: {
  state: AiOrbState;
  size: AiOrbSize;
  reduced: boolean | null;
}) => {
  const dotSize = size === "sm" ? "size-1" : size === "md" ? "size-1.5" : "size-2";
  const speed = state === "thinking" ? 0.85 : state === "speaking" ? 0.6 : 1.5;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid grid-cols-3 place-items-center rounded-2xl border border-solid border-border bg-secondary p-1.5 shadow-xs dark:border-white/10 dark:bg-neutral-900",
        SIZE_MAP[size],
      )}
    >
      {LATTICE_CELLS.map((idx) => (
        <motion.span
          key={idx}
          animate={
            reduced || state === "idle"
              ? { opacity: idx === 4 ? 0.95 : 0.35, scale: 1 }
              : { opacity: [0.22, 1, 0.22], scale: [0.8, 1.2, 0.8] }
          }
          transition={{
            duration: speed,
            repeat: Number.POSITIVE_INFINITY,
            delay: (idx % 3) * 0.08 + Math.floor(idx / 3) * 0.08,
            ease: "easeInOut",
          }}
          className={cn("rounded-full", LATTICE_DOT_TONE[state], dotSize)}
        />
      ))}
    </span>
  );
};

const AURORA_MOTION: Record<AiOrbState, { scale: number[]; beat: number; spin: number }> = {
  idle: { scale: [1, 1.03, 1], beat: 2.2, spin: 6 },
  thinking: { scale: [1, 1.04, 1], beat: 2, spin: 3.2 },
  listening: { scale: [1, 1.06, 1], beat: 1.8, spin: 4.5 },
  speaking: { scale: [1, 1.1, 1], beat: 0.85, spin: 2.4 },
};

const AuroraOrb = ({
  state,
  size,
  reduced,
}: {
  state: AiOrbState;
  size: AiOrbSize;
  reduced: boolean | null;
}) => {
  const cfg = AURORA_MOTION[state];
  const mesh = AURORA_MESH[state];
  const spin = reduced || state === "idle" ? { rotate: 0 } : { rotate: 360 };

  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex shrink-0 items-center justify-center", SIZE_MAP[size])}
    >
      {state !== "idle" && (
        <motion.span
          animate={
            reduced ? { opacity: 0.22 } : { scale: [0.96, 1.12, 0.96], opacity: [0.18, 0.34, 0.18] }
          }
          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{ background: mesh }}
          className="pointer-events-none absolute -inset-0.5 rounded-full blur-sm"
        />
      )}
      <motion.span
        animate={reduced ? { scale: 1 } : { scale: cfg.scale }}
        transition={{ duration: cfg.beat, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="relative inline-flex size-full items-center justify-center overflow-hidden rounded-full border border-solid border-white/60 bg-neutral-950 shadow-sm dark:border-white/25"
      >
        <motion.span
          animate={spin}
          transition={{ duration: cfg.spin, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ background: mesh }}
          className="absolute -inset-2 opacity-95 blur-[2px]"
        />
        <span className="absolute inset-0.5 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.82),rgba(255,255,255,0.12)_42%,transparent_68%)]" />
        <span className="absolute inset-0 rounded-full shadow-[inset_0_-4px_8px_rgba(15,23,42,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.65)]" />
      </motion.span>
    </span>
  );
};

const OrbCore = ({
  variant,
  state,
  size,
  reduced,
}: {
  variant: AiOrbVariant;
  state: AiOrbState;
  size: AiOrbSize;
  reduced: boolean | null;
}) =>
  variant === "lattice" ? (
    <LatticeOrb state={state} size={size} reduced={reduced} />
  ) : (
    <AuroraOrb state={state} size={size} reduced={reduced} />
  );

export const AiOrb = ({
  state = "thinking",
  variant = "aurora",
  size = "md",
  pill = false,
  label,
  onClick,
  className,
}: AiOrbProps) => {
  const reduced = useReducedMotion();
  const displayLabel = label ?? STATE_LABEL[state];
  const core = (
    <OrbCore variant={variant} state={state} size={pill ? "sm" : size} reduced={reduced} />
  );

  if (pill || onClick) {
    return (
      <button
        type="button"
        data-slot="ai-orb"
        data-state={state}
        aria-label={displayLabel}
        onClick={onClick}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-solid border-border/90 bg-card/95 py-1.5 pr-4 pl-2 font-sans text-xs font-medium text-foreground shadow-md backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-signal/40 hover:shadow-lg active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        {core}
        <span>{displayLabel}</span>
      </button>
    );
  }

  return (
    <output
      aria-label={displayLabel}
      data-slot="ai-orb"
      data-state={state}
      className={cn("inline-flex items-center gap-3", className)}
    >
      {core}
      {label && <span className="text-xs font-medium text-foreground">{label}</span>}
    </output>
  );
};
