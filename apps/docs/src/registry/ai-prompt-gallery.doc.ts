import AiPromptGalleryBasicDemo from "@/demos/ai-prompt-gallery/basic";
import AiPromptGalleryDesignDemo from "@/demos/ai-prompt-gallery/design";
import type { ComponentDoc } from "./registry.types";

export const AI_PROMPT_GALLERY_DOC: ComponentDoc = {
  slug: "ai-prompt-gallery",
  name: "AI Prompt Gallery",
  description: "C 端 AI 灵感冒泡与场景提示词卡网格，支持分类筛选与一键注入指令。",
  category: "ai",
  registryName: "ai-prompt-gallery",
  dependencies: ["lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiPromptGallery } from "@/components/ui/ai-prompt-gallery";

export function Example() {
  return <AiPromptGallery />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "分类筛选与 Bento 灵感卡网格",
      description: "适用于对话空状态与新建任务页，按设计/编程/调研/写作筛选并高亮选中卡片。",
      file: "ai-prompt-gallery/basic.tsx",
      Demo: AiPromptGalleryBasicDemo,
    },
    {
      slug: "callback",
      name: "选中模板回填反馈",
      description: "结合 onSelect 回调把点击的场景提示词实时注入下方状态或 PromptInput。",
      file: "ai-prompt-gallery/design.tsx",
      Demo: AiPromptGalleryDesignDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "templates",
      type: "AiPromptTemplate[]",
      defaultValue: "内置 4 项",
      description: "场景提示词模板列表",
    },
    {
      name: "onSelect",
      type: "(template: AiPromptTemplate) => void",
      defaultValue: "—",
      description: "点击卡片回调",
    },
  ],
  accessibility: ["分类筛选按钮暴露 aria-pressed，卡片支持键盘 Tab 聚焦与 Enter 选中。"],
};
