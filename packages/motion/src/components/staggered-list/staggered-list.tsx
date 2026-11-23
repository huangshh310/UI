"use client";

/**
 * StaggeredList：克制紧凑的列表错峰入场与弹簧布局动画容器。
 * 支持 fade-up / scale / slide-left 三种编排、可配置错峰间隔与位移距离、
 * 动态筛选增删布局过渡，以及视口滚入显现与减弱动效降级。
 */
import { cn } from "@matt-ui/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { Children, isValidElement, useEffect, useRef, useState, type ReactNode } from "react";
import type { StaggeredListProps } from "./staggered-list.types.js";
import {
  STAGGERED_ITEM_SPRING,
  STAGGERED_LAYOUT_SPRING,
  STAGGERED_VISIBLE_STATE,
  resolveStaggeredHiddenState,
} from "./staggered-list.variants.js";

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
