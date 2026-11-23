// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * StaggeredList：克制紧凑的列表错峰入场与弹簧布局动画容器。
 * 支持 fade-up / scale / slide-left 三种编排、可配置错峰间隔与位移距离、
 * 动态筛选增删布局过渡，以及视口滚入显现与减弱动效降级。
 */

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import { Children, isValidElement, type ReactNode, useEffect, useRef, useState } from "react";

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
/** 列表项入场与退场动效风格 */
export type StaggeredListVariant = "fade-up" | "scale" | "slide-left";

export interface StaggeredListProps {
  /** 要错峰显现与布局过渡的子元素列表 */
  children: ReactNode;
  /** 动效编排风格：上浮淡入 / 缩放聚焦 / 左侧滑入，默认 fade-up */
  variant?: StaggeredListVariant;
  /** 相邻条目错峰间隔（毫秒），默认 45 */
  staggerMs?: number;
  /** 入场位移距离（像素，适用于 fade-up 与 slide-left），默认 12 */
  distance?: number;
  /** 错峰延迟总上限（毫秒），默认 360 */
  maxDelayMs?: number;
  /** 是否启用条目增删或筛选时的弹簧布局过渡，默认 true */
  layout?: boolean;
  /** 是否在滚入视口时触发显现，默认 false */
  revealOnScroll?: boolean;
  /** 非滚入模式下是否在首次挂载时立即执行入场动画，默认 false */
  animateOnMount?: boolean;
  /** 自定义列表容器类名 */
  className?: string;
}
const STAGGERED_LIST_DEFAULTS = {
  variant: "fade-up" as const,
  staggerMs: 45,
  distance: 12,
  maxDelayMs: 360,
  layout: true,
  revealOnScroll: false,
  animateOnMount: false,
};

const useScrollReveal = (revealOnScroll: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!revealOnScroll);

  useEffect(() => {
    if (!revealOnScroll || !ref.current || typeof IntersectionObserver === "undefined") {
      return;
    }
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [revealOnScroll]);

  return { ref, visible };
};

const getChildKey = (child: ReactNode, idx: number): string =>
  isValidElement(child) && child.key !== null ? String(child.key) : `item-${idx}`;

interface StaggeredRowProps {
  child: ReactNode;
  delay: number;
  layout: boolean;
  visible: boolean;
  reduced: boolean;
  hiddenState: Record<string, number>;
}

const StaggeredRow = ({
  child,
  delay,
  layout,
  visible,
  reduced,
  hiddenState,
}: StaggeredRowProps) => (
  <motion.div
    layout={layout && !reduced ? "position" : false}
    initial={hiddenState}
    animate={visible || reduced ? STAGGERED_VISIBLE_STATE : hiddenState}
    exit={reduced ? { opacity: 0 } : hiddenState}
    transition={
      reduced
        ? { duration: 0 }
        : { ...STAGGERED_ITEM_SPRING, delay, layout: STAGGERED_LAYOUT_SPRING }
    }
  >
    {child}
  </motion.div>
);

export const StaggeredList = (inputProps: StaggeredListProps) => {
  const p = { ...STAGGERED_LIST_DEFAULTS, ...inputProps };
  const reduced = Boolean(useReducedMotion());
  const { ref, visible } = useScrollReveal(p.revealOnScroll);
  const items = Children.toArray(p.children);
  const hiddenState = resolveStaggeredHiddenState(p.variant, p.distance, reduced);
  const shouldAnimateInitial = (p.revealOnScroll || p.animateOnMount) && !reduced;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        data-slot="staggered-list"
        data-variant={p.variant}
        data-layout={p.layout ? "true" : "false"}
        className={cn("flex w-full flex-col gap-2", p.className)}
      >
        <AnimatePresence mode="popLayout" initial={shouldAnimateInitial}>
          {items.map((child, idx) => (
            <StaggeredRow
              key={getChildKey(child, idx)}
              child={child}
              delay={reduced ? 0 : Math.min((idx * p.staggerMs) / 1000, p.maxDelayMs / 1000)}
              layout={p.layout}
              visible={visible}
              reduced={reduced}
              hiddenState={hiddenState}
            />
          ))}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};
