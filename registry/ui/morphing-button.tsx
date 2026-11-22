// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * MorphingButton：在「待操作、处理中、成功、失败」四个阶段之间变形的按钮。
 *
 * 宽度随文字平滑过渡，新旧内容交叉淡入淡出，页面布局不会跳动。
 * 可访问名称始终是当前阶段的文字；阶段变化时通过一个对视觉隐藏的播报区告知屏幕阅读器。
 * 处理中不响应点击，防止同一操作被重复提交。
 */

import { cn } from "@/lib/utils";
import { Check, LoaderCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ComponentProps, type MouseEvent } from "react";

/** 按钮所处的阶段 */
export type MorphingButtonStatus = "idle" | "loading" | "success" | "error";

/** 动画库会接管这些事件属性，不能透传给 motion.button */
type MotionOwnedProps = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "children";

export interface MorphingButtonProps extends Omit<ComponentProps<"button">, MotionOwnedProps> {
  /** 当前阶段，由调用方控制 */
  status: MorphingButtonStatus;
  /** 各阶段显示的文字，未提供的沿用默认值 */
  labels?: Partial<Record<MorphingButtonStatus, string>>;
}
const DEFAULT_LABELS: Record<MorphingButtonStatus, string> = {
  idle: "Save changes",
  loading: "Saving…",
  success: "Saved",
  error: "Failed",
};

const ICONS: Partial<Record<MorphingButtonStatus, typeof Check>> = {
  loading: LoaderCircle,
  success: Check,
  error: X,
};

const TONES: Record<MorphingButtonStatus, string> = {
  idle: "bg-primary text-primary-foreground",
  loading: "bg-primary text-primary-foreground",
  success: "bg-signal text-signal-foreground",
  error: "bg-destructive text-destructive-foreground",
};

const BUTTON_CLASSES = cn(
  "m-0 box-border inline-flex h-11 cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-full border-0 px-6",
  "font-sans text-sm font-medium whitespace-nowrap select-none transition-colors duration-(--ui-duration-normal)",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:opacity-50 data-[status=loading]:cursor-progress",
);

interface MorphingLabelProps {
  status: MorphingButtonStatus;
  label: string;
  reduceMotion: boolean;
}

/** 按钮里随阶段切换的图标与文字：新内容自下而上淡入，旧内容向上淡出 */
const MorphingLabel = ({ status, label, reduceMotion }: MorphingLabelProps) => {
  const Icon = ICONS[status];
  const offset = reduceMotion ? 0 : 10;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={status}
        aria-hidden="true"
        className="inline-flex items-center gap-2"
        initial={{ opacity: 0, y: offset }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -offset }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
      >
        {Icon && (
          <Icon
            className={cn(
              "size-4",
              status === "loading" && "animate-spin motion-reduce:animate-none",
            )}
          />
        )}
        {label}
      </motion.span>
    </AnimatePresence>
  );
};

export const MorphingButton = ({
  status,
  labels,
  className,
  type = "button",
  onClick,
  ...props
}: MorphingButtonProps) => {
  const reduceMotion = Boolean(useReducedMotion());
  const label = labels?.[status] ?? DEFAULT_LABELS[status];
  const loading = status === "loading";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!loading) onClick?.(event);
  };

  return (
    <>
      <motion.button
        layout={!reduceMotion}
        type={type}
        aria-label={label}
        aria-busy={loading || undefined}
        data-slot="morphing-button"
        data-status={status}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className={cn(BUTTON_CLASSES, TONES[status], className)}
        onClick={handleClick}
        {...props}
      >
        <MorphingLabel status={status} label={label} reduceMotion={reduceMotion} />
      </motion.button>
      <span aria-live="polite" className="sr-only">
        {status === "idle" ? "" : label}
      </span>
    </>
  );
};
