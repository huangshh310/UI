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

export interface SwitchGeometry {
  rest: number;
  stretch: number;
  travel: number;
  trackClass: string;
  thumbClass: string;
}

export const SWITCH_GEOMETRY: Record<StretchSwitchSize, SwitchGeometry> = {
  sm: {
    rest: 14,
    stretch: 18,
    travel: 16,
    trackClass: "h-5 w-9 p-[2px]",
    thumbClass: "h-3.5",
  },
  md: {
    rest: 18,
    stretch: 23,
    travel: 20,
    trackClass: "h-6 w-11 p-[2px]",
    thumbClass: "h-[18px]",
  },
  lg: {
    rest: 22,
    stretch: 28,
    travel: 24,
    trackClass: "h-7 w-13 p-[2px]",
    thumbClass: "h-[22px]",
  },
};

export const SWITCH_TRACK_BASE =
  "relative m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center rounded-full border border-solid border-input/45 bg-secondary shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] transition-[background-color,border-color,box-shadow] duration-(--ui-duration-normal) outline-none hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid data-disabled:pointer-events-none data-disabled:opacity-50 dark:border-white/12 dark:bg-white/12";

export const SWITCH_TONE_CLASSES: Record<StretchSwitchTone, string> = {
  primary: "data-checked:border-transparent data-checked:bg-primary data-checked:shadow-none",
  signal:
    "data-checked:border-transparent data-checked:bg-signal data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
  success:
    "data-checked:border-transparent data-checked:bg-emerald-500 data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]",
};

export const SWITCH_THUMB_BASE =
  "inline-flex items-center justify-center rounded-full bg-white text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.18),0_0.5px_1px_rgba(0,0,0,0.08)]";

export const SWITCH_WRAPPER_VARIANTS: Record<StretchSwitchVariant, string> = {
  default: "inline-flex items-center gap-3",
  card: "flex w-full items-center justify-between gap-4 rounded-2xl border border-solid border-border bg-card px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) hover:border-foreground/20 has-data-checked:border-foreground/25 has-data-checked:bg-secondary/35 dark:has-data-checked:bg-white/[0.04]",
  pill: "inline-flex items-center gap-2.5 rounded-full border border-solid border-border bg-card py-1.5 pr-3.5 pl-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[border-color,background-color] duration-(--ui-duration-fast) hover:border-foreground/22 has-data-checked:border-foreground/25 has-data-checked:bg-secondary/40",
  row: "flex w-full items-center justify-between gap-4 rounded-xl px-2 py-2 transition-colors duration-(--ui-duration-fast) hover:bg-secondary/45",
};
export type StretchSwitchTone = "primary" | "signal" | "success";
export type StretchSwitchSize = "sm" | "md" | "lg";
export type StretchSwitchVariant = "default" | "card" | "pill" | "row";

export interface StretchSwitchProps {
  id?: string;
  name?: string;
  value?: string;
  /** 开关旁的标签文字 */
  label?: string;
  /** 标签下方的补充说明 */
  description?: string;
  /** 标签前的装饰图标 */
  icon?: ReactNode;
  /** 标签旁的紧凑徽章（例如 "推荐" / "Beta" / "已锁定"） */
  badge?: string;
  /** 滑块内部可选微图标（例如日夜切换图标） */
  thumbIcon?: {
    checked?: ReactNode;
    unchecked?: ReactNode;
  };
  /** 视觉形态：基础行内、设置卡片、胶囊开关或全宽设置行 */
  variant?: StretchSwitchVariant;
  /** 开关尺寸：紧凑 sm、默认 md、大号 lg */
  size?: StretchSwitchSize;
  /** 开启态轨道底色：极简黑白 primary、品牌蓝 signal 或 iOS 翡翠绿 success */
  tone?: StretchSwitchTone;
  /** 开关控件相对标签的位置（card/row 默认在右侧，其余默认在左侧） */
  controlPosition?: "left" | "right";
  /** 受控开启状态 */
  checked?: boolean;
  /** 非受控初始开启状态，默认否 */
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}
const SPRING = { type: "spring", stiffness: 540, damping: 32 } as const;

const computeThumbGeometry = (
  geometry: SwitchGeometry,
  on: boolean,
  pressed: boolean,
  blockStretch: boolean,
) => {
  const width = pressed && !blockStretch ? geometry.stretch : geometry.rest;
  const x = on ? geometry.travel - (width - geometry.rest) : 0;
  return { x, width };
};

const useStretchState = (
  size: StretchSwitchSize,
  checked: boolean | undefined,
  defaultChecked: boolean,
  onCheckedChange: ((checked: boolean) => void) | undefined,
  blockStretch: boolean,
) => {
  const [internal, setInternal] = useState(defaultChecked);
  const [pressed, setPressed] = useState(false);
  const on = checked ?? internal;
  const geometry = SWITCH_GEOMETRY[size];
  const handleChange = (next: boolean) => {
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  };

  return {
    on,
    geometry,
    ...computeThumbGeometry(geometry, on, pressed, blockStretch),
    handleChange,
    pressHandlers: {
      onPointerDown: () => setPressed(true),
      onPointerUp: () => setPressed(false),
      onPointerLeave: () => setPressed(false),
      onPointerCancel: () => setPressed(false),
    },
  };
};

const SwitchText = ({
  label,
  description,
  icon,
  badge,
}: {
  label: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
}) => (
  <span className="flex min-w-0 items-center gap-2.5">
    {icon && (
      <span aria-hidden="true" className="inline-flex shrink-0 text-muted-foreground">
        {icon}
      </span>
    )}
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="flex items-center gap-1.5">
        <span className="text-[13px] leading-snug font-medium text-foreground">{label}</span>
        {badge && (
          <span className="rounded-full bg-secondary px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium text-secondary-foreground">
            {badge}
          </span>
        )}
      </span>
      {description && (
        <span className="text-xs leading-relaxed text-muted-foreground">{description}</span>
      )}
    </span>
  </span>
);

const SwitchLabelWrapper = ({
  htmlFor,
  variant,
  controlPosition,
  label,
  description,
  icon,
  badge,
  disabled,
  className,
  children,
}: {
  htmlFor: string;
  variant: StretchSwitchVariant;
  controlPosition: "left" | "right";
  label: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    data-disabled={disabled ? "" : undefined}
    className={cn(
      "cursor-pointer font-sans select-none data-disabled:cursor-not-allowed data-disabled:opacity-60",
      SWITCH_WRAPPER_VARIANTS[variant],
      className,
    )}
  >
    {controlPosition === "left" && children}
    <SwitchText label={label} description={description} icon={icon} badge={badge} />
    {controlPosition === "right" && children}
  </label>
);

const StretchThumb = ({
  x,
  width,
  thumbClass,
  tone,
  on,
  thumbIcon,
  reduceMotion,
}: {
  x: number;
  width: number;
  thumbClass: string;
  tone: StretchSwitchTone;
  on: boolean;
  thumbIcon?: StretchSwitchProps["thumbIcon"];
  reduceMotion: boolean;
}) => (
  <Switch.Thumb
    data-slot="stretch-switch-thumb"
    render={
      <motion.span animate={{ x, width }} transition={reduceMotion ? { duration: 0 } : SPRING}>
        {thumbIcon ? (on ? thumbIcon.checked : thumbIcon.unchecked) : null}
      </motion.span>
    }
    className={cn(
      SWITCH_THUMB_BASE,
      thumbClass,
      tone === "primary" && "data-checked:bg-primary-foreground data-checked:text-primary",
    )}
  />
);

const normalizeSwitchConfig = (props: StretchSwitchProps) => {
  const variant = props.variant ?? "default";
  const isTrailing = variant === "card" || variant === "row";
  return {
    variant,
    size: props.size ?? "md",
    tone: props.tone ?? "primary",
    controlPosition: props.controlPosition ?? (isTrailing ? "right" : "left"),
    defaultChecked: props.defaultChecked ?? false,
  };
};

const SwitchTrackControl = ({
  controlId,
  props,
  tone,
  defaultChecked,
  state,
  reduceMotion,
}: {
  controlId: string;
  props: StretchSwitchProps;
  tone: StretchSwitchTone;
  defaultChecked: boolean;
  state: ReturnType<typeof useStretchState>;
  reduceMotion: boolean;
}) => (
  <Switch.Root
    id={controlId}
    name={props.name}
    value={props.value}
    checked={props.checked}
    defaultChecked={defaultChecked}
    disabled={props.disabled}
    readOnly={props.readOnly}
    required={props.required}
    aria-label={props.label ? undefined : props["aria-label"]}
    onCheckedChange={state.handleChange}
    data-slot="stretch-switch"
    className={cn(
      SWITCH_TRACK_BASE,
      state.geometry.trackClass,
      SWITCH_TONE_CLASSES[tone],
      !props.label && props.className,
    )}
    {...state.pressHandlers}
  >
    <StretchThumb
      x={state.x}
      width={state.width}
      thumbClass={state.geometry.thumbClass}
      tone={tone}
      on={state.on}
      thumbIcon={props.thumbIcon}
      reduceMotion={reduceMotion}
    />
  </Switch.Root>
);

export const StretchSwitch = (props: StretchSwitchProps) => {
  const autoId = useId();
  const controlId = props.id ?? autoId;
  const config = normalizeSwitchConfig(props);
  const reduceMotion = Boolean(useReducedMotion());
  const block = Boolean(props.disabled || props.readOnly || reduceMotion);
  const state = useStretchState(
    config.size,
    props.checked,
    config.defaultChecked,
    props.onCheckedChange,
    block,
  );
  const control = (
    <SwitchTrackControl
      controlId={controlId}
      props={props}
      tone={config.tone}
      defaultChecked={config.defaultChecked}
      state={state}
      reduceMotion={reduceMotion}
    />
  );

  if (!props.label) return control;
  return (
    <SwitchLabelWrapper
      htmlFor={controlId}
      variant={config.variant}
      controlPosition={config.controlPosition}
      label={props.label}
      description={props.description}
      icon={props.icon}
      badge={props.badge}
      disabled={props.disabled}
      className={props.className}
    >
      {control}
    </SwitchLabelWrapper>
  );
};
