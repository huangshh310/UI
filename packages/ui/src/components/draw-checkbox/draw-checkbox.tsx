"use client";

/**
 * DrawCheckbox：勾选时对勾沿 SVG 路径平滑绘制出来的复选框。
 * 内置完整的无障碍复选框语义与键盘空格切换，支持行内、卡片、胶囊、列表行与待办划线模式。
 */
import { Checkbox } from "@base-ui/react/checkbox";
import { cn } from "@matt-ui/utils";
import { useId, type ReactNode } from "react";
import {
  CheckboxError,
  CheckGlyph,
  LabelContent,
  LeadingIcon,
  TrailingMeta,
} from "./draw-checkbox-parts.js";
import type {
  DrawCheckboxControlPosition,
  DrawCheckboxProps,
  DrawCheckboxShape,
  DrawCheckboxSize,
  DrawCheckboxTone,
  DrawCheckboxVariant,
} from "./draw-checkbox.types.js";
import { drawCheckboxBoxVariants, drawCheckboxItemVariants } from "./draw-checkbox.variants.js";

const resolveConfig = (props: DrawCheckboxProps) => ({
  variant: (props.variant ?? "default") as DrawCheckboxVariant,
  shape: (props.shape ?? "rounded") as DrawCheckboxShape,
  size: (props.size ?? "md") as DrawCheckboxSize,
  tone: (props.tone ?? "primary") as DrawCheckboxTone,
  controlPosition: (props.controlPosition ?? "left") as DrawCheckboxControlPosition,
  indeterminate: Boolean(props.indeterminate),
});

const stripVisualProps = (props: DrawCheckboxProps) => {
  const {
    id: _id,
    variant: _variant,
    shape: _shape,
    size: _size,
    tone: _tone,
    controlPosition: _pos,
    label: _label,
    description: _desc,
    icon: _icon,
    badge: _badge,
    trailing: _trailing,
    strikethrough: _strike,
    error: _error,
    indeterminate: _indet,
    onCheckedChange: _onChange,
    className: _className,
    "aria-label": _ariaLabel,
    ...checkboxProps
  } = props;
  return checkboxProps;
};

const CheckboxControl = ({
  props,
  controlId,
  errorId,
  alignStart,
}: {
  props: DrawCheckboxProps;
  controlId: string;
  errorId: string;
  alignStart: boolean;
}) => {
  const { shape, size, tone, indeterminate } = resolveConfig(props);
  const invalid = Boolean(props.error);

  return (
    <Checkbox.Root
      {...stripVisualProps(props)}
      id={controlId}
      indeterminate={indeterminate}
      aria-label={props.label ? undefined : props["aria-label"]}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? errorId : undefined}
      onCheckedChange={(next) => props.onCheckedChange?.(next)}
      data-slot="draw-checkbox"
      data-shape={shape}
      data-size={size}
      data-invalid={invalid ? "" : undefined}
      className={cn(
        drawCheckboxBoxVariants({ size, shape, tone }),
        alignStart && "mt-0.5",
        !props.label && props.className,
      )}
    >
      <Checkbox.Indicator keepMounted className="inline-flex items-center justify-center">
        <CheckGlyph indeterminate={indeterminate} size={size} />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
};

const LabeledCheckbox = ({
  props,
  controlId,
  align,
  control,
}: {
  props: DrawCheckboxProps;
  controlId: string;
  align: "start" | "center";
  control: ReactNode;
}) => {
  const { variant, size, tone, controlPosition } = resolveConfig(props);

  return (
    <label
      htmlFor={controlId}
      data-slot="draw-checkbox-item"
      data-variant={variant}
      data-disabled={props.disabled ? "" : undefined}
      data-invalid={props.error ? "" : undefined}
      data-strikethrough={props.strikethrough ? "" : undefined}
      className={cn(drawCheckboxItemVariants({ variant, tone, align }), props.className)}
    >
      {controlPosition === "left" && control}
      <LeadingIcon icon={props.icon} variant={variant} />
      <LabelContent
        label={props.label ?? ""}
        description={props.description}
        badge={props.badge}
        size={size}
      />
      <TrailingMeta trailing={props.trailing} />
      {controlPosition === "right" && control}
    </label>
  );
};

export const DrawCheckbox = (props: DrawCheckboxProps) => {
  const autoId = useId();
  const controlId = props.id ?? autoId;
  const errorId = `${controlId}-error`;
  const { variant } = resolveConfig(props);
  const align = variant === "pill" || !props.description ? "center" : "start";
  const control = (
    <CheckboxControl
      props={props}
      controlId={controlId}
      errorId={errorId}
      alignStart={Boolean(props.description) && align === "start"}
    />
  );

  const body = props.label ? (
    <LabeledCheckbox props={props} controlId={controlId} align={align} control={control} />
  ) : (
    control
  );

  if (!props.error) return body;

  const isInline = !props.label || variant === "default" || variant === "pill";
  return (
    <div className={cn("flex flex-col gap-1.5", isInline && "inline-flex")}>
      {body}
      <CheckboxError id={errorId} error={props.error} />
    </div>
  );
};
