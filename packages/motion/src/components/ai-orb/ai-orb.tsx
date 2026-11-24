"use client";

/**
 * AiOrb：多模态智能体视觉状态球与触感状态胶囊。
 * 支持流体光学球（aurora）、精密微型 OLED 矩阵（lattice）、双轨声纹光环（ring）与触感胶囊形态（pill）。
 */
import { cn } from "@matt-ui/utils";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { AuroraOrb, LatticeOrb, RingOrb, type OrbCoreProps } from "./ai-orb.parts.js";
import type { AiOrbProps, AiOrbState, AiOrbVariant } from "./ai-orb.types.js";
import { ORB_FOCUS_RING, ORB_STATE_LABEL, ORB_STATUS_DOT_CLASS } from "./ai-orb.variants.js";

const OrbCore = ({
  variant,
  state,
  size,
  tone,
  reduced,
}: OrbCoreProps & { variant: AiOrbVariant }) => {
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
  core: ReactNode;
}) => (
  <button
    type="button"
    data-slot="ai-orb"
    data-state={state}
    data-variant={variant}
    onClick={onClick}
    className={cn(
      "inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-solid border-border/90 bg-card/95 py-1.5 pr-3.5 pl-1.5 font-sans text-xs font-medium text-foreground shadow-[0_2px_8px_-4px_rgba(15,23,42,0.16)] backdrop-blur-sm transition-all hover:border-foreground/20 hover:bg-card active:scale-[0.985] dark:border-white/12 dark:bg-neutral-900/90 dark:hover:border-white/22",
      ORB_FOCUS_RING,
      className,
    )}
  >
    {core}
    <span className="tracking-tight">{displayLabel}</span>
    {badge ? (
      <span className="rounded-full border border-solid border-border/70 bg-muted/75 px-2 py-0.5 font-mono text-[10px] font-medium tracking-tight text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]">
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
