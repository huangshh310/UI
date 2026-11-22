"use client";

/**
 * SettleModal：基于 Base UI Dialog 的居中模态框，提供阻尼落位入场/退场与完整焦点管理。
 */
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@matt-ui/utils";
import { X } from "lucide-react";
import type { SettleModalProps, SettleModalSize } from "./settle-modal.types.js";

const SIZE_CLASS: Record<SettleModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
};

const POPUP_CLASS = cn(
  "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
  "rounded-2xl border border-solid border-border bg-popover text-popover-foreground shadow-lg outline-none",
  "transition-[opacity,transform] duration-(--ui-duration-normal) ease-(--ui-ease-out)",
  "data-starting-style:translate-y-[calc(-50%+10px)] data-starting-style:scale-[0.97] data-starting-style:opacity-0",
  "data-ending-style:translate-y-[calc(-50%+6px)] data-ending-style:scale-[0.98] data-ending-style:opacity-0",
  "motion-reduce:transition-none",
);

const ModalHeader = ({
  title,
  description,
  showCloseButton,
}: {
  title: string;
  description?: string;
  showCloseButton: boolean;
}) => (
  <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
    <div className="min-w-0">
      <Dialog.Title className="m-0 font-sans text-base font-semibold tracking-tight text-foreground">
        {title}
      </Dialog.Title>
      {description && (
        <Dialog.Description className="m-0 mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </Dialog.Description>
      )}
    </div>
    {showCloseButton && (
      <Dialog.Close
        aria-label="关闭弹窗"
        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X aria-hidden="true" className="size-4" />
      </Dialog.Close>
    )}
  </div>
);

export const SettleModal = ({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  className,
}: SettleModalProps) => (
  <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={(next) => onOpenChange?.(next)}>
    {trigger && <Dialog.Trigger render={trigger} />}
    <Dialog.Portal>
      <Dialog.Backdrop
        data-slot="settle-modal-backdrop"
        className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm transition-opacity duration-(--ui-duration-normal) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none dark:bg-black/60"
      />
      <Dialog.Popup
        data-slot="settle-modal"
        className={cn(POPUP_CLASS, SIZE_CLASS[size], className)}
      >
        <ModalHeader title={title} description={description} showCloseButton={showCloseButton} />
        {children && <div className="px-6 py-2 text-sm text-foreground">{children}</div>}
        {footer && (
          <div className="mt-3 flex items-center justify-end gap-2 rounded-b-2xl border-t border-solid border-border/70 bg-secondary/35 px-6 py-3.5">
            {footer}
          </div>
        )}
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);
