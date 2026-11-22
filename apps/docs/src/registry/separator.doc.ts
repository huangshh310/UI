import SeparatorBasicDemo from "@/demos/separator/basic";
import SeparatorVerticalDemo from "@/demos/separator/vertical";
import type { ComponentDoc } from "./registry.types";

export const SEPARATOR_DOC: ComponentDoc = {
  slug: "separator",
  name: "Separator",
  description: "基于 Base UI Separator 的 1px 发丝分隔线，支持水平/垂直方向与居中标签。",
  category: "display",
  registryName: "separator",
  dependencies: ["@base-ui/react"],
  usage: `import { Separator } from "@/components/ui/separator";

<Separator label="或使用邮箱继续" />`,
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
      description: "水平模式下居中展示的辅助文案",
    },
  ],
  accessibility: ['基于 Base UI Separator，自动输出 role="separator" 与 aria-orientation。'],
};
