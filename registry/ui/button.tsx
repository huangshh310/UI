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
  "appearance-none rounded-md border border-solid border-transparent",
  // 文字
  "font-sans font-medium whitespace-nowrap no-underline select-none",
  // 交互：按下时下沉一像素，给出触感反馈
  "cursor-pointer transition-colors duration-(--ui-duration-fast) ease-out active:translate-y-px",
  // 焦点环只在键盘聚焦时出现
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "focus-visible:outline-solid",
  // 禁用
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  // 加载中：不响应指针，悬停与按下的视觉反馈也随之消失
  "data-loading:pointer-events-none",
  // 内部图标的统一尺寸
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
].join(" ");

export const buttonVariants = cva(BASE_CLASSES, {
  variants: {
    variant: {
      // 主要操作：墨色实底
      primary: "bg-primary text-primary-foreground hover:bg-primary/88",
      // 次要操作：浅底，带一像素底边
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-accent",
      // 描边：边线使用 input 色，保证与背景的对比度
      outline: "border-input bg-transparent text-foreground shadow-sm hover:bg-accent",
      // 幽灵：平时无底色，悬停才出现
      ghost: "bg-transparent text-foreground hover:bg-accent",
      // 破坏性操作
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/88",
      // 链接外观：下划线在悬停时加粗
      link: "bg-transparent text-foreground underline decoration-1 underline-offset-4 hover:decoration-2",
      // 信号：全页面最需要被看到的那一个操作
      signal: "bg-signal text-signal-foreground hover:bg-signal/82",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-11 px-6 text-base",
      // 只含图标的方形按钮
      icon: "size-9 p-0",
    },
  },
  compoundVariants: [
    // 链接外观不占据按钮的高度与内边距，随文字流排布
    { variant: "link", class: "h-auto rounded-none px-0 active:translate-y-0" },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/** 视觉变体，决定按钮的强调程度 */
export type ButtonVariant = NonNullable<ButtonVariantProps["variant"]>;

/** 尺寸；icon 用于只含图标的方形按钮 */
export type ButtonSize = NonNullable<ButtonVariantProps["size"]>;

/**
 * Button 的 Props：原生 <button> 的全部属性，加上以下扩展。
 * ref 直接作为普通属性传入（React 19）。
 */
export interface ButtonProps extends ComponentProps<"button"> {
  /** 视觉变体，默认 primary */
  variant?: ButtonVariant;
  /** 尺寸，默认 md。使用 icon 时必须提供 aria-label */
  size?: ButtonSize;
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
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleClick}
      {...props}
    >
      {loading && <ButtonSpinner />}
      {children}
    </button>
  );
};
