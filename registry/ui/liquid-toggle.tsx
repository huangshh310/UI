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

/** 开关尺寸 */
export type LiquidToggleSize = "sm" | "md" | "lg";

/** 开启状态的语义色调 */
export type LiquidToggleTone = "signal" | "primary" | "emerald" | "destructive";

/** 轨道外观变体 */
export type LiquidToggleVariant = "filled" | "subtle";

export interface LiquidToggleProps extends Omit<ComponentProps<"button">, "children" | "onChange"> {
  /** 受控的开关状态 */
  checked?: boolean;
  /** 非受控时的初始状态，默认关 */
  defaultChecked?: boolean;
  /** 状态变化时调用，参数是新状态 */
  onCheckedChange?: (checked: boolean) => void;
  /** 开关尺寸，默认 md */
  size?: LiquidToggleSize;
  /** 开启状态的语义色调，默认 signal */
  tone?: LiquidToggleTone;
  /** 轨道外观变体，默认 filled */
  variant?: LiquidToggleVariant;
}
const TOGGLE_TRACK_BASE =
  "relative m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center rounded-full border-0 transition-[background-color,box-shadow] duration-(--ui-duration-normal) ease-out outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45";

const TOGGLE_VARIANT_CLASSES: Record<LiquidToggleVariant, string> = {
  filled: "bg-input shadow-[inset_0_1px_2px_rgba(0,0,0,0.16)]",
  subtle:
    "bg-secondary shadow-[inset_0_0_0_1px_var(--ui-input)] data-[state=on]:shadow-[inset_0_1px_2px_rgba(0,0,0,0.14)]",
};

interface LiquidToggleSizeTokens {
  track: string;
  thumb: string;
  travelPx: number;
}

const TOGGLE_SIZE_CONFIG: Record<LiquidToggleSize, LiquidToggleSizeTokens> = {
  sm: { track: "h-6 w-11 p-0.5", thumb: "size-5", travelPx: 20 },
  md: { track: "h-8 w-14 p-1", thumb: "size-6", travelPx: 24 },
  lg: { track: "h-9 w-16 p-1", thumb: "size-7", travelPx: 28 },
};

interface LiquidToggleToneTokens {
  trackOn: string;
  thumb: string;
}

const TOGGLE_TONE_CONFIG: Record<LiquidToggleTone, LiquidToggleToneTokens> = {
  signal: {
    trackOn: "data-[state=on]:bg-signal",
    thumb: "bg-signal-foreground",
  },
  primary: {
    trackOn: "data-[state=on]:bg-primary",
    thumb: "bg-white in-data-[state=on]:bg-primary-foreground",
  },
  emerald: {
    trackOn: "data-[state=on]:bg-emerald-600 dark:data-[state=on]:bg-emerald-500",
    thumb: "bg-white",
  },
  destructive: {
    trackOn: "data-[state=on]:bg-destructive",
    thumb: "bg-white in-data-[state=on]:bg-destructive-foreground",
  },
};
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
