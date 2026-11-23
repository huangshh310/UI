import type { HTMLAttributes } from "react";

export type SkeletonVariant = "pulse" | "shimmer";
export type SkeletonShape = "line" | "text" | "circle" | "card" | "rounded";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** 动画形态 */
  variant?: SkeletonVariant;
  /** 预设几何形态 */
  shape?: SkeletonShape;
}
