// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SpotlightCard：纯 CSS 径向高光卡片，通过局部指针坐标 CSS 变量实现，零动画库依赖。
 */

import { cn } from "@/lib/utils";
import { type CSSProperties, type HTMLAttributes, type PointerEvent } from "react";

export type SpotlightTone = "signal" | "neutral";

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 高光色调：钴蓝信号色或中性光晕 */
  tone?: SpotlightTone;
  /** 是否同时启用悬停微光边框 */
  glowBorder?: boolean;
}
export const SpotlightCard = ({
  tone = "signal",
  glowBorder = true,
  children,
  className,
  onPointerMove,
  style,
  ...props
}: SpotlightCardProps) => {
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${Math.round(event.clientX - rect.left)}px`);
    event.currentTarget.style.setProperty("--spot-y", `${Math.round(event.clientY - rect.top)}px`);
    onPointerMove?.(event);
  };

  const spotColor =
    tone === "signal"
      ? "color-mix(in oklch, var(--ui-signal) 15%, transparent)"
      : "color-mix(in oklch, var(--ui-foreground) 9%, transparent)";

  return (
    <div
      data-slot="spotlight-card"
      data-tone={tone}
      onPointerMove={handlePointerMove}
      style={{ "--spot-x": "50%", "--spot-y": "0%", ...style } as CSSProperties}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-solid border-border bg-card p-6 text-card-foreground shadow-sm [&>*:not([data-slot=spotlight-glow])]:relative [&>*:not([data-slot=spotlight-glow])]:z-10",
        glowBorder && "transition-colors duration-(--ui-duration-normal) hover:border-signal/35",
        className,
      )}
      {...props}
    >
      <div
        data-slot="spotlight-glow"
        aria-hidden="true"
        style={{
          background: `radial-gradient(240px circle at var(--spot-x) var(--spot-y), ${spotColor}, transparent 72%)`,
        }}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-(--ui-duration-normal) group-hover:opacity-100 motion-reduce:hidden"
      />
      {children}
    </div>
  );
};
