// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * DirectionalTooltip：基于 Base UI Tooltip 的方向感知磨砂提示气泡，支持快捷键键帽与反色变体。
 */

import { cn } from "@/lib/utils";
import { Tooltip } from "@base-ui/react/tooltip";
import { cva } from "class-variance-authority";
import { type ReactElement, type ReactNode } from "react";

export const directionalTooltipPopupVariants = cva(
  [
    "z-50 inline-flex max-w-xs items-center gap-2 rounded-lg border border-solid font-sans font-medium leading-snug outline-none",
    "transition-[opacity,transform] duration-(--ui-duration-fast) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    "data-starting-style:scale-[0.96] data-starting-style:opacity-0 data-ending-style:scale-[0.97] data-ending-style:opacity-0",
    "data-[side=top]:data-starting-style:translate-y-1.5 data-[side=top]:data-ending-style:translate-y-1",
    "data-[side=bottom]:data-starting-style:-translate-y-1.5 data-[side=bottom]:data-ending-style:-translate-y-1",
    "data-[side=left]:data-starting-style:translate-x-1.5 data-[side=left]:data-ending-style:translate-x-1",
    "data-[side=right]:data-starting-style:-translate-x-1.5 data-[side=right]:data-ending-style:-translate-x-1",
  ],
  {
    variants: {
      variant: {
        default:
          "border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl shadow-[0_10px_28px_-6px_rgba(0,0,0,0.14),0_2px_6px_-1px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.68)]",
        inverted:
          "border-foreground bg-foreground text-background shadow-[0_10px_26px_-6px_rgba(0,0,0,0.28)] dark:border-white/20 dark:bg-foreground dark:text-background dark:shadow-[0_14px_32px_-8px_rgba(0,0,0,0.75)]",
        glass:
          "border-border/75 bg-popover/85 text-popover-foreground backdrop-blur-2xl shadow-[0_12px_30px_-8px_rgba(0,0,0,0.14)] dark:border-white/14 dark:bg-popover/80 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.7)]",
      },
      size: {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-3 py-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export const directionalTooltipArrowVariants = cva(
  [
    "size-2 rotate-45 border-solid",
    "data-[side=top]:-bottom-1 data-[side=top]:border-r data-[side=top]:border-b",
    "data-[side=bottom]:-top-1 data-[side=bottom]:border-t data-[side=bottom]:border-l",
    "data-[side=left]:-right-1 data-[side=left]:border-t data-[side=left]:border-r",
    "data-[side=right]:-left-1 data-[side=right]:border-b data-[side=right]:border-l",
  ],
  {
    variants: {
      variant: {
        default: "border-border/80 bg-popover dark:border-white/10",
        inverted: "border-foreground bg-foreground dark:border-white/20",
        glass: "border-border/75 bg-popover/90 dark:border-white/14",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const directionalTooltipKbdVariants = cva(
  "inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded border border-solid px-1 font-mono text-[10px] font-medium leading-none",
  {
    variants: {
      variant: {
        default:
          "border-border/85 bg-secondary/80 text-muted-foreground dark:border-white/12 dark:bg-white/8",
        inverted:
          "border-white/20 bg-white/14 text-background/90 dark:border-black/15 dark:bg-black/10 dark:text-background/85",
        glass:
          "border-border/80 bg-background/60 text-muted-foreground dark:border-white/12 dark:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";
export type TooltipVariant = "default" | "inverted" | "glass";
export type TooltipSize = "sm" | "md";

export interface DirectionalTooltipProviderProps {
  children?: ReactNode;
  /** 组内默认延迟（毫秒） */
  delay?: number;
  /** 组内关闭延迟（毫秒） */
  closeDelay?: number;
  /** 快速切换时间窗口（毫秒） */
  timeout?: number;
}

export interface DirectionalTooltipProps {
  /** 提示文案或节点 */
  content: ReactNode;
  /** 可选快捷键标注，自动以等宽键帽芯片展示在提示右侧 */
  shortcut?: string;
  /** 触发元素（传入按钮、链接等交互元素） */
  children: ReactElement;
  /** 弹出方向，动效将沿该方向轴线滑入 */
  side?: TooltipSide;
  /** 对齐方式 */
  align?: TooltipAlign;
  /** 视觉风格：default 磨砂浅浮层 / inverted 高对比反色 / glass 轻透玻璃 */
  variant?: TooltipVariant;
  /** 尺寸密度 */
  size?: TooltipSize;
  /** 与触发元素的间距（像素） */
  sideOffset?: number;
  /** 悬停触发延迟（毫秒） */
  delay?: number;
  /** 受控显示状态 */
  open?: boolean;
  /** 状态变更回调 */
  onOpenChange?: (open: boolean) => void;
  /** 是否显示指示箭头 */
  showArrow?: boolean;
  /** 自定义气泡类名 */
  className?: string;
}
export const DirectionalTooltipProvider = ({
  children,
  delay = 220,
  closeDelay = 0,
  timeout = 400,
}: DirectionalTooltipProviderProps) => (
  <Tooltip.Provider delay={delay} closeDelay={closeDelay} timeout={timeout}>
    {children}
  </Tooltip.Provider>
);

export const DirectionalTooltip = ({
  content,
  shortcut,
  children,
  side = "top",
  align = "center",
  variant = "default",
  size = "sm",
  sideOffset = 8,
  delay = 220,
  open,
  onOpenChange,
  showArrow = true,
  className,
}: DirectionalTooltipProps) => (
  <Tooltip.Root open={open} onOpenChange={(next) => onOpenChange?.(next)}>
    <Tooltip.Trigger delay={delay} render={children} />
    <Tooltip.Portal>
      <Tooltip.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50">
        <Tooltip.Popup
          data-slot="directional-tooltip"
          data-variant={variant}
          className={cn(directionalTooltipPopupVariants({ variant, size }), className)}
        >
          {showArrow && <Tooltip.Arrow className={directionalTooltipArrowVariants({ variant })} />}
          <span>{content}</span>
          {shortcut && <kbd className={directionalTooltipKbdVariants({ variant })}>{shortcut}</kbd>}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);
