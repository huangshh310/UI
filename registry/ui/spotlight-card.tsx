// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SpotlightCard：零动画库依赖的纯 CSS 指针径向高光与 1px 镜面微光边框卡片。
 * 通过局部 CSS 变量 --spot-x / --spot-y 驱动高光跟随，并保持 children 直接挂载于根节点。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type CSSProperties, type HTMLAttributes, type PointerEvent } from "react";

export const spotlightCardVariants = cva(
  "group relative overflow-hidden rounded-[22px] border border-solid transition-[border-color,box-shadow] duration-(--ui-duration-normal) [&>*:not([data-slot=spotlight-glow]):not([data-slot=spotlight-border])]:relative [&>*:not([data-slot=spotlight-glow]):not([data-slot=spotlight-border])]:z-10",
  {
    variants: {
      variant: {
        default: "border-border/90 bg-card text-card-foreground shadow-xs dark:border-border/80",
        elevated:
          "border-border/80 bg-card text-card-foreground shadow-md dark:border-foreground/[0.09] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_28px_-10px_rgba(0,0,0,0.48)]",
        glass:
          "border-border/70 bg-card/72 text-card-foreground shadow-sm backdrop-blur-xl backdrop-saturate-150 dark:border-foreground/12 dark:bg-card/65",
        dark: "border-white/12 bg-neutral-950 text-neutral-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_-12px_rgba(0,0,0,0.52)]",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      glowBorder: {
        true: "hover:border-foreground/22",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "dark",
        glowBorder: true,
        className: "hover:border-white/24",
      },
    ],
    defaultVariants: {
      variant: "default",
      padding: "md",
      glowBorder: true,
    },
  },
);

export const SPOTLIGHT_SURFACE_COLORS: Record<SpotlightTone, string> = {
  neutral: "color-mix(in srgb, var(--ui-foreground) 7%, transparent)",
  signal: "color-mix(in srgb, var(--ui-signal) 13%, transparent)",
  emerald: "rgba(16, 185, 129, 0.13)",
  violet: "rgba(139, 92, 246, 0.14)",
};

export const SPOTLIGHT_DARK_SURFACE_COLORS: Record<SpotlightTone, string> = {
  neutral: "rgba(255, 255, 255, 0.11)",
  signal: "rgba(59, 130, 246, 0.22)",
  emerald: "rgba(16, 185, 129, 0.2)",
  violet: "rgba(167, 139, 250, 0.22)",
};

export const SPOTLIGHT_BORDER_COLORS: Record<SpotlightTone, string> = {
  neutral: "color-mix(in srgb, var(--ui-foreground) 32%, transparent)",
  signal: "color-mix(in srgb, var(--ui-signal) 55%, transparent)",
  emerald: "rgba(16, 185, 129, 0.52)",
  violet: "rgba(139, 92, 246, 0.55)",
};

export const SPOTLIGHT_DARK_BORDER_COLORS: Record<SpotlightTone, string> = {
  neutral: "rgba(255, 255, 255, 0.36)",
  signal: "rgba(96, 165, 250, 0.62)",
  emerald: "rgba(52, 211, 153, 0.58)",
  violet: "rgba(196, 181, 253, 0.6)",
};

export const resolveSpotlightColors = (tone: SpotlightTone, variant: SpotlightCardVariant) => ({
  surface:
    variant === "dark" ? SPOTLIGHT_DARK_SURFACE_COLORS[tone] : SPOTLIGHT_SURFACE_COLORS[tone],
  border: variant === "dark" ? SPOTLIGHT_DARK_BORDER_COLORS[tone] : SPOTLIGHT_BORDER_COLORS[tone],
});

export const SPOTLIGHT_BORDER_MASK_STYLE: CSSProperties = {
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
};
/** 径向高光与微光边框色调 */
export type SpotlightTone = "signal" | "neutral" | "emerald" | "violet";

/** 卡片材质与层级变体 */
export type SpotlightCardVariant = "default" | "elevated" | "glass" | "dark";

/** 卡片内边距档位 */
export type SpotlightCardPadding = "none" | "sm" | "md" | "lg";

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 卡片表面材质：默认发丝边框 / 抬升阴影 / 磨砂玻璃 / 深邃黑曜石 */
  variant?: SpotlightCardVariant;
  /** 高光色调：中性光晕 / 钴蓝信号 / 翡翠绿 / 紫罗兰 */
  tone?: SpotlightTone;
  /** 内边距档位，默认 md */
  padding?: SpotlightCardPadding;
  /** 是否启用指针跟随 1px 镜面微光边框，默认 true */
  glowBorder?: boolean;
  /** 径向高光扩散半径（px），默认 260 */
  spotlightSize?: number;
}
const SPOTLIGHT_CARD_DEFAULTS = {
  variant: "default" as SpotlightCardVariant,
  tone: "neutral" as SpotlightTone,
  padding: "md" as const,
  glowBorder: true,
  spotlightSize: 260,
};

const SpotlightOverlays = ({
  tone,
  variant,
  glowBorder,
  spotlightSize,
}: {
  tone: SpotlightTone;
  variant: SpotlightCardVariant;
  glowBorder: boolean;
  spotlightSize: number;
}) => {
  const colors = resolveSpotlightColors(tone, variant);
  const borderSize = Math.max(140, Math.round(spotlightSize * 0.72));

  return (
    <>
      <div
        data-slot="spotlight-glow"
        aria-hidden="true"
        style={{
          background: `radial-gradient(${spotlightSize}px circle at var(--spot-x) var(--spot-y), ${colors.surface}, transparent 72%)`,
        }}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-(--ui-duration-normal) group-hover:opacity-100 motion-reduce:hidden"
      />
      {glowBorder && (
        <div
          data-slot="spotlight-border"
          aria-hidden="true"
          style={{
            ...SPOTLIGHT_BORDER_MASK_STYLE,
            background: `radial-gradient(${borderSize}px circle at var(--spot-x) var(--spot-y), ${colors.border}, transparent 70%)`,
          }}
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-(--ui-duration-normal) group-hover:opacity-100 motion-reduce:hidden"
        />
      )}
    </>
  );
};

export const SpotlightCard = (inputProps: SpotlightCardProps) => {
  const {
    variant,
    tone,
    padding,
    glowBorder,
    spotlightSize,
    children,
    className,
    onPointerMove,
    style,
    ...props
  } = { ...SPOTLIGHT_CARD_DEFAULTS, ...inputProps };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${Math.round(event.clientX - rect.left)}px`);
    event.currentTarget.style.setProperty("--spot-y", `${Math.round(event.clientY - rect.top)}px`);
    onPointerMove?.(event);
  };

  return (
    <div
      data-slot="spotlight-card"
      data-variant={variant}
      data-tone={tone}
      data-padding={padding}
      onPointerMove={handlePointerMove}
      style={{ "--spot-x": "50%", "--spot-y": "0%", ...style } as CSSProperties}
      className={cn(spotlightCardVariants({ variant, padding, glowBorder }), className)}
      {...props}
    >
      <SpotlightOverlays
        tone={tone}
        variant={variant}
        glowBorder={glowBorder}
        spotlightSize={spotlightSize}
      />
      {children}
    </div>
  );
};
