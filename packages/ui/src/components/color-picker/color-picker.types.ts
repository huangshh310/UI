/**
 * ColorPicker 的公开类型定义：多色彩空间拾色器、预设色板与色值输入契约。
 */

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
