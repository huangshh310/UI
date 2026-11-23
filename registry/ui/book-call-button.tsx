// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
/**
 * BookCallButton：预约通话的胶囊按钮。
 *
 * 平时左侧是一枚高饱和色的小胶囊，里面是引导图标，右侧是文字；
 * 悬停或键盘聚焦时胶囊扩展到铺满整个按钮，文字滑出，中间浮现动作图标（及可选悬停提示）。
 * 文字只是在视觉上滑出，按钮的可访问名称始终是 label。全部动效由 CSS 完成。
 *
 * 类名必须写成完整的字面量：Tailwind 靠扫描源码文本来生成样式，拼接出来的类名不会被识别。
 */

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight, Phone } from "lucide-react";
import { type ComponentProps, type ReactNode } from "react";

const BUTTON_BASE = [
  "group relative m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center overflow-hidden rounded-full border border-solid",
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none",
  "transition-[background-color,border-color,transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.98] motion-reduce:active:scale-100",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
].join(" ");

export const bookCallButtonVariants = cva(BUTTON_BASE, {
  variants: {
    variant: {
      primary:
        "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_6px_-1px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_8px_-2px_rgba(0,0,0,0.45)]",
      outline:
        "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 dark:bg-card/85",
      surface: "border-border/70 bg-secondary text-secondary-foreground shadow-xs",
    },
    size: {
      sm: "h-10 py-0 pr-4.5 pl-1 text-xs",
      md: "h-12 py-0 pr-6 pl-1.5 text-sm",
      lg: "h-13 py-0 pr-7 pl-1.5 text-[15px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export const bookCallCapsuleVariants = cva(
  "absolute rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-[width] duration-(--ui-duration-slow) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
  {
    variants: {
      tone: {
        signal: "bg-signal",
        emerald: "bg-emerald-700 dark:bg-emerald-500",
        primary: "bg-primary",
      },
      size: {
        sm: "inset-y-1 left-1 w-8 group-hover:w-[calc(100%-0.5rem)] group-focus-visible:w-[calc(100%-0.5rem)]",
        md: "inset-y-1.5 left-1.5 w-9 group-hover:w-[calc(100%-0.75rem)] group-focus-visible:w-[calc(100%-0.75rem)]",
        lg: "inset-y-1.5 left-1.5 w-10 group-hover:w-[calc(100%-0.75rem)] group-focus-visible:w-[calc(100%-0.75rem)]",
      },
    },
    defaultVariants: {
      tone: "signal",
      size: "md",
    },
  },
);

/** 胶囊内部前景色，确保浅深主题均满足高对比度 */
export const CAPSULE_FOREGROUND_CLASSES = {
  signal: "text-signal-foreground",
  emerald: "text-white dark:text-neutral-950",
  primary: "text-primary-foreground",
} as const;

/** 静置图标占位宽度，与胶囊初始宽度严格对齐 */
export const LEADING_SLOT_CLASSES = {
  sm: "w-8",
  md: "w-9",
  lg: "w-10",
} as const;
type ButtonVariantProps = VariantProps<typeof bookCallButtonVariants>;
type CapsuleVariantProps = VariantProps<typeof bookCallCapsuleVariants>;

/** 按钮底面视觉变体 */
export type BookCallButtonVariant = NonNullable<ButtonVariantProps["variant"]>;

/** 展开胶囊的色调 */
export type BookCallButtonTone = NonNullable<CapsuleVariantProps["tone"]>;

/** 按钮尺寸 */
export type BookCallButtonSize = NonNullable<ButtonVariantProps["size"]>;

export interface BookCallButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** 按钮上的文字，默认「Book a call」 */
  label?: string;
  /** 悬停展开时显示在图标旁的辅助文案（纯视觉装饰，不改变可访问名称） */
  hoverLabel?: string;
  /** 按钮底面变体，默认 primary */
  variant?: BookCallButtonVariant;
  /** 展开胶囊的色调，默认 signal */
  tone?: BookCallButtonTone;
  /** 按钮尺寸，默认 md */
  size?: BookCallButtonSize;
  /** 静置时左侧胶囊内的图标，默认为右上箭头 */
  leadingIcon?: ReactNode;
  /** 悬停展开后居中的图标，默认为电话图标 */
  icon?: ReactNode;
}
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
