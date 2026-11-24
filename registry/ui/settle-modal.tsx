// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SettleModal：居中磨砂落位模态框，提供阻尼入场动效、焦点陷阱、滚动锁定与焦点恢复。
 */

import { cn } from "@/lib/utils";
import { Dialog } from "@base-ui/react/dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";

export const settleModalBackdropVariants = cva(
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

export const settleModalPopupVariants = cva(
  [
    "fixed left-1/2 z-50 flex w-[calc(100vw-2rem)] -translate-x-1/2 flex-col overflow-hidden",
    "rounded-2xl border border-solid border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl outline-none",
    "shadow-[0_20px_54px_-12px_rgba(0,0,0,0.16),0_4px_14px_-2px_rgba(0,0,0,0.06)]",
    "dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_26px_68px_-14px_rgba(0,0,0,0.75)]",
    "transition-[opacity,transform] duration-(--ui-duration-normal) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    "data-starting-style:scale-[0.96] data-starting-style:opacity-0",
    "data-ending-style:scale-[0.97] data-ending-style:opacity-0",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-xl",
        xl: "max-w-2xl",
      },
      align: {
        center:
          "top-1/2 -translate-y-1/2 data-starting-style:translate-y-[calc(-50%+12px)] data-ending-style:translate-y-[calc(-50%+8px)]",
        top: "top-[12vh] data-starting-style:translate-y-3 data-ending-style:translate-y-2",
      },
      tone: {
        default: "",
        signal: "border-signal/25 dark:border-signal/35",
        destructive: "border-destructive/30 dark:border-destructive/40",
      },
    },
    defaultVariants: {
      size: "md",
      align: "center",
      tone: "default",
    },
  },
);

export const settleModalIconVariants = cva(
  "inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-solid",
  {
    variants: {
      tone: {
        default:
          "border-border/80 bg-secondary/70 text-foreground dark:border-white/10 dark:bg-white/7",
        signal:
          "border-signal/25 bg-signal/12 text-signal dark:border-signal/35 dark:bg-signal/20 dark:text-blue-200",
        destructive:
          "border-destructive/25 bg-destructive/10 text-destructive dark:border-destructive/35 dark:bg-destructive/18",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);
export type SettleModalSize = "sm" | "md" | "lg" | "xl";
export type SettleModalTone = "default" | "signal" | "destructive";
export type SettleModalBackdrop = "blur" | "dim" | "transparent";
export type SettleModalAlign = "center" | "top";

export interface SettleModalProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 非受控初始打开状态 */
  defaultOpen?: boolean;
  /** 打开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 触发元素（传入按钮等交互元素，不嵌套额外 button） */
  trigger?: ReactElement;
  /** 弹窗标题，用于无障碍命名 */
  title: string;
  /** 弹窗副标题说明 */
  description?: string;
  /** 标题左侧徽章图标 */
  icon?: ReactNode;
  /** 视觉语义色调（默认中性，支持信号蓝与高危红） */
  tone?: SettleModalTone;
  /** 背景遮罩风格 */
  backdrop?: SettleModalBackdrop;
  /** 垂直对齐位置 */
  align?: SettleModalAlign;
  /** 主体内容 */
  children?: ReactNode;
  /** 底部操作栏 */
  footer?: ReactNode;
  /** 宽度预设 */
  size?: SettleModalSize;
  /** 是否显示右上角关闭按钮 */
  showCloseButton?: boolean;
  /** 自定义弹窗面板类名 */
  className?: string;
}
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
