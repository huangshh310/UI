/**
 * Shimmer 的类型定义：流式生成等待态的微光扫掠文字与段落骨架。
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ShimmerAs = "span" | "p" | "div";
export type ShimmerSpeed = "slow" | "normal" | "fast";

export interface ShimmerProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** 渲染的语义标签，默认 span */
  as?: ShimmerAs;
  /** 微光脉冲节奏，默认 normal */
  speed?: ShimmerSpeed;
  /** 是否处于激活扫掠态，false 时退化为普通静态文字 */
  active?: boolean;
  children: ReactNode;
}

export interface ShimmerLinesProps extends ComponentPropsWithoutRef<"output"> {
  /** 骨架行数，默认 3 */
  lines?: number;
  /** 屏幕阅读器播报的状态文案，默认「正在生成回复…」 */
  label?: string;
}
