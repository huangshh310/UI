"use client";

/**
 * Sheet：基于 Base UI Dialog 的四方向磨砂边缘抽屉，页头与页脚吸顶/吸底，主体独立滚动。
 */
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@matt-ui/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { SheetProps } from "./sheet.types.js";
import { sheetBackdropVariants, sheetPanelVariants } from "./sheet.variants.js";

const CLOSE_BUTTON_CLASS = cn(
  "inline-flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground outline-none",
  "transition-[background-color,color,border-color,transform] duration-(--ui-duration-fast) hover:border-border/60 hover:bg-accent/80 hover:text-foreground active:scale-95",
  "focus-visible:ring-2 focus-visible:ring-ring dark:hover:border-white/10 dark:hover:bg-white/10",
);

const SheetHeader = ({
  title,
  description,
  icon,
  badge,
  showCloseButton,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  showCloseButton: boolean;
}) => (
  <div className="flex shrink-0 items-start justify-between gap-3.5 border-b border-solid border-border/75 px-6 py-4 dark:border-white/8">
    <div className="flex min-w-0 items-start gap-3">
      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-solid border-border/80 bg-secondary/70 text-foreground dark:border-white/10 dark:bg-white/7"
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Dialog.Title className="m-0 font-sans text-[15px] font-semibold leading-snug tracking-tight text-foreground">
            {title}
          </Dialog.Title>
          {badge && (
            <span className="inline-flex items-center rounded-full border border-solid border-border/80 bg-secondary/70 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground dark:border-white/10 dark:bg-white/7">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <Dialog.Description className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </Dialog.Description>
        )}
      </div>
    </div>
    {showCloseButton && (
      <Dialog.Close aria-label="关闭抽屉" className={CLOSE_BUTTON_CLASS}>
        <X aria-hidden="true" className="size-4" />
      </Dialog.Close>
    )}
  </div>
);

const SheetPopupBody = (props: SheetProps) => {
  const { side = "right", size = "md", inset = true, showCloseButton = true } = props;
  return (
    <Dialog.Popup
      data-slot="sheet"
      data-side={side}
      data-inset={inset ? "true" : "false"}
      className={cn(sheetPanelVariants({ side, size, inset }), props.className)}
    >
      {side === "bottom" && (
        <span
          aria-hidden="true"
          className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-border dark:bg-white/15"
        />
      )}
      <SheetHeader
        title={props.title}
        description={props.description}
        icon={props.icon}
        badge={props.badge}
        showCloseButton={showCloseButton}
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 text-sm text-foreground">
        {props.children}
      </div>
      {props.footer && (
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-solid border-border/75 bg-secondary/35 px-6 py-3.5 dark:border-white/8 dark:bg-white/[0.03]">
          {props.footer}
        </div>
      )}
    </Dialog.Popup>
  );
};

export const Sheet = (props: SheetProps) => {
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
          data-slot="sheet-backdrop"
          className={sheetBackdropVariants({ backdrop })}
        />
        <SheetPopupBody {...props} />
      </Dialog.Portal>
    </Dialog.Root>
  );
};
