"use client";

/**
 * SpotlightCard：零动画库依赖的纯 CSS 指针径向高光与 1px 镜面微光边框卡片。
 * 通过局部 CSS 变量 --spot-x / --spot-y 驱动高光跟随，并保持 children 直接挂载于根节点。
 */
import { cn } from "@matt-ui/utils";
import type { CSSProperties, PointerEvent } from "react";
import type {
  SpotlightCardProps,
  SpotlightCardVariant,
  SpotlightTone,
} from "./spotlight-card.types.js";
import {
  SPOTLIGHT_BORDER_MASK_STYLE,
  resolveSpotlightColors,
  spotlightCardVariants,
} from "./spotlight-card.variants.js";

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
