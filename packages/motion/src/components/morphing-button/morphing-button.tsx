"use client";

/**
 * MorphingButton：在「待操作、处理中、成功、失败」四个阶段之间变形的按钮。
 *
 * 宽度随文字平滑过渡，新旧内容交叉淡入淡出，页面布局不会跳动。
 * 可访问名称始终是当前阶段的文字；阶段变化时通过一个对视觉隐藏的播报区告知屏幕阅读器。
 * 处理中不响应点击，防止同一操作被重复提交。
 */
import { cn } from "@matt-ui/utils";
import { Check, LoaderCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import {
  MORPHING_BASE_CLASSES,
  MORPHING_RADIUS_CLASSES,
  MORPHING_SIZE_CLASSES,
  resolveMorphingTone,
} from "./morphing-button.styles.js";
import type { MorphingButtonProps, MorphingButtonStatus } from "./morphing-button.types.js";

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
