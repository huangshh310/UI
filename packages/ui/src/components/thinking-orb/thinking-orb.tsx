"use client";

/**
 * ThinkingOrb：3D 光学水晶星尘思考球，支持 9 种 AI 认知态平滑形变、精密刻度玻璃表圈、双环氛围光晕与微光状态胶囊。
 */
import { cn } from "@matt-ui/utils";
import { useEffect, useRef } from "react";
import {
  createOrbParticles,
  orbParticleCountForSize,
  type OrbParticle,
} from "./thinking-orb-field.js";
import { useAutoDarkTheme, useOrbCanvasLoop } from "./thinking-orb-runtime.js";
import type {
  ThinkingOrbLabelPlacement,
  ThinkingOrbProps,
  ThinkingOrbState,
  ThinkingOrbVariant,
} from "./thinking-orb.types.js";
import {
  ORB_STATE_ACCENTS,
  THINKING_ORB_STATE_LABELS,
  thinkingOrbFrameVariants,
  thinkingOrbLabelVariants,
  thinkingOrbRootVariants,
} from "./thinking-orb.variants.js";

const DIAL_TICK_ANGLES = Array.from({ length: 36 }, (_, i) => i * 10);

const OrbDialTicks = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 100"
    className="pointer-events-none absolute inset-0 size-full text-foreground/22 dark:text-white/22"
  >
    <circle
      cx="50"
      cy="50"
      r="47.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.45"
      strokeOpacity="0.45"
    />
    {DIAL_TICK_ANGLES.map((deg) => {
      const major = deg % 90 === 0;
      return (
        <line
          key={deg}
          x1="50"
          y1={major ? "2.6" : "3.2"}
          x2="50"
          y2={major ? "6.2" : "5.1"}
          stroke="currentColor"
          strokeWidth={major ? "0.9" : "0.55"}
          strokeLinecap="round"
          strokeOpacity={major ? "0.95" : "0.52"}
          transform={`rotate(${deg} 50 50)`}
        />
      );
    })}
  </svg>
);

const ThinkingOrbDecor = ({
  variant,
  state,
  size,
}: {
  variant: ThinkingOrbVariant;
  state: ThinkingOrbState;
  size: number;
}) => {
  if (variant === "minimal") return null;
  const accent = ORB_STATE_ACCENTS[state] ?? ORB_STATE_ACCENTS.working;
  return (
    <>
      {variant === "halo" && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 rounded-full blur-md transition-colors duration-500"
            style={{
              background: `radial-gradient(circle, ${accent.haloTint} 0%, transparent 70%)`,
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1.5 rounded-full border border-solid border-foreground/[0.07] dark:border-white/[0.09]"
          />
        </>
      )}
      {size >= 44 && <OrbDialTicks />}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] rounded-full bg-gradient-to-b from-white/60 via-transparent to-transparent dark:from-white/[0.09]"
      />
    </>
  );
};

const ThinkingOrbCaption = ({
  label,
  state,
  placement,
  paused,
}: {
  label: string;
  state: ThinkingOrbState;
  placement: ThinkingOrbLabelPlacement;
  paused: boolean;
}) => {
  const accent = ORB_STATE_ACCENTS[state] ?? ORB_STATE_ACCENTS.working;
  return (
    <span data-slot="thinking-orb-label" className={thinkingOrbLabelVariants({ placement })}>
      <span
        data-slot="thinking-orb-indicator"
        aria-hidden="true"
        className="relative flex size-2 shrink-0 items-center justify-center"
      >
        {!paused && (
          <span
            className="absolute inline-flex size-full animate-ping rounded-full opacity-55"
            style={{ backgroundColor: accent.dot }}
          />
        )}
        <span
          className="relative inline-flex size-1.5 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: accent.dot,
            boxShadow: `0 0 8px ${accent.glow}`,
          }}
        />
      </span>
      <span>{label}</span>
    </span>
  );
};

const resolveOrbDefaults = (props: ThinkingOrbProps) => ({
  state: props.state ?? "working",
  variant: props.variant ?? "minimal",
  size: props.size ?? 64,
  speed: props.speed ?? 1,
  paused: props.paused ?? false,
  showLabel: props.showLabel ?? false,
  labelPlacement: props.labelPlacement ?? "bottom",
  interactive: props.interactive ?? false,
});

const resolveFrameSize = (size: number, variant: ThinkingOrbVariant): number => {
  if (variant === "minimal") return size;
  const ratio = variant === "halo" ? 0.18 : 0.14;
  return size + Math.max(variant === "halo" ? 14 : 10, Math.round(size * ratio));
};

interface ThinkingOrbViewProps {
  opts: ReturnType<typeof resolveOrbDefaults>;
  frameClass: string;
  frameSize: number;
  aria: string;
  resolvedLabel: string;
  hasVisibleLabel: boolean;
  className?: string;
  style?: ThinkingOrbProps["style"];
  canvasNode: React.ReactNode;
}

const ThinkingOrbView = (p: ThinkingOrbViewProps) => {
  const frameInner = (
    <>
      <ThinkingOrbDecor variant={p.opts.variant} state={p.opts.state} size={p.opts.size} />
      {p.canvasNode}
    </>
  );

  if (!p.hasVisibleLabel) {
    return (
      <output
        data-slot="thinking-orb"
        data-state={p.opts.state}
        data-variant={p.opts.variant}
        aria-label={p.aria}
        className={cn(p.frameClass, p.className)}
        style={{ width: p.frameSize, height: p.frameSize, ...p.style }}
      >
        {frameInner}
      </output>
    );
  }
  return (
    <output
      data-slot="thinking-orb"
      data-state={p.opts.state}
      data-variant={p.opts.variant}
      aria-label={p.aria}
      className={cn(
        thinkingOrbRootVariants({ hasLabel: true, placement: p.opts.labelPlacement }),
        p.className,
      )}
      style={p.style}
    >
      <span
        data-slot="thinking-orb-frame"
        className={p.frameClass}
        style={{ width: p.frameSize, height: p.frameSize }}
      >
        {frameInner}
      </span>
      <ThinkingOrbCaption
        label={p.resolvedLabel}
        state={p.opts.state}
        placement={p.opts.labelPlacement}
        paused={p.opts.paused}
      />
    </output>
  );
};

export const ThinkingOrb = (props: ThinkingOrbProps) => {
  const opts = resolveOrbDefaults(props);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<OrbParticle[]>(
    createOrbParticles(orbParticleCountForSize(opts.size)),
  );
  const isDark = useAutoDarkTheme(props.dark);

  useEffect(() => {
    particlesRef.current = createOrbParticles(orbParticleCountForSize(opts.size));
  }, [opts.size]);

  useOrbCanvasLoop(canvasRef, particlesRef, {
    state: opts.state,
    size: opts.size,
    speed: opts.speed,
    isDark,
    paused: opts.paused,
  });

  const resolvedLabel = props.label ?? THINKING_ORB_STATE_LABELS[opts.state];
  const frameSize = resolveFrameSize(opts.size, opts.variant);
  return (
    <ThinkingOrbView
      opts={opts}
      frameClass={thinkingOrbFrameVariants({
        variant: opts.variant,
        interactive: opts.interactive,
      })}
      frameSize={frameSize}
      aria={props["aria-label"] ?? `智能体状态球：${resolvedLabel}`}
      resolvedLabel={resolvedLabel}
      hasVisibleLabel={Boolean(props.label) || opts.showLabel}
      className={props.className}
      style={props.style}
      canvasNode={
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="relative block"
          style={{ width: opts.size, height: opts.size }}
        />
      }
    />
  );
};
