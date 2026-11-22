import SpinnerBasicDemo from "@/demos/spinner/basic";
import SpinnerInlineDemo from "@/demos/spinner/inline";
import type { ComponentDoc } from "./registry.types";

export const SPINNER_DOC: ComponentDoc = {
  slug: "spinner",
  name: "Spinner",
  description: "精致轻量的 SVG 环形加载器，多尺寸预设并自动响应减弱动效偏好。",
  category: "display",
  registryName: "spinner",
  dependencies: [],
  usage: `import { Spinner } from "@/components/ui/spinner";

<Spinner size="md" label="正在加载" />`,
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
  ],
  api: [
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "环形尺寸",
    },
    { name: "label", type: "string", defaultValue: '"加载中"', description: "屏幕阅读器状态描述" },
  ],
  accessibility: ["使用原生 <output> 语义容器承载加载状态，减弱动效模式下停止旋转动画。"],
};
