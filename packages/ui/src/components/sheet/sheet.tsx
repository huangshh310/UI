"use client";

/**
 * Sheet：基于 Base UI Dialog 的四方向边缘抽屉，页头与页脚吸顶/吸底，主体独立滚动。
 */
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@matt-ui/utils";
import { X } from "lucide-react";
import type { SheetProps } from "./sheet.types.js";
import { sheetPanelVariants } from "./sheet.variants.js";

const SheetHeader = ({
  title,
  description,
  showCloseButton,
}: {
  title: string;
  description?: string;
  showCloseButton: boolean;
}) => (
  <div className="flex shrink-0 items-start justify-between gap-4 border-b border-solid border-border/80 px-6 py-4">
    <div className="min-w-0">
      <Dialog.Title className="m-0 font-sans text-base font-semibold tracking-tight text-foreground">
        {title}
      </Dialog.Title>
      {description && (
        <Dialog.Description className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </Dialog.Description>
      )}
    </div>
    {showCloseButton && (
      <Dialog.Close
        aria-label="关闭抽屉"
        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X aria-hidden="true" className="size-4" />
      </Dialog.Close>
    )}
  </div>
);

export const Sheet = ({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  side = "right",
  size = "md",
  inset = true,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  className,
}: SheetProps) => (
  <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={(next) => onOpenChange?.(next)}>
    {trigger && <Dialog.Trigger render={trigger} />}
    <Dialog.Portal>
      <Dialog.Backdrop
        data-slot="sheet-backdrop"
        className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm transition-opacity duration-(--ui-duration-normal) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none dark:bg-black/60"
      />
      <Dialog.Popup
        data-slot="sheet"
        data-side={side}
        data-inset={inset ? "true" : "false"}
        className={cn(sheetPanelVariants({ side, size, inset }), className)}
      >
        <SheetHeader title={title} description={description} showCloseButton={showCloseButton} />
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 text-sm text-foreground">
          {children}
        </div>
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-solid border-border/80 bg-secondary/35 px-6 py-3.5">
            {footer}
          </div>
        )}
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);
