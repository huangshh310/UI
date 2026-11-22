// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * TypewriterButton：点击后把文字逐字重新打出来的按钮。
 *
 * 可访问名称始终是完整的 label，逐字变化的部分对辅助技术隐藏，
 * 屏幕阅读器不会把打字过程读成一串零碎的字符。
 * 按钮的宽度由一份不可见的完整文字撑住，打字过程中不会跳动。
 * 用户要求减少动态效果时光标不闪烁。
 */

import { cn } from "@/lib/utils";
import { type ComponentProps, type MouseEvent, useEffect, useRef, useState } from "react";

export interface TypewriterButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** 按钮上的文字，逐字显示的就是它 */
  label: string;
  /** 每个字符之间的间隔，单位毫秒，默认 75 */
  charDuration?: number;
  /** 挂载后是否立即开始打字，默认否 */
  autoStart?: boolean;
  /** 全部字符显示完后调用 */
  onComplete?: () => void;
}
interface TypewriterOptions {
  label: string;
  charDuration: number;
  autoStart: boolean;
  onComplete?: (() => void) | undefined;
}

const useTypewriter = ({ label, charDuration, autoStart, onComplete }: TypewriterOptions) => {
  // 可见的字符数；未开始打字时显示全部
  const [visible, setVisible] = useState(autoStart ? 0 : label.length);
  // 第几轮打字；0 表示还没有开始过。每次重新开始都加一，用来重启定时器
  const [run, setRun] = useState(autoStart ? 1 : 0);
  const [typing, setTyping] = useState(autoStart);
  // 用 ref 保存回调，回调变化不会打断正在进行的打字
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (run === 0) return undefined;
    // 一轮打字只用一个定时器，推进不依赖组件重新渲染
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= label.length) {
        clearInterval(timer);
        setTyping(false);
        onCompleteRef.current?.();
      }
    }, charDuration);
    // 组件卸载或重新开始时停掉定时器
    return () => clearInterval(timer);
  }, [run, label.length, charDuration]);

  /** 从头开始打字 */
  const start = () => {
    setVisible(0);
    setTyping(true);
    setRun((current) => current + 1);
  };

  return { text: label.slice(0, visible), typing, start };
};
export const TypewriterButton = ({
  label,
  charDuration = 75,
  autoStart = false,
  onComplete,
  className,
  type = "button",
  onClick,
  ...props
}: TypewriterButtonProps) => {
  const { text, typing, start } = useTypewriter({ label, charDuration, autoStart, onComplete });

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
      className={cn(
        "m-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center rounded-full border border-solid border-input bg-transparent px-5",
        "font-mono text-sm whitespace-nowrap text-foreground select-none",
        "transition-colors duration-(--ui-duration-fast) hover:bg-accent",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
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
