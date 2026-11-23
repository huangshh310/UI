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
import type {
  TypewriterButtonProps,
  TypewriterButtonVariant,
  TypewriterCursorStyle,
} from "./typewriter-button.types.js";
import {
  CARET_STYLE_CLASSES,
  PREFIX_TONE_CLASSES,
  typewriterButtonVariants,
} from "./typewriter-button.variants.js";
import { useTypewriter } from "./use-typewriter.js";

interface TypewriterContentProps {
  label: string;
  text: string;
  prefix?: string | undefined;
  variant: TypewriterButtonVariant;
  cursorStyle: TypewriterCursorStyle;
}

const TypewriterContent = ({
  label,
  text,
  prefix,
  variant,
  cursorStyle,
}: TypewriterContentProps) => (
  <>
    {prefix && (
      <span
        aria-hidden="true"
        data-slot="typewriter-prefix"
        className={PREFIX_TONE_CLASSES[variant]}
      >
        {prefix}
      </span>
    )}
    <span aria-hidden="true" className="relative inline-flex items-center">
      {/* 不可见的完整文字，只用来占住宽度 */}
      <span className="invisible">{label}</span>
      <span className="absolute inset-0 flex items-center">
        <span data-testid="typewriter-text">{text}</span>
        <span
          data-slot="typewriter-caret"
          className={cn(
            "opacity-0 in-data-typing:animate-pulse in-data-typing:opacity-100 motion-reduce:animate-none",
            CARET_STYLE_CLASSES[cursorStyle],
          )}
        />
      </span>
    </span>
  </>
);

export const TypewriterButton = ({
  label,
  variant = "outline",
  size = "md",
  radius = "pill",
  prefix,
  cursorStyle = "line",
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
      data-variant={variant}
      data-size={size}
      data-radius={radius}
      data-typing={typing ? "" : undefined}
      className={cn(typewriterButtonVariants({ variant, size, radius }), className)}
      onClick={handleClick}
      {...props}
    >
      <TypewriterContent
        label={label}
        text={text}
        prefix={prefix}
        variant={variant}
        cursorStyle={cursorStyle}
      />
    </button>
  );
};
