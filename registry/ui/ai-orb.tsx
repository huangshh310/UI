// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiOrb：C 端多模态 AI 状态球（参考 ChatGPT Voice / Apple Intelligence / Linear Agent）。
 * 支持流体极光球（aurora）、暗夜玻璃 3x3 点阵（lattice）、轨道光环（ring）与触感胶囊形态（pill）。
 */

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

export const ORB_STATE_LABEL: Record<AiOrbState, string> = {
  idle: "AI 待命",
  thinking: "深度思考中…",
  listening: "正在聆听…",
  speaking: "语音回应中…",
};

export const ORB_SIZE_CLASS: Record<AiOrbSize, string> = {
  xs: "size-5",
  sm: "size-7",
  md: "size-12",
  lg: "size-16",
  xl: "size-20",
};

export const ORB_LATTICE_DOT_SIZE: Record<AiOrbSize, string> = {
  xs: "size-[3px]",
  sm: "size-1",
  md: "size-1.5",
  lg: "size-2",
  xl: "size-2.5",
};

export const ORB_LATTICE_PADDING: Record<AiOrbSize, string> = {
  xs: "rounded-lg p-1 gap-0.5",
  sm: "rounded-xl p-1 gap-0.5",
  md: "rounded-2xl p-1.5 gap-1",
  lg: "rounded-[20px] p-2 gap-1.5",
  xl: "rounded-[24px] p-2.5 gap-2",
};

export const ORB_AURORA_MESH: Record<AiOrbState, string> = {
  idle: "conic-gradient(from 40deg, #52525b, #3b82f6, #60a5fa, #71717a, #52525b)",
  thinking: "conic-gradient(from 0deg, #155dfc, #3b82f6, #38bdf8, #818cf8, #155dfc)",
  listening: "conic-gradient(from 90deg, #0284c7, #155dfc, #38bdf8, #60a5fa, #0284c7)",
  speaking: "conic-gradient(from 180deg, #10b981, #14b8a6, #3b82f6, #60a5fa, #10b981)",
};

export const ORB_TONE_MESH: Record<Exclude<AiOrbTone, "auto">, string> = {
  signal: "conic-gradient(from 0deg, #155dfc, #3b82f6, #60a5fa, #2563eb, #155dfc)",
  emerald: "conic-gradient(from 120deg, #059669, #10b981, #2dd4bf, #34d399, #059669)",
  amber: "conic-gradient(from 60deg, #d97706, #f59e0b, #fbbf24, #ea580c, #d97706)",
  mono: "conic-gradient(from 30deg, #3f3f46, #71717a, #e4e4e7, #52525b, #3f3f46)",
};

export const ORB_LATTICE_DOT_BY_STATE: Record<AiOrbState, string> = {
  idle: "bg-zinc-400/55 dark:bg-zinc-500/60",
  thinking: "bg-signal shadow-[0_0_6px_color-mix(in_srgb,var(--ui-signal)_50%,transparent)]",
  listening: "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.55)]",
  speaking: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.55)]",
};

export const ORB_LATTICE_DOT_BY_TONE: Record<Exclude<AiOrbTone, "auto">, string> = {
  signal: "bg-signal shadow-[0_0_6px_color-mix(in_srgb,var(--ui-signal)_50%,transparent)]",
  emerald: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.55)]",
  amber: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.55)]",
  mono: "bg-zinc-200 shadow-[0_0_6px_rgba(228,228,231,0.45)]",
};

export const ORB_STATUS_DOT_CLASS: Record<AiOrbState, string> = {
  idle: "bg-muted-foreground/50",
  thinking: "bg-signal",
  listening: "bg-sky-500",
  speaking: "bg-emerald-500",
};

export const ORB_AURORA_MOTION: Record<
  AiOrbState,
  { scale: number[]; beat: number; spin: number }
> = {
  idle: { scale: [1, 1.025, 1], beat: 2.6, spin: 7 },
  thinking: { scale: [1, 1.045, 1], beat: 1.9, spin: 3.1 },
  listening: { scale: [1, 1.065, 1], beat: 1.65, spin: 4.2 },
  speaking: { scale: [1, 1.1, 1], beat: 0.85, spin: 2.3 },
};

export const ORB_LATTICE_CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export const resolveOrbMesh = (state: AiOrbState, tone: AiOrbTone): string =>
  tone === "auto" ? ORB_AURORA_MESH[state] : ORB_TONE_MESH[tone];

export const resolveLatticeDotTone = (state: AiOrbState, tone: AiOrbTone): string =>
  tone === "auto" ? ORB_LATTICE_DOT_BY_STATE[state] : ORB_LATTICE_DOT_BY_TONE[tone];
export type AiOrbState = "idle" | "thinking" | "listening" | "speaking";
export type AiOrbVariant = "aurora" | "lattice" | "ring";
export type AiOrbSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AiOrbTone = "auto" | "signal" | "emerald" | "amber" | "mono";

export interface AiOrbProps {
  /** 智能体当前状态 */
  state?: AiOrbState;
  /** 视觉形态：流光球体（aurora）、3x3 像素点阵（lattice）或轨道光环（ring） */
  variant?: AiOrbVariant;
  /** 尺寸规格 */
  size?: AiOrbSize;
  /** 色彩基调：auto 随状态自动映射，也可指定固定语义色调 */
  tone?: AiOrbTone;
  /** 是否包裹在触感状态胶囊中 */
  pill?: boolean;
  /** 状态文案（默认按 state 自动匹配） */
  label?: string;
  /** 胶囊模式下的右侧元信息徽标（如模型名或耗时） */
  badge?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}
interface CoreProps {
  state: AiOrbState;
  size: AiOrbSize;
  tone: AiOrbTone;
  reduced: boolean | null;
}

const LatticeOrb = ({ state, size, tone, reduced }: CoreProps) => {
  const speed = state === "thinking" ? 0.85 : state === "speaking" ? 0.6 : 1.45;
  const dotTone = resolveLatticeDotTone(state, tone);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid shrink-0 grid-cols-3 place-items-center border border-solid border-zinc-800/90 bg-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.18)] dark:border-white/14",
        ORB_LATTICE_PADDING[size],
        ORB_SIZE_CLASS[size],
      )}
    >
      {ORB_LATTICE_CELLS.map((idx) => (
        <motion.span
          key={idx}
          animate={
            reduced || state === "idle"
              ? { opacity: idx === 4 ? 0.95 : 0.3, scale: 1 }
              : { opacity: [0.2, 1, 0.2], scale: [0.78, 1.2, 0.78] }
          }
          transition={{
            duration: speed,
            repeat: Number.POSITIVE_INFINITY,
            delay: (idx % 3) * 0.08 + Math.floor(idx / 3) * 0.08,
            ease: "easeInOut",
          }}
          className={cn("rounded-full", dotTone, ORB_LATTICE_DOT_SIZE[size])}
        />
      ))}
    </span>
  );
};

const RingOrb = ({ state, size, tone, reduced }: CoreProps) => {
  const cfg = ORB_AURORA_MOTION[state];
  const mesh = resolveOrbMesh(state, tone);
  const spin = reduced || state === "idle" ? { rotate: 0 } : { rotate: 360 };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full",
        ORB_SIZE_CLASS[size],
      )}
    >
      <motion.span
        animate={spin}
        transition={{ duration: cfg.spin, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{ background: mesh }}
        className="absolute inset-0 rounded-full p-[2px]"
      />
      <span className="relative inline-flex size-[calc(100%-4px)] items-center justify-center rounded-full border border-solid border-white/15 bg-zinc-950/95 shadow-inner dark:bg-zinc-950">
        <motion.span
          animate={
            reduced || state === "idle"
              ? { scale: 1, opacity: 0.65 }
              : { scale: [0.85, 1.2, 0.85], opacity: [0.65, 1, 0.65] }
          }
          transition={{ duration: cfg.beat, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className={cn("size-[32%] rounded-full", resolveLatticeDotTone(state, tone))}
        />
      </span>
    </span>
  );
};

const AuroraOrb = ({ state, size, tone, reduced }: CoreProps) => {
  const cfg = ORB_AURORA_MOTION[state];
  const mesh = resolveOrbMesh(state, tone);
  const spin = reduced || state === "idle" ? { rotate: 0 } : { rotate: 360 };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        ORB_SIZE_CLASS[size],
      )}
    >
      {state !== "idle" && (
        <motion.span
          animate={
            reduced ? { opacity: 0.24 } : { scale: [0.96, 1.14, 0.96], opacity: [0.16, 0.36, 0.16] }
          }
          transition={{ duration: 2.3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{ background: mesh }}
          className="pointer-events-none absolute -inset-1 rounded-full blur-md"
        />
      )}
      <motion.span
        animate={reduced ? { scale: 1 } : { scale: cfg.scale }}
        transition={{ duration: cfg.beat, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="relative inline-flex size-full items-center justify-center overflow-hidden rounded-full border border-solid border-white/55 bg-zinc-950 shadow-sm dark:border-white/20"
      >
        <motion.span
          animate={spin}
          transition={{ duration: cfg.spin, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ background: mesh }}
          className="absolute -inset-2 opacity-95 blur-[2px]"
        />
        <span className="absolute inset-0.5 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.84),rgba(255,255,255,0.14)_42%,transparent_68%)]" />
        <span className="absolute inset-0 rounded-full shadow-[inset_0_-4px_8px_rgba(15,23,42,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.68)]" />
      </motion.span>
    </span>
  );
};

const OrbCore = ({
  variant,
  state,
  size,
  tone,
  reduced,
}: CoreProps & { variant: AiOrbVariant }) => {
  if (variant === "lattice") {
    return <LatticeOrb state={state} size={size} tone={tone} reduced={reduced} />;
  }
  if (variant === "ring") {
    return <RingOrb state={state} size={size} tone={tone} reduced={reduced} />;
  }
  return <AuroraOrb state={state} size={size} tone={tone} reduced={reduced} />;
};

const OrbPillButton = ({
  state,
  variant,
  displayLabel,
  badge,
  onClick,
  className,
  core,
}: {
  state: AiOrbState;
  variant: AiOrbVariant;
  displayLabel: string;
  badge?: string;
  onClick?: () => void;
  className?: string;
  core: React.ReactNode;
}) => (
  <button
    type="button"
    data-slot="ai-orb"
    data-state={state}
    data-variant={variant}
    aria-label={displayLabel}
    onClick={onClick}
    className={cn(
      "inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-solid border-border/85 bg-card/95 py-1.5 pr-3.5 pl-1.5 font-sans text-xs font-medium text-foreground shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-signal/40 hover:shadow-md active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
  >
    {core}
    <span className="tracking-tight">{displayLabel}</span>
    {badge ? (
      <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
        {badge}
      </span>
    ) : (
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", ORB_STATUS_DOT_CLASS[state])}
      />
    )}
  </button>
);

const resolveOrbDefaults = (props: AiOrbProps) => ({
  state: props.state ?? "thinking",
  variant: props.variant ?? "aurora",
  size: props.size ?? "md",
  tone: props.tone ?? "auto",
  pill: props.pill ?? false,
});

export const AiOrb = (props: AiOrbProps) => {
  const cfg = resolveOrbDefaults(props);
  const reduced = useReducedMotion();
  const displayLabel = props.label ?? ORB_STATE_LABEL[cfg.state];
  const core = (
    <OrbCore
      variant={cfg.variant}
      state={cfg.state}
      size={cfg.pill ? "sm" : cfg.size}
      tone={cfg.tone}
      reduced={reduced}
    />
  );

  if (cfg.pill || props.onClick) {
    return (
      <OrbPillButton
        state={cfg.state}
        variant={cfg.variant}
        displayLabel={displayLabel}
        badge={props.badge}
        onClick={props.onClick}
        className={props.className}
        core={core}
      />
    );
  }

  return (
    <output
      aria-label={displayLabel}
      data-slot="ai-orb"
      data-state={cfg.state}
      data-variant={cfg.variant}
      className={cn("inline-flex items-center gap-3", props.className)}
    >
      {core}
      {props.label && (
        <span className="text-xs font-medium tracking-tight text-foreground">{props.label}</span>
      )}
    </output>
  );
};
