// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Sheet：基于 Base UI Dialog 的四方向磨砂边缘抽屉，页头与页脚吸顶/吸底，主体独立滚动。
 */

import { cn } from "@/lib/utils";
import { Dialog } from "@base-ui/react/dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";

export const sheetBackdropVariants = cva(
  "fixed inset-0 z-50 transition-opacity duration-(--ui-duration-normal) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
  {
    variants: {
      backdrop: {
        blur: "bg-black/25 backdrop-blur-[6px] dark:bg-black/65",
        dim: "bg-black/40 dark:bg-black/72",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      backdrop: "blur",
    },
  },
);

export const sheetPanelVariants = cva(
  [
    "fixed z-50 flex flex-col overflow-hidden border-solid border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl outline-none",
    "dark:border-white/10 dark:bg-popover/95",
    "transition-[opacity,transform] duration-(--ui-duration-normal) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
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
        xl: "",
      },
      inset: {
        true: "rounded-2xl border shadow-[0_24px_64px_-14px_rgba(0,0,0,0.18),0_4px_16px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_28px_72px_-14px_rgba(0,0,0,0.78)]",
        false:
          "shadow-[0_16px_48px_-12px_rgba(0,0,0,0.16)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.72)]",
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
      { side: "right", size: "xl", class: "sm:max-w-2xl" },
      { side: "left", size: "sm", class: "sm:max-w-sm" },
      { side: "left", size: "md", class: "sm:max-w-md" },
      { side: "left", size: "lg", class: "sm:max-w-xl" },
      { side: "left", size: "xl", class: "sm:max-w-2xl" },
      { side: "top", size: "sm", class: "max-h-64" },
      { side: "top", size: "md", class: "max-h-96" },
      { side: "top", size: "lg", class: "max-h-[75dvh]" },
      { side: "top", size: "xl", class: "max-h-[85dvh]" },
      { side: "bottom", size: "sm", class: "max-h-64" },
      { side: "bottom", size: "md", class: "max-h-96" },
      { side: "bottom", size: "lg", class: "max-h-[75dvh]" },
      { side: "bottom", size: "xl", class: "max-h-[85dvh]" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
      inset: true,
    },
  },
);
export type SheetSide = "right" | "left" | "top" | "bottom";
export type SheetSize = "sm" | "md" | "lg" | "xl";
export type SheetBackdrop = "blur" | "dim" | "transparent";

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
  /** 背景遮罩风格 */
  backdrop?: SheetBackdrop;
  /** 抽屉标题 */
  title: string;
  /** 抽屉副标题 */
  description?: string;
  /** 标题左侧徽章图标 */
  icon?: ReactNode;
  /** 标题旁状态胶囊标签 */
  badge?: string;
  /** 独立滚动主体内容 */
  children?: ReactNode;
  /** 吸底操作栏 */
  footer?: ReactNode;
  /** 是否展示关闭按钮 */
  showCloseButton?: boolean;
  /** 自定义面板类名 */
  className?: string;
}
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
