import TabsBasicDemo from "@/demos/tabs/basic";
import TabsCardDemo from "@/demos/tabs/card";
import TabsEnclosedDemo from "@/demos/tabs/enclosed";
import TabsUnderlineDemo from "@/demos/tabs/underline";
import type { ComponentDoc } from "./registry.types";

export const TABS_DOC: ComponentDoc = {
  slug: "tabs",
  name: "Tabs",
  description:
    "基于 Base UI Tabs 的精密滑动指示器页签，支持 pill / line / card / enclosed 四种风格、三档尺寸与等宽分布。",
  category: "navigation",
  registryName: "tabs",
  dependencies: ["@base-ui/react", "class-variance-authority"],
  usage: `import { Tabs } from "@/components/ui/tabs";

<Tabs variant="enclosed" size="md" items={[{ value: "a", label: "概览", content: "正文" }]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "胶囊与下划线页签",
      description: "平滑滑动激活指示器，支持图标与计数徽章。",
      file: "tabs/basic.tsx",
      Demo: TabsBasicDemo,
    },
    {
      slug: "enclosed",
      name: "围合等宽与紧凑底线页签",
      description:
        '使用 variant="enclosed" 与 fullWidth 呈现 Linear 风格等宽切换，并展示 sm 尺寸底线页签。',
      file: "tabs/enclosed.tsx",
      Demo: TabsEnclosedDemo,
      directory: false,
    },
    {
      slug: "underline",
      name: "下划线导航页签",
      description:
        '使用 variant="underline"（与 line 等价）与右侧徽章标注，适合文档与设置页顶部导航。',
      file: "tabs/underline.tsx",
      Demo: TabsUnderlineDemo,
      directory: false,
    },
    {
      slug: "card",
      name: "卡片边框页签组",
      description: '使用 variant="card" 呈现 npm 包与 Registry 两种安装命令切换。',
      file: "tabs/card.tsx",
      Demo: TabsCardDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "TabsItem[]",
      defaultValue: "必填",
      description: "页签数据数组，支持 icon、badge 与 disabled",
    },
    {
      name: "variant",
      type: '"pill" | "line" | "underline" | "card" | "enclosed"',
      defaultValue: '"pill"',
      description: "视觉风格（underline 为 line 的兼容别名）",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "页签高度与字号规格",
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: "false",
      description: "是否撑满容器宽度并等分各页签",
    },
    { name: "value", type: "string", defaultValue: "—", description: "受控当前页签" },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      defaultValue: "—",
      description: "切换回调",
    },
  ],
  accessibility: [
    "基于 Base UI Tabs，完整支持左右方向键、Home/End 切换及标准 tablist/tab/tabpanel 语义。",
  ],
};
