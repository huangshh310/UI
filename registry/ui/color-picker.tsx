// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * ColorPicker：多色彩空间拾色器。
 * 支持 HSV / HSL / sRGB / OKLCH 二维色盘、色域自动裁剪、色相与不透明度滑轨、预设色板与色值输入。
 */

import { cn } from "@/lib/utils";
import {
  ColorPicker as SdkColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatchItem,
  ColorPickerSwatches,
  type ColorChannel,
} from "@ui-sdk/react/color-picker";
import { Pipette } from "lucide-react";
import { useId } from "react";

export const COLOR_PICKER_SHELL_CLASS =
  "flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-solid border-border bg-card p-3.5 font-sans text-card-foreground shadow-2xs data-[disabled]:opacity-55";

export const COLOR_AREA_CLASS =
  "relative h-40 w-full cursor-crosshair overflow-hidden rounded-xl border border-solid border-border/80 bg-muted/30 [background:var(--color-area-background)] data-[disabled]:cursor-not-allowed";

export const COLOR_AREA_THUMB_CLASS =
  "size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_2px_4px_rgba(0,0,0,0.25)] outline-none [background:var(--color-picker-color)] focus-visible:ring-2 focus-visible:ring-ring data-[out-of-gamut]:border-dashed";

export const COLOR_SLIDER_TRACK_CLASS =
  "relative h-3.5 w-full cursor-pointer rounded-full border border-solid border-border/75 [background:var(--color-slider-background)] data-[disabled]:cursor-not-allowed";

export const COLOR_SLIDER_THUMB_CLASS =
  "top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid border-white bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.25)] outline-none focus-visible:ring-2 focus-visible:ring-ring";

export const COLOR_SWATCH_PREVIEW_CLASS =
  "size-8 shrink-0 rounded-lg border border-solid border-border shadow-2xs [background:var(--color-picker-color)]";

export const COLOR_HEX_INPUT_CLASS =
  "h-8 min-w-0 flex-1 rounded-lg border border-solid border-input bg-background px-2.5 font-mono text-xs text-foreground outline-none transition-[border-color,box-shadow] duration-(--ui-duration-fast) focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed";

export const COLOR_CHANNEL_INPUT_CLASS =
  "h-7 w-full min-w-0 rounded-md border border-solid border-input bg-background px-1.5 text-center font-mono text-[11px] text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed";

export const COLOR_EYEDROPPER_BTN_CLASS =
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-solid border-border bg-background text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 data-[unsupported]:hidden";

export const COLOR_PRESET_LIST_CLASS = "flex flex-wrap items-center gap-1.5 outline-none";

export const COLOR_PRESET_ITEM_CLASS =
  "size-6 cursor-pointer rounded-md border border-solid border-border/80 shadow-2xs transition-transform duration-(--ui-duration-fast) outline-none [background:var(--color-picker-color)] hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring data-[selected]:ring-2 data-[selected]:ring-foreground data-[selected]:ring-offset-1 data-[selected]:ring-offset-background disabled:cursor-not-allowed";
export type ColorSpaceMode = "hsv" | "hsl" | "srgb" | "oklch";

export type ColorOutputFormat = "hex" | "hsl" | "srgb" | "oklch";

export type ColorGamutBoundary = "srgb" | "p3" | false;

export interface ColorPickerProps {
  /** 受控 CSS 色值字符串 */
  value?: string;
  /** 非受控初始 CSS 色值字符串，默认 #2563eb */
  defaultValue?: string;
  /** 拖拽或按键过程中的实时色值回调 */
  onValueChange?: (value: string) => void;
  /** 交互结束或回车提交时的色值确认回调 */
  onValueCommit?: (value: string) => void;
  /** 编辑色彩空间，默认 hsv */
  space?: ColorSpaceMode;
  /** 输出色值格式 */
  format?: ColorOutputFormat;
  /** 色域边界裁剪策略，默认 srgb */
  gamut?: ColorGamutBoundary;
  /** 是否展示透明度滑轨 */
  showAlpha?: boolean;
  /** 是否展示底部色块预览与 CSS 色值输入框，默认 true */
  showInput?: boolean;
  /** 是否展示数值通道输入框 */
  showChannelInputs?: boolean;
  /** 是否展示屏幕吸管取色按钮 */
  showEyeDropper?: boolean;
  /** 预设色值数组 */
  presets?: string[];
  /** 预设色板无障碍名称，默认「预设色板」 */
  presetsLabel?: string;
  /** 可见标题文案 */
  label?: string;
  /** 无障碍分组名称 */
  ariaLabel?: string;
  /** 表单字段名 */
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}
const SPACE_CHANNELS: Record<
  ColorSpaceMode,
  { primarySlider: ColorChannel; list: ColorChannel[] }
> = {
  hsv: { primarySlider: "hue", list: ["hue", "saturation", "brightness"] },
  hsl: { primarySlider: "hue", list: ["hue", "saturation", "lightness"] },
  srgb: { primarySlider: "blue", list: ["red", "green", "blue"] },
  oklch: { primarySlider: "hue", list: ["lightness", "chroma", "hue"] },
};

const CHANNEL_SHORT_LABEL: Record<string, string> = {
  hue: "H",
  saturation: "S",
  brightness: "V",
  lightness: "L",
  chroma: "C",
  red: "R",
  green: "G",
  blue: "B",
  alpha: "A",
};

const PickerHeader = ({
  label,
  labelId,
  space,
}: {
  label?: string;
  labelId: string;
  space: ColorSpaceMode;
}) => {
  if (!label) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span id={labelId} className="text-xs font-medium text-foreground">
        {label}
      </span>
      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
        {space}
      </span>
    </div>
  );
};

const PickerSurfaceAndSliders = ({
  space,
  showAlpha,
}: {
  space: ColorSpaceMode;
  showAlpha?: boolean;
}) => {
  const needsCanvas = space === "oklch" || space === "srgb";
  const primaryChannel = SPACE_CHANNELS[space].primarySlider;

  return (
    <>
      <ColorPickerArea className={COLOR_AREA_CLASS}>
        {needsCanvas && <ColorPickerAreaCanvas />}
        <ColorPickerAreaThumb aria-label="二维色盘调节" className={COLOR_AREA_THUMB_CLASS} />
      </ColorPickerArea>
      <div className="flex flex-col gap-2.5">
        <ColorPickerSlider channel={primaryChannel} className={COLOR_SLIDER_TRACK_CLASS}>
          <ColorPickerSliderThumb
            aria-label={primaryChannel === "blue" ? "蓝色通道" : "色相调节"}
            className={COLOR_SLIDER_THUMB_CLASS}
          />
        </ColorPickerSlider>
        {showAlpha && (
          <ColorPickerSlider channel="alpha" className={COLOR_SLIDER_TRACK_CLASS}>
            <ColorPickerSliderThumb
              aria-label="不透明度调节"
              className={COLOR_SLIDER_THUMB_CLASS}
            />
          </ColorPickerSlider>
        )}
      </div>
    </>
  );
};

const PickerValueRow = ({
  showInput,
  showEyeDropper,
}: {
  showInput: boolean;
  showEyeDropper?: boolean;
}) => {
  if (!showInput && !showEyeDropper) return null;
  return (
    <div className="flex items-center gap-2">
      <ColorPickerSwatch aria-label="当前颜色预览" className={COLOR_SWATCH_PREVIEW_CLASS} />
      {showInput && <ColorPickerInput aria-label="颜色值输入" className={COLOR_HEX_INPUT_CLASS} />}
      {showEyeDropper && (
        <ColorPickerEyeDropper aria-label="屏幕取色" className={COLOR_EYEDROPPER_BTN_CLASS}>
          <Pipette aria-hidden="true" className="size-3.5" />
        </ColorPickerEyeDropper>
      )}
    </div>
  );
};

const PickerChannelGrid = ({
  space,
  showAlpha,
}: {
  space: ColorSpaceMode;
  showAlpha?: boolean;
}) => {
  const channels: ColorChannel[] = showAlpha
    ? [...SPACE_CHANNELS[space].list, "alpha"]
    : SPACE_CHANNELS[space].list;

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {channels.map((ch) => (
        <div key={ch} className="flex flex-col items-center gap-1">
          <ColorPickerChannelInput
            channel={ch}
            aria-label={`${CHANNEL_SHORT_LABEL[ch] ?? ch} 通道数值`}
            className={COLOR_CHANNEL_INPUT_CLASS}
          />
          <span className="font-mono text-[10px] text-muted-foreground">
            {CHANNEL_SHORT_LABEL[ch] ?? ch}
          </span>
        </div>
      ))}
    </div>
  );
};

const PickerPresetRow = ({
  presets,
  presetsLabel,
}: {
  presets: string[];
  presetsLabel?: string;
}) => (
  <ColorPickerSwatches aria-label={presetsLabel ?? "预设色板"} className={COLOR_PRESET_LIST_CLASS}>
    {presets.map((color) => (
      <ColorPickerSwatchItem key={color} value={color} className={COLOR_PRESET_ITEM_CLASS} />
    ))}
  </ColorPickerSwatches>
);
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
