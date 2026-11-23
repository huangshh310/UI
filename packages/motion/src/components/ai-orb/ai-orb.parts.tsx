"use client";

/**
 * AiOrb 内部视觉核心：流体光学球（AuroraOrb）、微型 OLED 矩阵（LatticeOrb）与双轨声纹光环（RingOrb）。
 */
import { cn } from "@matt-ui/utils";
import { motion } from "motion/react";
import { useId } from "react";
import type { AiOrbSize, AiOrbState, AiOrbTone } from "./ai-orb.types.js";
import {
  ORB_AURORA_MOTION,
  ORB_LATTICE_CELLS,
  ORB_LATTICE_DOT_SIZE,
  ORB_LATTICE_PADDING,
  ORB_SIZE_CLASS,
  resolveAuroraPalette,
  resolveLatticePalette,
  resolveRingPalette,
  type AuroraPalette,
  type LatticePalette,
  type RingPalette,
} from "./ai-orb.variants.js";

export interface OrbCoreProps {
  state: AiOrbState;
  size: AiOrbSize;
  tone: AiOrbTone;
  reduced: boolean | null;
}

const LATTICE_SPEED: Record<AiOrbState, number> = {
  idle: 2.4,
  thinking: 1.15,
  listening: 1.5,
  speaking: 0.85,
};

const LATTICE_STATIC_OPACITY = [0.96, 0.48, 0.2] as const;
const LATTICE_PULSE_OPACITY = [
  [0.58, 1, 0.58],
  [0.24, 0.86, 0.24],
  [0.12, 0.56, 0.12],
] as const;

const latticeTier = (idx: number): 0 | 1 | 2 => {
  if (idx === 4) return 0;
  return idx % 2 === 1 ? 1 : 2;
};

const latticeDelay = (state: AiOrbState, idx: number): number => {
  const row = Math.floor(idx / 3);
  const col = idx % 3;
  if (state === "listening") return latticeTier(idx) * 0.22;
  if (state === "speaking") return Math.abs(col - 1) * 0.16 + row * 0.08;
  return (row + col) * 0.12;
};

const latticeGlow = (tier: 0 | 1 | 2, palette: LatticePalette): string => {
  if (tier === 0) return palette.centerGlow;
  return tier === 1 ? palette.edgeGlow : palette.cornerGlow;
};

export const LatticeOrb = ({ state, size, tone, reduced }: OrbCoreProps) => {
  const palette = resolveLatticePalette(state, tone);
  const active = !reduced && state !== "idle";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid shrink-0 grid-cols-3 place-items-center overflow-hidden rounded-[26%] border border-solid border-neutral-800/90 bg-neutral-950 ring-1 ring-inset ring-white/15 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),0_4px_12px_-4px_rgba(0,0,0,0.2)] dark:border-white/15",
        ORB_LATTICE_PADDING[size],
        ORB_SIZE_CLASS[size],
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,transparent_44%)]" />
      {ORB_LATTICE_CELLS.map((idx) => {
        const tier = latticeTier(idx);
        return (
          <motion.span
            key={idx}
            animate={
              active
                ? { opacity: [...LATTICE_PULSE_OPACITY[tier]], scale: [0.88, 1.1, 0.88] }
                : { opacity: LATTICE_STATIC_OPACITY[tier], scale: 1 }
            }
            transition={{
              duration: LATTICE_SPEED[state],
              repeat: Number.POSITIVE_INFINITY,
              delay: latticeDelay(state, idx),
              ease: "easeInOut",
            }}
            style={{ boxShadow: latticeGlow(tier, palette) }}
            className={cn("relative rounded-full", palette.dotClass, ORB_LATTICE_DOT_SIZE[size])}
          />
        );
      })}
    </span>
  );
};

const RingDialBase = () => (
  <svg viewBox="0 0 48 48" fill="none" className="absolute inset-0 size-full">
    <circle
      cx="24"
      cy="24"
      r="20.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeDasharray="1.2 4.167"
      className="text-foreground/22 dark:text-white/22"
    />
    <circle
      cx="24"
      cy="24"
      r="14.2"
      stroke="currentColor"
      strokeWidth="0.85"
      className="text-foreground/12 dark:text-white/12"
    />
    <path
      d="M24 1.8V4.2M24 43.8V46.2M1.8 24H4.2M43.8 24H46.2"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className="text-foreground/28 dark:text-white/28"
    />
  </svg>
);

interface RingArcProps {
  uid: string;
  palette: RingPalette;
  spin: number;
  active: boolean;
}

const RingOuterArc = ({ uid, palette, spin, active }: RingArcProps) => (
  <motion.svg
    viewBox="0 0 48 48"
    fill="none"
    animate={active ? { rotate: 360 } : { rotate: -30 }}
    transition={{ duration: spin, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    className="absolute inset-0 size-full"
  >
    <defs>
      <linearGradient id={`${uid}-outer`} x1="95%" y1="45%" x2="36%" y2="100%">
        <stop offset="0%" stopColor={palette.tail} stopOpacity="0" />
        <stop offset="55%" stopColor={palette.tail} stopOpacity="0.88" />
        <stop offset="100%" stopColor={palette.head} stopOpacity="1" />
      </linearGradient>
    </defs>
    <circle
      cx="24"
      cy="24"
      r="20.5"
      stroke={`url(#${uid}-outer)`}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeDasharray="36 93"
    />
    <circle cx="20.2" cy="44.15" r="1.75" fill={palette.head} />
  </motion.svg>
);

const RingInnerArc = ({ uid, palette, spin, active }: RingArcProps) => (
  <motion.svg
    viewBox="0 0 48 48"
    fill="none"
    animate={active ? { rotate: -360 } : { rotate: 24 }}
    transition={{ duration: spin * 1.65, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    className="absolute inset-0 size-full"
  >
    <defs>
      <linearGradient id={`${uid}-inner`} x1="100%" y1="50%" x2="40%" y2="95%">
        <stop offset="0%" stopColor={palette.inner} stopOpacity="0" />
        <stop offset="100%" stopColor={palette.inner} stopOpacity="0.85" />
      </linearGradient>
    </defs>
    <circle
      cx="24"
      cy="24"
      r="14.2"
      stroke={`url(#${uid}-inner)`}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeDasharray="24 66"
    />
  </motion.svg>
);

export const RingOrb = ({ state, size, tone, reduced }: OrbCoreProps) => {
  const uid = useId();
  const cfg = ORB_AURORA_MOTION[state];
  const palette = resolveRingPalette(state, tone);
  const active = !reduced && state !== "idle";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-muted/55 ring-1 ring-inset ring-black/6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] dark:bg-white/[0.04] dark:ring-white/10",
        ORB_SIZE_CLASS[size],
      )}
    >
      <RingDialBase />
      <RingOuterArc uid={uid} palette={palette} spin={cfg.spin} active={active} />
      <RingInnerArc uid={uid} palette={palette} spin={cfg.spin} active={active} />
      <motion.span
        animate={
          active
            ? { scale: [0.92, 1.12, 0.92], opacity: [0.82, 1, 0.82] }
            : { scale: 1, opacity: 0.9 }
        }
        transition={{ duration: cfg.beat, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ background: palette.core, boxShadow: palette.coreShadow }}
        className="relative size-[27%] rounded-full ring-1 ring-inset ring-white/45"
      />
    </span>
  );
};

const CLOUD_A_ACTIVE = {
  x: ["-14%", "16%", "-14%"],
  y: ["-10%", "14%", "-10%"],
  rotate: [0, 360],
  scale: [1, 1.15, 1],
};
const CLOUD_A_IDLE = { x: "-10%", y: "8%", rotate: 0, scale: 1.04 };
const CLOUD_B_ACTIVE = {
  x: ["16%", "-15%", "16%"],
  y: ["14%", "-14%", "14%"],
  rotate: [360, 0],
  scale: [1.08, 0.94, 1.08],
};
const CLOUD_B_IDLE = { x: "12%", y: "-10%", rotate: 0, scale: 1.02 };
const CLOUD_C_ACTIVE = {
  x: ["-10%", "12%", "-10%"],
  y: ["-12%", "10%", "-12%"],
  scale: [0.96, 1.1, 0.96],
};
const CLOUD_C_IDLE = { x: "-12%", y: "-14%", scale: 1 };

const AuroraClouds = ({
  palette,
  drift,
  active,
}: {
  palette: AuroraPalette;
  drift: number;
  active: boolean;
}) => (
  <>
    <motion.span
      animate={active ? CLOUD_A_ACTIVE : CLOUD_A_IDLE}
      transition={{ duration: drift * 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: palette.cloudA }}
      className="pointer-events-none absolute -inset-[30%] rounded-full blur-[7px]"
    />
    <motion.span
      animate={active ? CLOUD_B_ACTIVE : CLOUD_B_IDLE}
      transition={{ duration: drift * 1.15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: palette.cloudB }}
      className="pointer-events-none absolute -inset-[28%] rounded-full blur-[6px] mix-blend-screen"
    />
    <motion.span
      animate={active ? CLOUD_C_ACTIVE : CLOUD_C_IDLE}
      transition={{ duration: drift * 0.95, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: palette.cloudC }}
      className="pointer-events-none absolute -inset-[20%] rounded-full opacity-85 blur-[5px]"
    />
  </>
);

export const AuroraOrb = ({ state, size, tone, reduced }: OrbCoreProps) => {
  const cfg = ORB_AURORA_MOTION[state];
  const palette = resolveAuroraPalette(state, tone);
  const active = !reduced && state !== "idle";
  const compact = size === "xs" || size === "sm";

  return (
    <motion.span
      aria-hidden="true"
      animate={reduced ? { scale: 1 } : { scale: cfg.scale }}
      transition={{ duration: cfg.beat, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      style={{ background: palette.base, boxShadow: compact ? palette.shadowSm : palette.shadow }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        ORB_SIZE_CLASS[size],
      )}
    >
      <AuroraClouds palette={palette} drift={cfg.drift} active={active} />
      <span
        style={{ background: palette.bounce }}
        className="pointer-events-none absolute inset-0 rounded-full"
      />
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_66%_40%_at_34%_18%,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.2)_46%,transparent_72%)]" />
      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_-6px_14px_rgba(0,0,0,0.34),inset_0_2px_5px_rgba(255,255,255,0.42)] ring-1 ring-inset ring-white/40" />
    </motion.span>
  );
};
