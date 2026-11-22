"use client";

/**
 * MorphingDialog：基于 Base UI Dialog 与 motion 共享 layoutId 的卡片形变弹窗。
 */
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@matt-ui/utils";
import { ArrowUpRight, X } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useId } from "react";
import type { MorphingDialogProps } from "./morphing-dialog.types.js";

const SPRING = { type: "spring" as const, stiffness: 360, damping: 32, mass: 0.9 };

const MorphTriggerCard = ({
  layoutKey,
  title,
  subtitle,
  tag,
  triggerClassName,
}: Pick<MorphingDialogProps, "title" | "subtitle" | "tag" | "triggerClassName"> & {
  layoutKey: string;
}) => (
  <Dialog.Trigger
    render={
      <motion.button
        type="button"
        layoutId={`morph-card-${layoutKey}`}
        transition={SPRING}
        data-slot="morphing-dialog-trigger"
        className={cn(
          "group flex w-full max-w-xs cursor-pointer flex-col gap-2 rounded-xl border border-solid border-border bg-card p-4 text-left shadow-sm",
          "transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/25",
          triggerClassName,
        )}
      />
    }
  >
    <div className="flex w-full items-center justify-between gap-2">
      {tag ? (
        <span className="rounded-full bg-signal px-2 py-0.5 font-mono text-[11px] font-medium text-signal-foreground">
          {tag}
        </span>
      ) : (
        <span />
      )}
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
      />
    </div>
    <motion.span
      layoutId={`morph-title-${layoutKey}`}
      className="font-sans text-sm font-semibold text-foreground"
    >
      {title}
    </motion.span>
    {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
  </Dialog.Trigger>
);

const MorphHeader = ({
  layoutKey,
  title,
  subtitle,
  tag,
}: Pick<MorphingDialogProps, "title" | "subtitle" | "tag"> & { layoutKey: string }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      {tag && (
        <span className="mb-2 inline-block rounded-full bg-signal px-2 py-0.5 font-mono text-[11px] font-medium text-signal-foreground">
          {tag}
        </span>
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
        <Dialog.Description className="m-0 mt-1 text-xs text-muted-foreground">
          {subtitle}
        </Dialog.Description>
      )}
    </div>
    <Dialog.Close
      aria-label="关闭弹窗"
      className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <X aria-hidden="true" className="size-4" />
    </Dialog.Close>
  </div>
);

const MorphExpandedPanel = ({
  layoutKey,
  title,
  subtitle,
  tag,
  children,
  footer,
  className,
}: Pick<MorphingDialogProps, "title" | "subtitle" | "tag" | "children" | "footer" | "className"> & {
  layoutKey: string;
}) => (
  <Dialog.Popup
    render={
      <motion.div
        layoutId={`morph-card-${layoutKey}`}
        transition={SPRING}
        data-slot="morphing-dialog"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
          "rounded-2xl border border-solid border-border bg-popover p-6 text-popover-foreground shadow-lg outline-none",
          className,
        )}
      />
    }
  >
    <MorphHeader layoutKey={layoutKey} title={title} subtitle={subtitle} tag={tag} />
    {children && (
      <div className="mt-4 rounded-xl border border-solid border-border/75 bg-secondary/35 p-3.5 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    )}
    {footer && <div className="mt-4 flex items-center justify-end gap-2">{footer}</div>}
  </Dialog.Popup>
);

export const MorphingDialog = (props: MorphingDialogProps) => {
  const layoutKey = useId();
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
          triggerClassName={props.triggerClassName}
        />
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm transition-opacity duration-(--ui-duration-normal) data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-black/60" />
          <MorphExpandedPanel
            layoutKey={layoutKey}
            title={props.title}
            subtitle={props.subtitle}
            tag={props.tag}
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
