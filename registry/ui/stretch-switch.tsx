// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * StretchSwitch：按压时滑块沿目标方向弹性拉伸、松手后以弹簧回弹到位的开关。
 * 交互行为、键盘操作与表单语义由 Base UI 的 Switch 提供；拉伸与弹簧物理由 motion 驱动。
 */

import { cn } from "@/lib/utils";
import { Switch } from "@base-ui/react/switch";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId, useState } from "react";

export interface StretchSwitchProps {
  id?: string;
  name?: string;
  value?: string;
  /** 开关旁的标签文字 */
  label?: string;
  /** 标签下方的补充说明 */
  description?: string;
  /** 受控开启状态 */
  checked?: boolean;
  /** 非受控初始开启状态，默认否 */
  defaultChecked?: boolean;
  /** 开启态轨道底色：默认 primary，需要唯一视觉强调时可选 signal */
  tone?: "primary" | "signal";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}
const SPRING = { type: "spring", stiffness: 540, damping: 32 } as const;
const THUMB_REST = 18;
const THUMB_STRETCH = 23;
const TRAVEL = 20;

const TRACK_BASE = cn(
  "relative m-0 box-border inline-flex h-6 w-11 shrink-0 cursor-pointer appearance-none items-center rounded-full border border-solid border-border bg-secondary p-[2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
  "transition-[background-color,border-color] duration-(--ui-duration-normal) outline-none",
  "hover:border-foreground/22 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
);

const TONE_CLASSES: Record<NonNullable<StretchSwitchProps["tone"]>, string> = {
  primary: "data-checked:border-transparent data-checked:bg-primary data-checked:shadow-none",
  signal:
    "data-checked:border-transparent data-checked:bg-signal data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
};

const computeThumbGeometry = (on: boolean, pressed: boolean, blockStretch: boolean) => {
  const width = pressed && !blockStretch ? THUMB_STRETCH : THUMB_REST;
  const x = on ? TRAVEL - (width - THUMB_REST) : 0;
  return { x, width };
};

const useStretchState = (
  checked: boolean | undefined,
  defaultChecked: boolean,
  onCheckedChange: ((checked: boolean) => void) | undefined,
  blockStretch: boolean,
) => {
  const [internal, setInternal] = useState(defaultChecked);
  const [pressed, setPressed] = useState(false);
  const on = checked ?? internal;
  const handleChange = (next: boolean) => {
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  };

  return {
    ...computeThumbGeometry(on, pressed, blockStretch),
    handleChange,
    pressHandlers: {
      onPointerDown: () => setPressed(true),
      onPointerUp: () => setPressed(false),
      onPointerLeave: () => setPressed(false),
      onPointerCancel: () => setPressed(false),
    },
  };
};

const SwitchLabel = ({
  htmlFor,
  label,
  description,
  disabled,
  className,
  children,
}: {
  htmlFor: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    data-disabled={disabled ? "" : undefined}
    className={cn(
      "inline-flex cursor-pointer items-center gap-3 font-sans select-none data-disabled:cursor-not-allowed data-disabled:opacity-60",
      className,
    )}
  >
    {children}
    <span className="flex flex-col gap-0.5">
      <span className="text-[13px] leading-snug font-medium text-foreground">{label}</span>
      {description && (
        <span className="text-xs leading-relaxed text-muted-foreground">{description}</span>
      )}
    </span>
  </label>
);

const StretchThumb = ({
  x,
  width,
  tone,
  reduceMotion,
}: {
  x: number;
  width: number;
  tone: NonNullable<StretchSwitchProps["tone"]>;
  reduceMotion: boolean;
}) => (
  <Switch.Thumb
    data-slot="stretch-switch-thumb"
    render={
      <motion.span animate={{ x, width }} transition={reduceMotion ? { duration: 0 } : SPRING} />
    }
    className={cn(
      "block h-[18px] rounded-full bg-signal-foreground shadow-sm ring-1 ring-black/8",
      tone === "primary" && "data-checked:bg-primary-foreground data-checked:ring-0",
    )}
  />
);

export const StretchSwitch = ({
  id,
  label,
  description,
  checked,
  defaultChecked = false,
  tone = "primary",
  onCheckedChange,
  className,
  "aria-label": ariaLabel,
  ...rest
}: StretchSwitchProps) => {
  const autoId = useId();
  const controlId = id ?? autoId;
  const reduceMotion = Boolean(useReducedMotion());
  const block = Boolean(rest.disabled || rest.readOnly || reduceMotion);
  const state = useStretchState(checked, defaultChecked, onCheckedChange, block);

  const control = (
    <Switch.Root
      id={controlId}
      checked={checked}
      defaultChecked={defaultChecked}
      aria-label={label ? undefined : ariaLabel}
      onCheckedChange={state.handleChange}
      data-slot="stretch-switch"
      className={cn(TRACK_BASE, TONE_CLASSES[tone], !label && className)}
      {...state.pressHandlers}
      {...rest}
    >
      <StretchThumb x={state.x} width={state.width} tone={tone} reduceMotion={reduceMotion} />
    </Switch.Root>
  );

  if (!label) return control;
  return (
    <SwitchLabel
      htmlFor={controlId}
      label={label}
      description={description}
      disabled={rest.disabled}
      className={className}
    >
      {control}
    </SwitchLabel>
  );
};
