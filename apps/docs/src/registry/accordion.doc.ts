import AccordionBasicDemo from "@/demos/accordion/basic";
import AccordionMultipleDemo from "@/demos/accordion/multiple";
import AccordionSeparatedDemo from "@/demos/accordion/separated";
import type { ComponentDoc } from "./registry.types";

export const ACCORDION_DOC: ComponentDoc = {
  slug: "accordion",
  name: "Accordion",
  description:
    "基于 Base UI Accordion 的精密折叠面板，支持 default / card / separated 变体、chevron / plus 指示器与单开/多开。",
  category: "navigation",
  registryName: "accordion",
  dependencies: ["@base-ui/react", "class-variance-authority", "lucide-react"],
  usage: `import { Accordion } from "@/components/ui/accordion";

<Accordion variant="separated" indicator="plus" items={[{ value: "1", title: "标题", content: "正文" }]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "盒装折叠面板",
      description: "支持平滑高度展开过渡与副标题摘要。",
      file: "accordion/basic.tsx",
      Demo: AccordionBasicDemo,
    },
    {
      slug: "separated",
      name: "独立分卡与加减指示器",
      description:
        '使用 variant="separated" 与 indicator="plus" 搭配图标和徽章，呈现独立发丝卡片质感。',
      file: "accordion/separated.tsx",
      Demo: AccordionSeparatedDemo,
      directory: false,
    },
    {
      slug: "multiple",
      name: "多开模式发布检查清单",
      description: "开启 multiple 与盒装变体，支持同时展开多个检查项。",
      file: "accordion/multiple.tsx",
      Demo: AccordionMultipleDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "AccordionItem[]",
      defaultValue: "必填",
      description: "折叠条目数组，支持 subtitle、icon、badge 与 disabled",
    },
    { name: "multiple", type: "boolean", defaultValue: "false", description: "允许同时展开多项" },
    {
      name: "variant",
      type: '"default" | "card" | "separated" | "divided" | "boxed"',
      defaultValue: '"default"',
      description: "视觉样式（divided / boxed 为兼容别名）",
    },
    {
      name: "indicator",
      type: '"chevron" | "plus"',
      defaultValue: '"chevron"',
      description: "右侧展开指示图标形态",
    },
  ],
  accessibility: [
    "内置 aria-expanded 与 aria-controls 绑定，上下方向键可在触发项之间快速移动焦点。",
  ],
};
