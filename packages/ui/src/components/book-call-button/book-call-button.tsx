/**
 * BookCallButton：预约通话的胶囊按钮。
 *
 * 平时左侧是一枚高饱和色的小胶囊，里面是引导图标，右侧是文字；
 * 悬停或键盘聚焦时胶囊扩展到铺满整个按钮，文字滑出，中间浮现动作图标（及可选悬停提示）。
 * 文字只是在视觉上滑出，按钮的可访问名称始终是 label。全部动效由 CSS 完成。
 *
 * 类名必须写成完整的字面量：Tailwind 靠扫描源码文本来生成样式，拼接出来的类名不会被识别。
 */
import { cn } from "@matt-ui/utils";
import { ArrowUpRight, Phone } from "lucide-react";
import type { ReactNode } from "react";
import type { BookCallButtonProps } from "./book-call-button.types.js";
import {
  bookCallButtonVariants,
  bookCallCapsuleVariants,
  CAPSULE_FOREGROUND_CLASSES,
  LEADING_SLOT_CLASSES,
} from "./book-call-button.variants.js";

const REVEAL_CLASSES =
  "pointer-events-none absolute top-1/2 left-1/2 inline-flex -translate-1/2 scale-75 items-center gap-1.5 opacity-0 transition-[scale,opacity] duration-(--ui-duration-normal) ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none [&_svg]:size-4";

const BookCallHoverReveal = ({
  icon,
  hoverLabel,
  capsuleFg,
}: {
  icon?: ReactNode;
  hoverLabel?: string | undefined;
  capsuleFg: string;
}) => (
  <span aria-hidden="true" className={cn(REVEAL_CLASSES, capsuleFg)}>
    {icon ?? <Phone />}
    {hoverLabel && <span>{hoverLabel}</span>}
  </span>
);

export const BookCallButton = ({
  label = "Book a call",
  hoverLabel,
  variant = "primary",
  tone = "signal",
  size = "md",
  leadingIcon,
  icon,
  className,
  type = "button",
  ...props
}: BookCallButtonProps) => {
  const capsuleFg = CAPSULE_FOREGROUND_CLASSES[tone];

  return (
    <button
      type={type}
      aria-label={label}
      data-slot="book-call-button"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      className={cn(bookCallButtonVariants({ variant, size }), className)}
      {...props}
    >
      {/* 展开胶囊：悬停或聚焦时从圆形小胶囊铺满整个按钮 */}
      <span
        aria-hidden="true"
        data-slot="book-call-capsule"
        className={bookCallCapsuleVariants({ tone, size })}
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center transition-opacity duration-(--ui-duration-fast) group-hover:opacity-0 group-focus-visible:opacity-0 [&_svg]:size-4",
          LEADING_SLOT_CLASSES[size],
          capsuleFg,
        )}
      >
        {leadingIcon ?? <ArrowUpRight />}
      </span>
      <span
        aria-hidden="true"
        className="relative ml-2.5 transition-[translate,opacity] duration-(--ui-duration-normal) ease-out group-hover:translate-x-3 group-hover:opacity-0 group-focus-visible:translate-x-3 group-focus-visible:opacity-0 motion-reduce:transition-none"
      >
        {label}
      </span>
      <BookCallHoverReveal icon={icon} hoverLabel={hoverLabel} capsuleFg={capsuleFg} />
    </button>
  );
};
