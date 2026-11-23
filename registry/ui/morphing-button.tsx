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
import { type ComponentProps, type MouseEvent, type ReactNode } from "react";

/** 按钮所处的阶段 */
export type MorphingButtonStatus = "idle" | "loading" | "success" | "error";

/** 待操作与处理中阶段的视觉变体 */
export type MorphingButtonVariant = "primary" | "signal" | "outline";

/** 成功阶段的语义色调 */
export type MorphingButtonSuccessTone = "signal" | "emerald";

/** 按钮尺寸 */
export type MorphingButtonSize = "sm" | "md" | "lg";

/** 圆角风格 */
export type MorphingButtonRadius = "pill" | "default";

/** 动画库会接管这些事件属性，不能透传给 motion.button */
type MotionOwnedProps = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "children";

export interface MorphingButtonProps extends Omit<ComponentProps<"button">, MotionOwnedProps> {
  /** 当前阶段，由调用方控制 */
  status: MorphingButtonStatus;
  /** 各阶段显示的文字，未提供的沿用默认值 */
  labels?: Partial<Record<MorphingButtonStatus, string>>;
  /** 待操作与处理中阶段的视觉变体，默认 primary */
  variant?: MorphingButtonVariant;
  /** 成功阶段色调，默认 signal */
  successTone?: MorphingButtonSuccessTone;
  /** 按钮尺寸，默认 md */
  size?: MorphingButtonSize;
  /** 圆角风格，默认 pill */
  radius?: MorphingButtonRadius;
  /** 待操作阶段可选的前置图标 */
  idleIcon?: ReactNode;
}
const MORPHING_BASE_CLASSES =
  "m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center overflow-hidden border border-solid font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-normal) ease-out active:scale-[0.98] motion-reduce:active:scale-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 data-[status=loading]:cursor-progress [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const IDLE_VARIANT_CLASSES: Record<MorphingButtonVariant, string> = {
  primary:
    "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-primary/92 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_3px_rgba(0,0,0,0.3)]",
  signal:
    "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_-2px_color-mix(in_oklab,var(--ui-signal)_40%,transparent)] hover:bg-signal/92",
  outline:
    "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
};

const SUCCESS_TONE_CLASSES: Record<MorphingButtonSuccessTone, string> = {
  signal:
    "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_-2px_color-mix(in_oklab,var(--ui-signal)_40%,transparent)]",
  emerald:
    "border-transparent bg-emerald-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_10px_-2px_rgba(4,120,87,0.36)] dark:bg-emerald-500 dark:text-neutral-950",
};

const ERROR_CLASSES =
  "border-transparent bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.08)]";

const MORPHING_SIZE_CLASSES: Record<MorphingButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

const MORPHING_RADIUS_CLASSES: Record<MorphingButtonRadius, string> = {
  pill: "rounded-full",
  default: "rounded-xl",
};

/** 根据当前阶段与主题变体解析表面色调 */
const resolveMorphingTone = (
  status: MorphingButtonStatus,
  variant: MorphingButtonVariant,
  successTone: MorphingButtonSuccessTone,
): string => {
  if (status === "success") return SUCCESS_TONE_CLASSES[successTone];
  if (status === "error") return ERROR_CLASSES;
  return IDLE_VARIANT_CLASSES[variant];
};
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

const DEFAULTS = {
  variant: "primary",
  successTone: "signal",
  size: "md",
  radius: "pill",
  type: "button",
} as const;

interface MorphingLabelProps {
  status: MorphingButtonStatus;
  label: string;
  idleIcon?: ReactNode;
  reduceMotion: boolean;
}

/** 按钮里随阶段切换的图标与文字：新内容自下而上淡入，旧内容向上淡出 */
const MorphingLabel = ({ status, label, idleIcon, reduceMotion }: MorphingLabelProps) => {
  const StatusIcon = ICONS[status];
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
        {status === "idle" && idleIcon}
        {StatusIcon && (
          <StatusIcon
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

const buildMorphingClasses = (
  p: Pick<Required<MorphingButtonProps>, "status" | "variant" | "successTone" | "size" | "radius">,
  className?: string,
) =>
  cn(
    MORPHING_BASE_CLASSES,
    MORPHING_SIZE_CLASSES[p.size],
    MORPHING_RADIUS_CLASSES[p.radius],
    resolveMorphingTone(p.status, p.variant, p.successTone),
    className,
  );

export const MorphingButton = (inputProps: MorphingButtonProps) => {
  const p = { ...DEFAULTS, ...inputProps };
  const {
    status,
    labels,
    variant,
    successTone,
    size,
    radius,
    idleIcon,
    className,
    type,
    onClick,
    ...rest
  } = p;
  const reduceMotion = Boolean(useReducedMotion());
  const label = labels?.[status] ?? DEFAULT_LABELS[status];
  const loading = status === "loading";

  return (
    <>
      <motion.button
        layout={!reduceMotion}
        type={type}
        aria-label={label}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        data-slot="morphing-button"
        data-status={status}
        data-variant={variant}
        data-size={size}
        data-radius={radius}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className={buildMorphingClasses({ status, variant, successTone, size, radius }, className)}
        onClick={(e: MouseEvent<HTMLButtonElement>) => !loading && onClick?.(e)}
        {...rest}
      >
        <MorphingLabel
          status={status}
          label={label}
          idleIcon={idleIcon}
          reduceMotion={reduceMotion}
        />
      </motion.button>
      <span aria-live="polite" className="sr-only">
        {status === "idle" ? "" : label}
      </span>
    </>
  );
};
