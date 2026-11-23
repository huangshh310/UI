"use client";

/**
 * StretchSwitch：按压时滑块沿目标方向弹性拉伸、松手后以弹簧回弹到位的开关。
 * 交互行为、键盘操作与表单语义由 Base UI 的 Switch 提供；拉伸与弹簧物理由 motion 驱动。
 */
import { Switch } from "@base-ui/react/switch";
import { cn } from "@matt-ui/utils";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import type {
  StretchSwitchProps,
  StretchSwitchSize,
  StretchSwitchTone,
  StretchSwitchVariant,
} from "./stretch-switch.types.js";
import {
  SWITCH_GEOMETRY,
  SWITCH_THUMB_BASE,
  SWITCH_TONE_CLASSES,
  SWITCH_TRACK_BASE,
  SWITCH_WRAPPER_VARIANTS,
  type SwitchGeometry,
} from "./stretch-switch.variants.js";

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
