// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Sheet：基于 Base UI Dialog 的四方向边缘抽屉，页头与页脚吸顶/吸底，主体独立滚动。
 */

import { cn } from "@/lib/utils";
import { Dialog } from "@base-ui/react/dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";

export const sheetPanelVariants = cva(
  [
    "fixed z-50 flex flex-col overflow-hidden border-solid border-border bg-popover text-popover-foreground outline-none",
    "transition-[opacity,transform] duration-(--ui-duration-normal) ease-(--ui-ease-out) motion-reduce:transition-none",
    "data-starting-style:opacity-0 data-ending-style:opacity-0",
  ],
  {
    variants: {
      side: {
        right: "",
        left: "",
        top: "",
        bottom: "",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      inset: {
        true: "rounded-2xl border shadow-xl",
        false: "shadow-lg",
      },
    },
    compoundVariants: [
      {
        side: "right",
        inset: true,
        class:
          "inset-y-3 right-3 h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] sm:inset-y-4 sm:right-4 sm:h-[calc(100dvh-2rem)] data-starting-style:translate-x-[calc(100%+2rem)] data-ending-style:translate-x-[calc(100%+2rem)]",
      },
      {
        side: "left",
        inset: true,
        class:
          "inset-y-3 left-3 h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] sm:inset-y-4 sm:left-4 sm:h-[calc(100dvh-2rem)] data-starting-style:-translate-x-[calc(100%+2rem)] data-ending-style:-translate-x-[calc(100%+2rem)]",
      },
      {
        side: "top",
        inset: true,
        class:
          "inset-x-3 top-3 mx-auto w-[calc(100vw-1.5rem)] sm:inset-x-4 sm:top-4 sm:w-[calc(100vw-2rem)] data-starting-style:-translate-y-[calc(100%+2rem)] data-ending-style:-translate-y-[calc(100%+2rem)]",
      },
      {
        side: "bottom",
        inset: true,
        class:
          "inset-x-3 bottom-3 mx-auto w-[calc(100vw-1.5rem)] sm:inset-x-4 sm:bottom-4 sm:w-[calc(100vw-2rem)] data-starting-style:translate-y-[calc(100%+2rem)] data-ending-style:translate-y-[calc(100%+2rem)]",
      },
      {
        side: "right",
        inset: false,
        class:
          "inset-y-0 right-0 h-full w-full border-l data-starting-style:translate-x-full data-ending-style:translate-x-full",
      },
      {
        side: "left",
        inset: false,
        class:
          "inset-y-0 left-0 h-full w-full border-r data-starting-style:-translate-x-full data-ending-style:-translate-x-full",
      },
      {
        side: "top",
        inset: false,
        class:
          "inset-x-0 top-0 w-full border-b data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
      },
      {
        side: "bottom",
        inset: false,
        class:
          "inset-x-0 bottom-0 w-full rounded-t-2xl border-t data-starting-style:translate-y-full data-ending-style:translate-y-full",
      },
      { side: "right", size: "sm", class: "sm:max-w-sm" },
      { side: "right", size: "md", class: "sm:max-w-md" },
      { side: "right", size: "lg", class: "sm:max-w-xl" },
      { side: "left", size: "sm", class: "sm:max-w-sm" },
      { side: "left", size: "md", class: "sm:max-w-md" },
      { side: "left", size: "lg", class: "sm:max-w-xl" },
      { side: "top", size: "sm", class: "max-h-64" },
      { side: "top", size: "md", class: "max-h-96" },
      { side: "top", size: "lg", class: "max-h-[75dvh]" },
      { side: "bottom", size: "sm", class: "max-h-64" },
      { side: "bottom", size: "md", class: "max-h-96" },
      { side: "bottom", size: "lg", class: "max-h-[75dvh]" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
      inset: true,
    },
  },
);
export type SheetSide = "right" | "left" | "top" | "bottom";
export type SheetSize = "sm" | "md" | "lg";

export interface SheetProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 非受控初始打开状态 */
  defaultOpen?: boolean;
  /** 开关状态回调 */
  onOpenChange?: (open: boolean) => void;
  /** 触发元素 */
  trigger?: ReactElement;
  /** 滑入方向 */
  side?: SheetSide;
  /** 尺寸预设（左右抽屉控制宽度，上下抽屉控制最大高度） */
  size?: SheetSize;
  /** 是否以悬浮留白圆角卡片展示（默认 true，四周圆角并与视口保留间距；false 为传统贴边模式） */
  inset?: boolean;
  /** 抽屉标题 */
  title: string;
  /** 抽屉副标题 */
  description?: string;
  /** 独立滚动主体内容 */
  children?: ReactNode;
  /** 吸底操作栏 */
  footer?: ReactNode;
  /** 是否展示关闭按钮 */
  showCloseButton?: boolean;
  /** 自定义面板类名 */
  className?: string;
}
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
