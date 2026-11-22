import AccordionBasicDemo from "@/demos/accordion/basic";
import AccordionMultipleDemo from "@/demos/accordion/multiple";
import type { ComponentDoc } from "./registry.types";

export const ACCORDION_DOC: ComponentDoc = {
  slug: "accordion",
  name: "Accordion",
  description: "基于 Base UI Accordion 的折叠面板，支持单开/多开、盒装与发丝分隔变体。",
  category: "navigation",
  registryName: "accordion",
  dependencies: ["@base-ui/react", "lucide-react"],
  usage: `import { Accordion } from "@/components/ui/accordion";

<Accordion items={[{ value: "1", title: "标题", content: "正文" }]} />`,
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
      slug: "multiple",
      name: "多开模式发布检查清单",
      description: "开启 multiple 与 bordered 变体，支持同时展开多个检查项。",
      file: "accordion/multiple.tsx",
      Demo: AccordionMultipleDemo,
      directory: false,
    },
  ],
  api: [
    { name: "items", type: "AccordionItem[]", defaultValue: "必填", description: "折叠条目数组" },
    { name: "multiple", type: "boolean", defaultValue: "false", description: "允许同时展开多项" },
    {
      name: "variant",
      type: '"divided" | "boxed"',
      defaultValue: '"divided"',
      description: "视觉样式",
    },
  ],
  accessibility: [
    "内置 aria-expanded 与 aria-controls 绑定，上下方向键可在触发项之间快速移动焦点。",
  ],
};
