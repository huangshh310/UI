"use client";

/**
 * MorphingDialog：基于 Base UI Dialog 与 motion 共享 layoutId 的磨砂卡片形变弹窗。
 */
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@matt-ui/utils";
import { ArrowUpRight, X } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useId } from "react";
import type {
  MorphingDialogProps,
  MorphingDialogSize,
  MorphingDialogTagTone,
} from "./morphing-dialog.types.js";
import {
  MORPHING_CLOSE_CLASS,
  MORPHING_PANEL_CLASS,
  MORPHING_SIZE_MAP,
  MORPHING_TAG_MAP,
  MORPHING_TRIGGER_CLASS,
} from "./morphing-dialog.variants.js";

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
