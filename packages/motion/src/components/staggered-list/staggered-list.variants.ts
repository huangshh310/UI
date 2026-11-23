/**
 * StaggeredList 的动效变体映射与弹簧配置（不依赖 class-variance-authority）。
 */
import type { Transition } from "motion/react";
import type { StaggeredListVariant } from "./staggered-list.types.js";

export const STAGGERED_ITEM_SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 0.72,
};

export const STAGGERED_LAYOUT_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.75,
};

export const STAGGERED_VISIBLE_STATE = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
};

export const resolveStaggeredHiddenState = (
  variant: StaggeredListVariant,
  distance: number,
  reduced: boolean,
): Record<string, number> => {
  if (reduced) return STAGGERED_VISIBLE_STATE;
  if (variant === "scale") {
    return { opacity: 0, scale: 0.94, y: Math.round(distance * 0.4) };
  }
  if (variant === "slide-left") {
    return { opacity: 0, x: distance };
  }
  return { opacity: 0, y: distance };
};
