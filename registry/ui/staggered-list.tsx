// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { MotionConfig, motion } from "motion/react";
import { Children, type ReactNode, useEffect, useRef, useState } from "react";

export interface StaggeredListProps {
  /** 要错峰显现的子元素列表 */
  children: ReactNode;
  /** 相邻条目错峰间隔（毫秒） */
  staggerMs?: number;
  /** 是否在滚入视口时触发显现 */
  revealOnScroll?: boolean;
  /** 自定义列表容器类名 */
  className?: string;
}
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
