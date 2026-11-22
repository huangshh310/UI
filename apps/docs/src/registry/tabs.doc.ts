import TabsBasicDemo from "@/demos/tabs/basic";
import TabsUnderlineDemo from "@/demos/tabs/underline";
import TabsCardDemo from "@/demos/tabs/card";
import type { ComponentDoc } from "./registry.types";

export const TABS_DOC: ComponentDoc = {
  slug: "tabs",
  name: "Tabs",
  description: "基于 Base UI Tabs 的滑动指示器页签，支持胶囊分段、下划线与卡片三种风格。",
  category: "navigation",
  registryName: "tabs",
  dependencies: ["@base-ui/react"],
  usage: `import { Tabs } from "@/components/ui/tabs";

<Tabs variant="pill" items={[{ value: "a", label: "概览", content: "正文" }]} />`,
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
      slug: "underline",
      name: "下划线导航页签",
      description: '使用 variant="underline" 与右侧徽章标注，适合文档与设置页顶部导航。',
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
    { name: "items", type: "TabsItem[]", defaultValue: "必填", description: "页签数据数组" },
    {
      name: "variant",
      type: '"pill" | "underline" | "card"',
      defaultValue: '"pill"',
      description: "视觉风格",
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
