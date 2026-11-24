/**
 * ColorPicker 内部子部件：按当前色彩空间分发通道滑轨、数值通道输入框与预设色板。
 */
import {
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
  type ColorChannel,
} from "@ui-sdk/react/color-picker";
import { Pipette } from "lucide-react";
import type { ColorSpaceMode } from "./color-picker.types.js";
import {
  COLOR_AREA_CLASS,
  COLOR_AREA_THUMB_CLASS,
  COLOR_CHANNEL_INPUT_CLASS,
  COLOR_EYEDROPPER_BTN_CLASS,
  COLOR_HEX_INPUT_CLASS,
  COLOR_PRESET_ITEM_CLASS,
  COLOR_PRESET_LIST_CLASS,
  COLOR_SLIDER_THUMB_CLASS,
  COLOR_SLIDER_TRACK_CLASS,
  COLOR_SWATCH_PREVIEW_CLASS,
} from "./color-picker.variants.js";

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

export const PickerHeader = ({ label, labelId }: { label?: string; labelId: string }) => {
  if (!label) return null;
  return (
    <span id={labelId} className="text-xs font-medium text-foreground">
      {label}
    </span>
  );
};

export const PickerSurfaceAndSliders = ({
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

export const PickerValueRow = ({
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

export const PickerChannelGrid = ({
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

export const PickerPresetRow = ({
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
