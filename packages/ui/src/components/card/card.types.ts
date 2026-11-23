import type { HTMLAttributes } from "react";

export type CardVariant = "default" | "elevated" | "interactive" | "glass" | "subtle";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 视觉层级变体 */
  variant?: CardVariant;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** 是否使用浅灰底托盘样式并带顶部发丝分隔线 */
  muted?: boolean;
}
