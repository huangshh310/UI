"use client";

import { cn } from "@matt-ui/utils";
import { MotionConfig, motion } from "motion/react";
import { Children, useEffect, useRef, useState } from "react";
import type { StaggeredListProps } from "./staggered-list.types.js";

export const StaggeredList = ({
  children,
  staggerMs = 45,
  revealOnScroll = false,
  className,
}: StaggeredListProps) => {
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

  const items = Children.toArray(children);

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        data-slot="staggered-list"
        className={cn("flex w-full flex-col gap-2", className)}
      >
        {items.map((child, idx) => (
          <motion.div
            key={idx}
            initial={revealOnScroll ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.26, delay: Math.min(idx * (staggerMs / 1000), 0.36) }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    </MotionConfig>
  );
};
