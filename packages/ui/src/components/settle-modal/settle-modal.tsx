"use client";

/**
 * SettleModal：基于 Base UI Dialog 的居中模态框，提供磨砂浮层质感、阻尼落位动效与完整焦点管理。
 */
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@matt-ui/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { SettleModalProps, SettleModalTone } from "./settle-modal.types.js";
import {
  settleModalBackdropVariants,
  settleModalIconVariants,
  settleModalPopupVariants,
} from "./settle-modal.variants.js";

const CLOSE_BUTTON_CLASS = cn(
  "inline-flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground outline-none",
  "transition-[background-color,color,border-color,transform] duration-(--ui-duration-fast) hover:border-border/60 hover:bg-accent/80 hover:text-foreground active:scale-95",
  "focus-visible:ring-2 focus-visible:ring-ring dark:hover:border-white/10 dark:hover:bg-white/10",
);

const ModalHeader = ({
  title,
  description,
  icon,
  tone,
  showCloseButton,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  tone: SettleModalTone;
  showCloseButton: boolean;
}) => (
  <div className="flex items-start justify-between gap-3.5 px-6 pt-5 pb-3.5">
    <div className="flex min-w-0 items-start gap-3">
      {icon && (
        <span aria-hidden="true" className={settleModalIconVariants({ tone })}>
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <Dialog.Title className="m-0 font-sans text-[15px] font-semibold leading-snug tracking-tight text-foreground">
          {title}
        </Dialog.Title>
        {description && (
          <Dialog.Description className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
            {description}
          </Dialog.Description>
        )}
      </div>
    </div>
    {showCloseButton && (
      <Dialog.Close aria-label="关闭弹窗" className={CLOSE_BUTTON_CLASS}>
        <X aria-hidden="true" className="size-4" />
      </Dialog.Close>
    )}
  </div>
);

const SettleModalPopup = (props: SettleModalProps) => {
  const { tone = "default", align = "center", size = "md", showCloseButton = true } = props;
  return (
    <Dialog.Popup
      data-slot="settle-modal"
      data-tone={tone}
      data-align={align}
      className={cn(settleModalPopupVariants({ size, align, tone }), props.className)}
    >
      <ModalHeader
        title={props.title}
        description={props.description}
        icon={props.icon}
        tone={tone}
        showCloseButton={showCloseButton}
      />
      {props.children && (
        <div className="max-h-[65dvh] overflow-y-auto px-6 py-2 text-sm text-foreground">
          {props.children}
        </div>
      )}
      {props.footer && (
        <div className="mt-3 flex items-center justify-end gap-2 border-t border-solid border-border/75 bg-secondary/35 px-6 py-3.5 dark:border-white/8 dark:bg-white/[0.03]">
          {props.footer}
        </div>
      )}
    </Dialog.Popup>
  );
};

export const SettleModal = (props: SettleModalProps) => {
  const { open, defaultOpen, onOpenChange, trigger, backdrop = "blur" } = props;
  return (
    <Dialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => onOpenChange?.(next)}
    >
      {trigger && <Dialog.Trigger render={trigger} />}
      <Dialog.Portal>
        <Dialog.Backdrop
          data-slot="settle-modal-backdrop"
          className={settleModalBackdropVariants({ backdrop })}
        />
        <SettleModalPopup {...props} />
      </Dialog.Portal>
    </Dialog.Root>
  );
};
