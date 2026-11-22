import AiCanvasCardBasicDemo from "@/demos/ai-canvas-card/basic";
import AiCanvasCardPortraitDemo from "@/demos/ai-canvas-card/portrait";
import type { ComponentDoc } from "./registry.types";

export const AI_CANVAS_CARD_DOC: ComponentDoc = {
  slug: "ai-canvas-card",
  name: "AI Canvas Card",
  description: "AI 多模态视觉生成结果画布卡片，支持一键生成视觉变体、4K 高清放大与收藏反馈。",
  category: "ai",
  registryName: "ai-canvas-card",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiCanvasCard } from "@/components/ui/ai-canvas-card";

export function Example() {
  return <AiCanvasCard />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "生成式视觉画布与变体切换",
      description: "点击生成变体实时轮换极光琉璃/曜石琥珀/翠雾微光画布，支持 4K 放大与收藏状态。",
      file: "ai-canvas-card/basic.tsx",
      Demo: AiCanvasCardBasicDemo,
    },
    {
      slug: "portrait",
      name: "竖版 4:5 风格标签与提示词",
      description: "自定义画幅比例、风格徽章与视觉提示词，适用于 C 端生图与封面创作流。",
      file: "ai-canvas-card/portrait.tsx",
      Demo: AiCanvasCardPortraitDemo,
      directory: false,
    },
  ],
  api: [
    { name: "prompt", type: "string", defaultValue: "内置提示词", description: "画面生成提示词" },
    { name: "aspectLabel", type: "string", defaultValue: '"16:9"', description: "画幅比例标签" },
    { name: "styleLabel", type: "string", defaultValue: '"赛博陶瓷"', description: "视觉风格标签" },
    {
      name: "onRemix",
      type: "(seedIndex: number) => void",
      defaultValue: "—",
      description: "切换视觉变体回调",
    },
    {
      name: "onFavoriteChange",
      type: "(favorited: boolean) => void",
      defaultValue: "—",
      description: "收藏状态变更回调",
    },
  ],
  accessibility: [
    "画面角标采用深色半透明胶囊保证白色文字对比度 >= 7:1，收藏按钮绑定 aria-pressed。",
  ],
};
