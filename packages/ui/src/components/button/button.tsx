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
import { cn } from "@matt-ui/utils";
import type { MouseEvent } from "react";
import { ButtonSpinner } from "./button-spinner.js";
import type { ButtonProps } from "./button.types.js";
import { buttonVariants } from "./button.variants.js";

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
