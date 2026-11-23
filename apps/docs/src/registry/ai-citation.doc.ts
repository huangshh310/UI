import AiCitationApiDemo from "@/demos/ai-citation/api";
import AiCitationBasicDemo from "@/demos/ai-citation/basic";
import type { ComponentDoc } from "./registry.types";

export const AI_CITATION_DOC: ComponentDoc = {
  slug: "ai-citation",
  name: "AI Citation",
  description:
    "行内角标引用胶囊与磨砂玻璃 RAG 溯源上下文卡片，支持点击切换知识片段、来源外链与匹配度评分。",
  category: "ai",
  registryName: "ai-citation",
  dependencies: ["class-variance-authority", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiCitation } from "@/components/ui/ai-citation";

export function Example() {
  return <AiCitation />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "角标引用胶囊与磨砂 RAG 片段预览",
      description:
        "点击 [1] / [2] / [3] 引用胶囊即可切换磨砂玻璃浮层中的知识库原文摘录、来源路径与匹配度。",
      file: "ai-citation/basic.tsx",
      Demo: AiCitationBasicDemo,
    },
    {
      slug: "sources",
      name: "紧凑角标与磨砂浮层模式（popover）",
      description: '使用 variant="popover" 精简角标为数字胶囊，聚焦多源文档摘录预览。',
      file: "ai-citation/api.tsx",
      Demo: AiCitationApiDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"card" | "popover" | "inline"',
      defaultValue: '"card"',
      description: "视觉布局形态（标准溯源卡、磨砂浮层或无框内联条）",
    },
    {
      name: "answer",
      type: "string",
      defaultValue: "内置示例回答",
      description: "可选 AI 回答正文（与行内引用角标联动展示）",
    },
    {
      name: "sources",
      type: "AiCitationSource[]",
      defaultValue: "内置 3 项",
      description: "引用来源列表（支持可选 url 与 publishedAt 字段）",
    },
    {
      name: "defaultActiveId",
      type: "string",
      defaultValue: "首项 ID",
      description: "初始展开的来源 ID",
    },
    {
      name: "onSelect",
      type: "(source: AiCitationSource) => void",
      defaultValue: "—",
      description: "切换来源回调",
    },
  ],
  accessibility: ["引用角标按钮暴露 aria-pressed，高对比度钴蓝激活态在浅色与深色下均 >= 4.95:1。"],
};
