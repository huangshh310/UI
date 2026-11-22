// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
/**
 * BookCallButton：预约通话的胶囊按钮。
 *
 * 平时左侧是一枚信号色的小胶囊，里面是箭头，右侧是文字；
 * 悬停或键盘聚焦时胶囊扩展到铺满整个按钮，文字滑出，中间浮现电话图标。
 * 文字只是在视觉上滑出，按钮的可访问名称始终是 label。全部动效由 CSS 完成。
 *
 * 类名必须写成完整的字面量：Tailwind 靠扫描源码文本来生成样式，拼接出来的类名不会被识别。
 */

import { cn } from "@/lib/utils";
import { ArrowUpRight, Phone } from "lucide-react";
import { type ComponentProps } from "react";

export interface BookCallButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** 按钮上的文字，默认「Book a call」 */
  label?: string;
}
export const BookCallButton = ({
  label = "Book a call",
  className,
  type = "button",
  ...props
}: BookCallButtonProps) => (
  <button
    type={type}
    aria-label={label}
    data-slot="book-call-button"
    className={cn(
      "group relative m-0 box-border inline-flex h-12 cursor-pointer appearance-none items-center overflow-hidden rounded-full border-0 bg-primary py-0 pr-6 pl-1.5",
      "font-sans text-sm font-medium whitespace-nowrap text-primary-foreground select-none",
      "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {/* 信号色胶囊：悬停或聚焦时从 36px 扩展到铺满按钮 */}
    <span
      aria-hidden="true"
      data-slot="book-call-capsule"
      className="absolute inset-y-1.5 left-1.5 w-9 rounded-full bg-signal transition-[width] duration-(--ui-duration-slow) ease-out group-hover:w-[calc(100%-0.75rem)] group-focus-visible:w-[calc(100%-0.75rem)]"
    />
    <ArrowUpRight
      aria-hidden="true"
      className="relative mx-2.5 size-4 shrink-0 text-signal-foreground transition-opacity duration-(--ui-duration-fast) group-hover:opacity-0 group-focus-visible:opacity-0"
    />
    <span
      aria-hidden="true"
      className="relative ml-3 transition-[translate,opacity] duration-(--ui-duration-normal) ease-out group-hover:translate-x-3 group-hover:opacity-0 group-focus-visible:translate-x-3 group-focus-visible:opacity-0"
    >
      {label}
    </span>
    <Phone
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 size-4 -translate-1/2 scale-75 text-signal-foreground opacity-0 transition-[scale,opacity] duration-(--ui-duration-normal) ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
    />
  </button>
);
