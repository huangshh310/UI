// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Button：触发一个操作。
 *
 * 基于原生 <button>，不使用任何交互底座。与原生按钮有两处不同：
 *
 * 1. type 默认是 "button" 而不是 "submit"，避免放进表单后被意外当作提交按钮。
 *    需要提交时显式传入 type="submit"。
 * 2. loading 为真时按钮不可重复触发：点击、Enter、空格都被忽略，提交按钮也不会再次提交表单。
 *    此时用 aria-disabled 而不是原生 disabled，按钮仍然可以聚焦，
 *    正停留在按钮上的键盘用户不会因为加载开始而丢失焦点。
 */

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, type MouseEvent } from "react";

/** 所有变体共用的基础样式 */
const BASE_CLASSES = [
  // 布局与盒模型
  "m-0 box-border inline-flex shrink-0 items-center justify-center gap-2",
  "appearance-none rounded-lg border border-solid border-transparent",
  // 文字
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap no-underline select-none",
  // 交互：C 端丝滑微缩放按压触感
  "cursor-pointer transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.98] motion-reduce:active:scale-100",
  // 焦点环只在键盘聚焦时出现
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "focus-visible:outline-solid",
  // 禁用
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
  // 加载中：不响应指针，悬停与按下的视觉反馈也随之消失
  "data-loading:pointer-events-none",
  // 内部图标的统一尺寸
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
].join(" ");

export const buttonVariants = cva(BASE_CLASSES, {
  variants: {
    variant: {
      // 主要操作：高对比纯黑/纯白实底，极微顶边高光与轻盈接地微影
      primary:
        "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-primary/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.3)]",
      // 次要操作：柔和纯中性浅灰配极细发丝描边
      secondary:
        "border-border/60 bg-secondary text-secondary-foreground shadow-xs hover:border-border hover:bg-accent",
      // 描边：纯白/黑曜石卡片底配 1px 丝滑发丝线
      outline:
        "border-border bg-card text-foreground shadow-xs hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
      // 幽灵：静置态无底色，悬停切入柔和反馈面
      ghost: "bg-transparent text-foreground hover:bg-accent/80",
      // 破坏性操作：浅深主题均保证高对比前景
      destructive:
        "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-destructive/90",
      // 链接外观：下划线在悬停时加粗
      link: "bg-transparent text-foreground underline decoration-border decoration-1 underline-offset-4 hover:decoration-foreground",
      // 信号：克制纯粹的 BoardUI 品牌蓝，带微光顶边与轻盈投影
      signal:
        "bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_1px_2px_rgba(21,93,252,0.28)] hover:bg-signal/92",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-9.5 px-4 text-sm",
      lg: "h-11 px-6 text-[15px]",
      // 只含图标的方形按钮
      icon: "size-9.5 p-0",
    },
    radius: {
      default: "rounded-lg",
      pill: "rounded-full",
    },
  },
  compoundVariants: [
    // 默认大号按钮配更舒展的 12px 圆角
    { size: "lg", radius: "default", class: "rounded-xl" },
    // 链接外观不占据按钮的高度与内边距，随文字流排布
    { variant: "link", class: "h-auto rounded-none px-0 active:scale-100" },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    radius: "default",
  },
});
type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/** 视觉变体，决定按钮的强调程度 */
export type ButtonVariant = NonNullable<ButtonVariantProps["variant"]>;

/** 尺寸；icon 用于只含图标的方形按钮 */
export type ButtonSize = NonNullable<ButtonVariantProps["size"]>;

/** 圆角风格：默认圆角或胶囊圆角 */
export type ButtonRadius = NonNullable<ButtonVariantProps["radius"]>;

/**
 * Button 的 Props：原生 <button> 的全部属性，加上以下扩展。
 * ref 直接作为普通属性传入（React 19）。
 */
export interface ButtonProps extends ComponentProps<"button"> {
  /** 视觉变体，默认 primary */
  variant?: ButtonVariant;
  /** 尺寸，默认 md。使用 icon 时必须提供 aria-label */
  size?: ButtonSize;
  /** 圆角风格，默认 default */
  radius?: ButtonRadius;
  /**
   * 是否处于加载中。为真时显示旋转指示器，并忽略点击与键盘激活，
   * 防止同一个操作被重复触发。按钮仍可聚焦。
   */
  loading?: boolean;
}
const ButtonSpinner = () => (
  <svg
    aria-hidden="true"
    data-slot="button-spinner"
    className="animate-spin motion-reduce:animate-none"
    viewBox="0 0 16 16"
    fill="none"
  >
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
export const Button = ({
  variant = "primary",
  size = "md",
  radius = "default",
  type = "button",
  loading = false,
  className,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  /** 加载中拦截点击；键盘激活最终也会派发 click 事件，因此在这一处拦截即可 */
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      // 阻止默认行为，提交按钮才不会再次提交表单
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-radius={radius}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(buttonVariants({ variant, size, radius }), className)}
      onClick={handleClick}
      {...props}
    >
      {loading && <ButtonSpinner />}
      {children}
    </button>
  );
};
