/**
 * Shimmer 的类型定义：流式生成等待态的微光扫掠文字与段落骨架。
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ShimmerAs = "span" | "p" | "div";
export type ShimmerSpeed = "slow" | "normal" | "fast";
export type ShimmerSize = "xs" | "sm" | "md";
export type ShimmerTone = "muted" | "foreground" | "signal";
export type ShimmerVariant = "default" | "pill";

export type ShimmerLinesSize = "sm" | "md" | "lg";
export type ShimmerLinesVariant = "default" | "card";
export type ShimmerLinesTone = "muted" | "subtle";

export interface ShimmerProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** 渲染的语义标签，默认 span */
  as?: ShimmerAs;
  /** 微光脉冲节奏，默认 normal */
  speed?: ShimmerSpeed;
  /** 字号尺寸，默认 xs */
  size?: ShimmerSize;
  /** 文本语义色调，默认 muted */
  tone?: ShimmerTone;
  /** 展示形态：default 内联文案、pill 发丝边框胶囊，默认 default */
  variant?: ShimmerVariant;
  /** 是否处于激活扫掠态，false 时退化为普通静态文字 */
  active?: boolean;
  children: ReactNode;
}

export interface ShimmerLinesProps extends ComponentPropsWithoutRef<"output"> {
  /** 骨架行数（1–8），默认 3 */
  lines?: number;
  /** 行高与间距密度，默认 md */
  size?: ShimmerLinesSize;
  /** 外观容器：default 无框、card 发丝圆角容器，默认 default */
  variant?: ShimmerLinesVariant;
  /** 骨架条色彩明暗层次，默认 muted */
  tone?: ShimmerLinesTone;
  /** 屏幕阅读器播报的状态文案，默认「正在生成回复…」 */
  label?: string;
}
