import SeparatorBasicDemo from "@/demos/separator/basic";
import SeparatorLabeledDemo from "@/demos/separator/labeled";
import SeparatorVerticalDemo from "@/demos/separator/vertical";
import type { ComponentDoc } from "./registry.types";

export const SEPARATOR_DOC: ComponentDoc = {
  slug: "separator",
  name: "Separator",
  description: "1px 发丝语义分隔线，支持水平/垂直方向、居中与左右对齐标签以及实线/虚线/渐变样式。",
  category: "display",
  registryName: "separator",
  dependencies: ["@base-ui/react"],
  usage: `import { Separator } from "@/components/ui/separator";

<Separator label="或使用以下方式登录" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "垂直与带标签水平分隔",
      description: "1px 细边线无缝适配浅色与深色表面。",
      file: "separator/basic.tsx",
      Demo: SeparatorBasicDemo,
    },
    {
      slug: "vertical",
      name: "工具栏垂直分隔线",
      description: '传入 orientation="vertical" 在紧凑工具栏与导航项之间划出 1px 细分隔。',
      file: "separator/vertical.tsx",
      Demo: SeparatorVerticalDemo,
      directory: false,
    },
    {
      slug: "labeled",
      name: "多对齐标签与线条样式",
      description: "演示居中、左对齐、右对齐标签以及虚线与渐变消隐发丝分隔线。",
      file: "separator/labeled.tsx",
      Demo: SeparatorLabeledDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
      description: "分隔方向",
    },
    {
      name: "label",
      type: "string",
      defaultValue: "—",
      description: "水平模式下嵌入的辅助标签文案",
    },
    {
      name: "labelAlign",
      type: '"center" | "left" | "right"',
      defaultValue: '"center"',
      description: "标签在水平分隔线中的对齐方式",
    },
    {
      name: "variant",
      type: '"solid" | "dashed" | "gradient"',
      defaultValue: '"solid"',
      description: "分隔线样式",
    },
  ],
  accessibility: ['自动输出标准 role="separator" 与 aria-orientation 无障碍属性。'],
};
