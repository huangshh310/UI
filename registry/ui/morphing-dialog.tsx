// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * MorphingDialog：基于共享布局过渡与完整焦点管理的磨砂卡片形变弹窗。
 */

import { cn } from "@/lib/utils";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, X } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { type ReactNode, useId } from "react";

export const MORPHING_SIZE_MAP: Record<MorphingDialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
};

export const MORPHING_TAG_MAP: Record<MorphingDialogTagTone, { pill: string; dot: string }> = {
  neutral: {
    pill: "border-border/80 bg-secondary/80 text-foreground dark:border-white/10 dark:bg-white/8",
    dot: "bg-muted-foreground",
  },
  signal: {
    pill: "border-signal/25 bg-signal/10 text-blue-800 dark:border-signal/35 dark:bg-signal/20 dark:text-blue-200",
    dot: "bg-signal",
  },
  success: {
    pill: "border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  warning: {
    pill: "border-amber-500/30 bg-amber-500/12 text-amber-900 dark:border-amber-400/25 dark:bg-amber-400/15 dark:text-amber-200",
    dot: "bg-amber-500",
  },
};

export const MORPHING_TRIGGER_CLASS =
  "group flex w-full max-w-xs cursor-pointer flex-col gap-2.5 rounded-2xl border border-solid border-border/85 bg-card/95 p-4 text-left shadow-[0_2px_10px_-4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] outline-none transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) hover:border-foreground/22 hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.12)] focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/10 dark:bg-card/90 dark:hover:border-white/22 dark:hover:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.65)]";

export const MORPHING_PANEL_CLASS =
  "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-solid border-border/80 bg-popover/96 p-6 text-popover-foreground backdrop-blur-xl outline-none shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18),0_4px_16px_-4px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_28px_72px_-12px_rgba(0,0,0,0.78)]";

export const MORPHING_CLOSE_CLASS =
  "inline-flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground outline-none transition-[background-color,color,border-color,transform] duration-(--ui-duration-fast) hover:border-border/60 hover:bg-accent/80 hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-ring dark:hover:border-white/10 dark:hover:bg-white/10";
export type MorphingDialogSize = "sm" | "md" | "lg";
export type MorphingDialogTagTone = "neutral" | "signal" | "success" | "warning";

export interface MorphingDialogProps {
  /** 受控开关状态 */
  open?: boolean;
  /** 非受控初始状态 */
  defaultOpen?: boolean;
  /** 开关状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 卡片与弹窗共享的标题 */
  title: string;
  /** 卡片与弹窗共享的副标题 */
  subtitle?: string;
  /** 顶部小标签 */
  tag?: string;
  /** 顶部标签语义色调 */
  tagTone?: MorphingDialogTagTone;
  /** 可选徽章图标（在卡片与弹窗头部共享展示） */
  icon?: ReactNode;
  /** 触发卡片底部的紧凑元信息摘要 */
  meta?: string;
  /** 展开后弹窗的最大宽度预设 */
  size?: MorphingDialogSize;
  /** 展开后展示的详细正文 */
  children?: ReactNode;
  /** 展开后的底部操作区 */
  footer?: ReactNode;
  /** 触发卡片自定义类名 */
  triggerClassName?: string;
  /** 弹窗面板自定义类名 */
  className?: string;
}
const SPRING = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.85 };

const MorphTag = ({ tag, tone }: { tag: string; tone: MorphingDialogTagTone }) => {
  const styles = MORPHING_TAG_MAP[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-solid px-2.5 py-0.5 font-mono text-[11px] font-medium",
        styles.pill,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", styles.dot)} />
      {tag}
    </span>
  );
};

const MorphTriggerTopRow = ({
  icon,
  tag,
  tagTone,
}: {
  icon?: MorphingDialogProps["icon"];
  tag?: string;
  tagTone: MorphingDialogTagTone;
}) => (
  <div className="flex w-full items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex size-7 items-center justify-center rounded-lg border border-solid border-border/80 bg-secondary/70 text-foreground dark:border-white/10 dark:bg-white/7"
        >
          {icon}
        </span>
      )}
      {tag && <MorphTag tag={tag} tone={tagTone} />}
    </div>
    <ArrowUpRight
      aria-hidden="true"
      className="size-4 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
    />
  </div>
);

const MorphTriggerCard = ({
  layoutKey,
  title,
  subtitle,
  tag,
  tagTone,
  icon,
  meta,
  triggerClassName,
}: Pick<
  MorphingDialogProps,
  "title" | "subtitle" | "tag" | "icon" | "meta" | "triggerClassName"
> & {
  layoutKey: string;
  tagTone: MorphingDialogTagTone;
}) => (
  <Dialog.Trigger
    render={
      <motion.button
        type="button"
        layoutId={`morph-card-${layoutKey}`}
        transition={SPRING}
        data-slot="morphing-dialog-trigger"
        className={cn(MORPHING_TRIGGER_CLASS, triggerClassName)}
      />
    }
  >
    <MorphTriggerTopRow icon={icon} tag={tag} tagTone={tagTone} />
    <div className="flex flex-col gap-0.5">
      <motion.span
        layoutId={`morph-title-${layoutKey}`}
        className="font-sans text-sm font-semibold tracking-tight text-foreground"
      >
        {title}
      </motion.span>
      {subtitle && (
        <span className="text-xs leading-relaxed text-muted-foreground">{subtitle}</span>
      )}
    </div>
    {meta && (
      <span className="border-t border-solid border-border/70 pt-2 font-mono text-[11px] text-muted-foreground dark:border-white/8">
        {meta}
      </span>
    )}
  </Dialog.Trigger>
);

const MorphHeader = ({
  layoutKey,
  title,
  subtitle,
  tag,
  tagTone,
  icon,
}: Pick<MorphingDialogProps, "title" | "subtitle" | "tag" | "icon"> & {
  layoutKey: string;
  tagTone: MorphingDialogTagTone;
}) => (
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      {(tag || icon) && (
        <div className="mb-2.5 flex items-center gap-2">
          {icon && (
            <span
              aria-hidden="true"
              className="inline-flex size-8 items-center justify-center rounded-xl border border-solid border-border/80 bg-secondary/70 text-foreground dark:border-white/10 dark:bg-white/7"
            >
              {icon}
            </span>
          )}
          {tag && <MorphTag tag={tag} tone={tagTone} />}
        </div>
      )}
      <Dialog.Title
        render={
          <motion.h2
            layoutId={`morph-title-${layoutKey}`}
            className="m-0 font-sans text-base font-semibold tracking-tight text-foreground"
          />
        }
      >
        {title}
      </Dialog.Title>
      {subtitle && (
        <Dialog.Description className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
          {subtitle}
        </Dialog.Description>
      )}
    </div>
    <Dialog.Close aria-label="关闭弹窗" className={MORPHING_CLOSE_CLASS}>
      <X aria-hidden="true" className="size-4" />
    </Dialog.Close>
  </div>
);

const MorphExpandedPanel = ({
  layoutKey,
  title,
  subtitle,
  tag,
  tagTone,
  icon,
  size,
  children,
  footer,
  className,
}: Pick<
  MorphingDialogProps,
  "title" | "subtitle" | "tag" | "icon" | "children" | "footer" | "className"
> & {
  layoutKey: string;
  tagTone: MorphingDialogTagTone;
  size: MorphingDialogSize;
}) => (
  <Dialog.Popup
    render={
      <motion.div
        layoutId={`morph-card-${layoutKey}`}
        transition={SPRING}
        data-slot="morphing-dialog"
        data-size={size}
        className={cn(MORPHING_PANEL_CLASS, MORPHING_SIZE_MAP[size], className)}
      />
    }
  >
    <MorphHeader
      layoutKey={layoutKey}
      title={title}
      subtitle={subtitle}
      tag={tag}
      tagTone={tagTone}
      icon={icon}
    />
    {children && (
      <div className="mt-4 rounded-xl border border-solid border-border/75 bg-secondary/35 p-3.5 text-sm leading-relaxed text-foreground dark:border-white/8 dark:bg-white/[0.03]">
        {children}
      </div>
    )}
    {footer && <div className="mt-4 flex items-center justify-end gap-2">{footer}</div>}
  </Dialog.Popup>
);

export const MorphingDialog = (props: MorphingDialogProps) => {
  const layoutKey = useId();
  const tagTone = props.tagTone ?? "neutral";
  const size = props.size ?? "md";

  return (
    <MotionConfig reducedMotion="user">
      <Dialog.Root
        open={props.open}
        defaultOpen={props.defaultOpen}
        onOpenChange={(next) => props.onOpenChange?.(next)}
      >
        <MorphTriggerCard
          layoutKey={layoutKey}
          title={props.title}
          subtitle={props.subtitle}
          tag={props.tag}
          tagTone={tagTone}
          icon={props.icon}
          meta={props.meta}
          triggerClassName={props.triggerClassName}
        />
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[6px] transition-opacity duration-(--ui-duration-normal) data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-black/65" />
          <MorphExpandedPanel
            layoutKey={layoutKey}
            title={props.title}
            subtitle={props.subtitle}
            tag={props.tag}
            tagTone={tagTone}
            icon={props.icon}
            size={size}
            footer={props.footer}
            className={props.className}
          >
            {props.children}
          </MorphExpandedPanel>
        </Dialog.Portal>
      </Dialog.Root>
    </MotionConfig>
  );
};
