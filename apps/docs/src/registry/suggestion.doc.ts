import SuggestionBasicDemo from "@/demos/suggestion/basic";
import SuggestionCardsDemo from "@/demos/suggestion/cards";
import type { ComponentDoc } from "./registry.types";

export const SUGGESTION_DOC: ComponentDoc = {
  slug: "suggestion",
  name: "Suggestion",
  description: "无外框 AI 追问胶囊条与空态场景灵感卡片网格，支持分类筛选与复合拼装。",
  category: "ai",
  registryName: "suggestion",
  dependencies: ["lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import { Suggestion, Suggestions } from "@/components/ui/suggestion";

export function Example() {
  return (
    <Suggestions>
      <Suggestion suggestion="审查当前架构权衡">审查架构权衡</Suggestion>
    </Suggestions>
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "轻量追问胶囊条",
      description: "适合置于助手回复末尾或输入器上方，单击一键触发跟进提问。",
      file: "suggestion/basic.tsx",
      Demo: SuggestionBasicDemo,
    },
    {
      slug: "cards",
      name: "空态分类灵感卡片组",
      description: "variant='cards' 提供带分类胶囊筛选的双栏场景启动卡，适合首屏空状态。",
      file: "suggestion/cards.tsx",
      Demo: SuggestionCardsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"pills" | "cards"',
      defaultValue: '"pills"',
      description: "展示形态：紧凑横向胶囊组或双栏场景卡片。",
    },
    {
      name: "items",
      type: "SuggestionItem[]",
      defaultValue: "内置 4 项场景模板",
      description: "结构化建议列表；未传且含 children 时渲染复合 Suggestion 子部件。",
    },
    {
      name: "onSelect",
      type: "(prompt: string, item?: SuggestionItem) => void",
      defaultValue: "—",
      description: "点击任一胶囊或卡片时的回调。",
    },
  ],
  accessibility: [
    "分类切换按钮声明 aria-pressed，全部胶囊与卡片均为原生 button，支持 Tab 与 Enter/Space 触发。",
  ],
};
