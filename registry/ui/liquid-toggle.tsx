// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * LiquidToggle：滑块移动时像一滴液体那样沿方向拉长、到位后回弹成圆形的开关。
 *
 * 语义上是 role="switch" 的原生按钮：空格与 Enter 切换，aria-checked 表示状态。
 * 支持受控（checked + onCheckedChange）与非受控（defaultChecked）两种用法。
 * 用户要求减少动态效果时滑块直接到位，不做形变。
 */

import { cn } from "@/lib/utils";
import { animate, motion, useReducedMotion } from "motion/react";
import { type ComponentProps, type MouseEvent, useRef, useState } from "react";

export interface LiquidToggleProps extends Omit<ComponentProps<"button">, "children" | "onChange"> {
  /** 受控的开关状态 */
  checked?: boolean;
  /** 非受控时的初始状态，默认关 */
  defaultChecked?: boolean;
  /** 状态变化时调用，参数是新状态 */
  onCheckedChange?: (checked: boolean) => void;
}
/** 滑块从左到右移动的距离，等于轨道宽度减去滑块直径与两侧内边距 */
const TRAVEL_PX = 24;

const TRACK_CLASSES = cn(
  "relative m-0 box-border inline-flex h-8 w-14 shrink-0 cursor-pointer appearance-none items-center rounded-full border-0 bg-input p-1",
  "transition-colors duration-(--ui-duration-normal) data-[state=on]:bg-signal",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:opacity-50",
);

export const LiquidToggle = ({
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  onClick,
  ...props
}: LiquidToggleProps) => {
  const reduceMotion = useReducedMotion();
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked ?? internal;
  const thumb = useRef<HTMLSpanElement>(null);

  /** 液滴形变：中途沿移动方向拉长、垂直方向压扁，到位后恢复。与位移同时播放 */
  const squash = () => {
    if (reduceMotion || !thumb.current) return;
    animate(thumb.current, { scaleX: [1, 1.45, 1], scaleY: [1, 0.78, 1] }, { duration: 0.38 });
  };

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    squash();
    if (checked === undefined) setInternal(!on);
    onCheckedChange?.(!on);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      data-slot="liquid-toggle"
      data-state={on ? "on" : "off"}
      className={cn(TRACK_CLASSES, className)}
      onClick={toggle}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        data-slot="liquid-toggle-thumb"
        className="block size-6 rounded-full bg-signal-foreground shadow-md"
        ref={thumb}
        initial={false}
        animate={{ x: on ? TRAVEL_PX : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </button>
  );
};
