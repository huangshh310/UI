/**
 * ColorPicker 的文档数据：多色彩空间拾色器、OKLCH 色域画布与无障碍说明。
 */
import { ColorPickerBasic } from "@/demos/color-picker/basic";
import { ColorPickerOklch } from "@/demos/color-picker/oklch";
import type { ComponentDoc } from "./registry.types";

export const COLOR_PICKER_DOC: ComponentDoc = {
  slug: "color-picker",
  name: "Color Picker",
  description:
    "多色彩空间拾色器，支持二维色盘、OKLCH 色域画布、色相与不透明度滑轨、键盘导航预设色板及 CSS 色值输入。",
  category: "forms",
  registryName: "color-picker",
  dependencies: ["@ui-sdk/react@0.1.0-beta.13", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { ColorPicker } from "@/components/ui/color-picker";

export function Example() {
  return <ColorPicker label="主题色" defaultValue="#2563eb" />;
}`,
  createdAt: "2026-11-24",
  specimens: [
    {
      slug: "basic",
      name: "品牌色盘与预设色板",
      description: "支持二维饱和度/明度拖拽、色相滑轨、CSS 色值输入校验回退与预设色块快速切换。",
      file: "color-picker/basic.tsx",
      Demo: ColorPickerBasic,
    },
    {
      slug: "oklch",
      name: "OKLCH 色域画布与通道输入",
      description:
        "逐像素绘制 sRGB 可显示色域曲面，搭配不透明度滑轨与 L / C / H / A 四通道数值微调。",
      file: "color-picker/oklch.tsx",
      Demo: ColorPickerOklch,
      directory: false,
    },
  ],
  api: [
    {
      name: "value / defaultValue",
      type: "string",
      defaultValue: '"#2563eb"',
      description: "受控或非受控 CSS 颜色字符串",
    },
    {
      name: "space",
      type: '"hsv" | "hsl" | "srgb" | "oklch"',
      defaultValue: '"hsv"',
      description: "色盘与滑轨所编辑的色彩空间",
    },
    {
      name: "showAlpha / showChannelInputs",
      type: "boolean",
      defaultValue: "false",
      description: "是否显示不透明度滑轨与数值通道输入框",
    },
    {
      name: "presets",
      type: "string[]",
      defaultValue: "—",
      description: "底部可键盘方向键切换的预设颜色列表",
    },
  ],
  accessibility: [
    "二维色盘拇指与各通道滑轨遵循 WAI-ARIA slider 模式，支持方向键单步微调与 Shift+方向键十倍步进。",
    "预设色板采用单一 Tab 停靠点的 listbox 模式，输入框遇到非法色值按 Enter 或 Escape 自动安全还原。",
  ],
};
