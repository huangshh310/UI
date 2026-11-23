import SpinnerBasicDemo from "@/demos/spinner/basic";
import SpinnerInlineDemo from "@/demos/spinner/inline";
import SpinnerVariantsDemo from "@/demos/spinner/variants";
import type { ComponentDoc } from "./registry.types";

export const SPINNER_DOC: ComponentDoc = {
  slug: "spinner",
  name: "Spinner",
  description:
    "精致轻量的加载指示器，支持 ring 环形、dots 点阵与 bars 柱条三种视觉风格，多尺寸预设并响应减弱动效偏好。",
  category: "display",
  registryName: "spinner",
  dependencies: [],
  usage: `import { Spinner } from "@/components/ui/spinner";

<Spinner size="md" variant="ring" label="正在加载" showLabel />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "四种尺寸",
      description: "支持 xs / sm / md / lg 尺寸并可通过文字色类自由覆写颜色。",
      file: "spinner/basic.tsx",
      Demo: SpinnerBasicDemo,
    },
    {
      slug: "inline",
      name: "状态条与徽章内联加载",
      description: "使用 xs 尺寸加载器嵌入卡片提示条与 Badge 胶囊中。",
      file: "spinner/inline.tsx",
      Demo: SpinnerInlineDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "三种加载风格与可见标签",
      description: "对比 ring、dots 与 bars 三种加载器形态，支持搭配 showLabel 展示提示文案。",
      file: "spinner/variants.tsx",
      Demo: SpinnerVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"ring" | "dots" | "bars"',
      defaultValue: '"ring"',
      description: "加载器视觉风格",
    },
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "尺寸预设",
    },
    { name: "label", type: "string", defaultValue: '"加载中"', description: "屏幕阅读器状态描述" },
    {
      name: "showLabel",
      type: "boolean",
      defaultValue: "false",
      description: "是否在加载器旁显示可见文案",
    },
  ],
  accessibility: ["使用原生 <output> 语义容器承载加载状态，减弱动效模式下自动停止动画。"],
};
