"use client";

/**
 * ColorPicker：多色彩空间拾色器。
 * 支持 HSV / HSL / sRGB / OKLCH 二维色盘、色域自动裁剪、色相与不透明度滑轨、预设色板与色值输入。
 */
import { cn } from "@matt-ui/utils";
import { ColorPicker as SdkColorPicker } from "@ui-sdk/react/color-picker";
import { useId } from "react";
import {
  PickerChannelGrid,
  PickerHeader,
  PickerPresetRow,
  PickerSurfaceAndSliders,
  PickerValueRow,
} from "./color-picker-1-parts.js";
import type { ColorPickerProps } from "./color-picker.types.js";
import { COLOR_PICKER_SHELL_CLASS } from "./color-picker.variants.js";

const resolveAriaLabel = (label?: string, ariaLabel?: string) => {
  if (ariaLabel) return ariaLabel;
  return label ? undefined : "颜色选择器";
};

const resolveDefaultValue = (value?: string, defaultValue?: string) => {
  if (value !== undefined) return undefined;
  return defaultValue ?? "#2563eb";
};

export const ColorPicker = (props: ColorPickerProps) => {
  const labelId = useId();
  const space = props.space ?? "hsv";
  const showInput = props.showInput ?? true;
  const hasPresets = Boolean(props.presets && props.presets.length > 0);

  return (
    <SdkColorPicker
      aria-label={resolveAriaLabel(props.label, props.ariaLabel)}
      aria-labelledby={props.label ? labelId : undefined}
      value={props.value}
      defaultValue={resolveDefaultValue(props.value, props.defaultValue)}
      space={space}
      format={props.format}
      gamut={props.gamut}
      name={props.name}
      disabled={props.disabled}
      readOnly={props.readOnly}
      onValueChange={(next) => props.onValueChange?.(next)}
      onValueCommit={(next) => props.onValueCommit?.(next)}
      className={cn(COLOR_PICKER_SHELL_CLASS, props.className)}
    >
      <PickerHeader label={props.label} labelId={labelId} space={space} />
      <PickerSurfaceAndSliders space={space} showAlpha={props.showAlpha} />
      <PickerValueRow showInput={showInput} showEyeDropper={props.showEyeDropper} />
      {props.showChannelInputs && <PickerChannelGrid space={space} showAlpha={props.showAlpha} />}
      {hasPresets && <PickerPresetRow presets={props.presets!} presetsLabel={props.presetsLabel} />}
    </SdkColorPicker>
  );
};
