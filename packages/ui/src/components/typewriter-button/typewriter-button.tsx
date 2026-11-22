"use client";

/**
 * TypewriterButton：点击后把文字逐字重新打出来的按钮。
 *
 * 可访问名称始终是完整的 label，逐字变化的部分对辅助技术隐藏，
 * 屏幕阅读器不会把打字过程读成一串零碎的字符。
 * 按钮的宽度由一份不可见的完整文字撑住，打字过程中不会跳动。
 * 用户要求减少动态效果时光标不闪烁。
 */
import { cn } from "@matt-ui/utils";
import type { MouseEvent } from "react";
import type { TypewriterButtonProps } from "./typewriter-button.types.js";
import { useTypewriter } from "./use-typewriter.js";

const BUTTON_CLASSES = cn(
  "m-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center rounded-full border border-solid border-border bg-background px-5 shadow-sm dark:bg-card",
  "font-mono text-sm whitespace-nowrap text-foreground select-none",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:bg-accent",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:opacity-50",
);

export const TypewriterButton = ({
  label,
  charDuration = 75,
  autoStart = false,
  sound = true,
  onComplete,
  className,
  type = "button",
  onClick,
  ...props
}: TypewriterButtonProps) => {
  const { text, typing, start } = useTypewriter({
    label,
    charDuration,
    autoStart,
    sound,
    onComplete,
  });

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    start();
    onClick?.(event);
  };

  return (
    <button
      type={type}
      aria-label={label}
      data-slot="typewriter-button"
      data-typing={typing ? "" : undefined}
      className={cn(BUTTON_CLASSES, className)}
      onClick={handleClick}
      {...props}
    >
      <span aria-hidden="true" className="relative inline-flex items-center">
        {/* 不可见的完整文字，只用来占住宽度 */}
        <span className="invisible">{label}</span>
        <span className="absolute inset-0 flex items-center">
          <span data-testid="typewriter-text">{text}</span>
          <span
            data-slot="typewriter-caret"
            className="ml-px h-[1.1em] w-px bg-current opacity-0 in-data-typing:animate-pulse in-data-typing:opacity-100 motion-reduce:animate-none"
          />
        </span>
      </span>
    </button>
  );
};
