"use client";

/**
 * LiquidToggle：滑块移动时像一滴液体那样沿方向拉长、到位后回弹成圆形的开关。
 *
 * 语义上是 role="switch" 的原生按钮：空格与 Enter 切换，aria-checked 表示状态。
 * 支持受控（checked + onCheckedChange）与非受控（defaultChecked）两种用法。
 * 用户要求减少动态效果时滑块直接到位，不做形变。
 */
import { cn } from "@matt-ui/utils";
import { animate, motion, useReducedMotion } from "motion/react";
import { useRef, useState, type MouseEvent } from "react";
import {
  TOGGLE_SIZE_CONFIG,
  TOGGLE_TONE_CONFIG,
  TOGGLE_TRACK_BASE,
  TOGGLE_VARIANT_CLASSES,
} from "./liquid-toggle.styles.js";
import type { LiquidToggleProps } from "./liquid-toggle.types.js";

const THUMB_SHADOW =
  "block rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.22),0_1px_1px_rgba(0,0,0,0.1)] transition-colors duration-(--ui-duration-normal)";

/** 播放液滴形变：中途沿移动方向拉长、垂直压扁，到位后恢复 */
const animateSquash = (element: HTMLSpanElement | null, reduceMotion: boolean | null) => {
  if (reduceMotion || !element) return;
  animate(element, { scaleX: [1, 1.45, 1], scaleY: [1, 0.78, 1] }, { duration: 0.38 });
};

const DEFAULTS = {
  defaultChecked: false,
  size: "md",
  tone: "signal",
  variant: "filled",
} as const;

const useLiquidToggle = (p: LiquidToggleProps) => {
  const reduceMotion = useReducedMotion();
  const [internal, setInternal] = useState(p.defaultChecked ?? false);
  const on = p.checked ?? internal;
  const thumb = useRef<HTMLSpanElement>(null);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    p.onClick?.(event);
    animateSquash(thumb.current, reduceMotion);
    if (p.checked === undefined) setInternal(!on);
    p.onCheckedChange?.(!on);
  };

  return { on, thumb, reduceMotion, toggle };
};

export const LiquidToggle = (inputProps: LiquidToggleProps) => {
  const merged = { ...DEFAULTS, ...inputProps };
  const { on, thumb, reduceMotion, toggle } = useLiquidToggle(merged);
  const {
    checked: _,
    defaultChecked: _d,
    onCheckedChange: _o,
    size,
    tone,
    variant,
    className,
    onClick: _c,
    ...rest
  } = merged;
  const sizeTokens = TOGGLE_SIZE_CONFIG[size];
  const toneTokens = TOGGLE_TONE_CONFIG[tone];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      data-slot="liquid-toggle"
      data-state={on ? "on" : "off"}
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      className={cn(
        TOGGLE_TRACK_BASE,
        TOGGLE_VARIANT_CLASSES[variant],
        sizeTokens.track,
        toneTokens.trackOn,
        className,
      )}
      onClick={toggle}
      {...rest}
    >
      <motion.span
        aria-hidden="true"
        data-slot="liquid-toggle-thumb"
        className={cn(THUMB_SHADOW, sizeTokens.thumb, toneTokens.thumb)}
        ref={thumb}
        initial={false}
        animate={{ x: on ? sizeTokens.travelPx : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </button>
  );
};
