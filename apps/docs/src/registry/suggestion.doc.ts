import SuggestionBasicDemo from "@/demos/suggestion/basic";
import SuggestionCardsDemo from "@/demos/suggestion/cards";
import SuggestionListDemo from "@/demos/suggestion/list";
import type { ComponentDoc } from "./registry.types";

export const SUGGESTION_DOC: ComponentDoc = {
  slug: "suggestion",
  name: "Suggestion",
  description:
    "无外框 AI 追问胶囊条、空态场景灵感卡片网格与垂直追问列表，支持分类筛选、快捷键徽章与复合拼装。",
  category: "ai",
  registryName: "suggestion",
  dependencies: ["class-variance-authority", "lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import { Suggestion, Suggestions } from "@/components/ui/suggestion";

export function Example() {
  return (
    <Suggestions>
      <Suggestion variant="signal" suggestion="审查当前架构权衡">审查架构权衡</Suggestion>
    </Suggestions>
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "轻量追问胶囊条",
      description: "适合置于助手回复末尾或输入器上方，支持 default / ghost / signal 三种胶囊质感。",
      file: "suggestion/basic.tsx",
      Demo: SuggestionBasicDemo,
    },
    {
      slug: "cards",
      name: "空态分类灵感卡片组",
      description: "variant='cards' 提供带分类胶囊筛选的毛玻璃双栏场景启动卡，适合首屏空状态。",
      file: "suggestion/cards.tsx",
      Demo: SuggestionCardsDemo,
      directory: false,
    },
    {
      slug: "list",
      name: "回答末尾垂直追问列表",
      description: "variant='list' 以 1px 发丝分割线呈现紧凑的上下文追问建议列表。",
      file: "suggestion/list.tsx",
      Demo: SuggestionListDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant / surface / size",
      type: '"pills" | "cards" | "list" / "default" | "ghost" | "glass" / "sm" | "md"',
      defaultValue: '"pills" / "default" / "md"',
      description: "展示形态、容器表面质感与尺寸密度。",
    },
    {
      name: "items",
      type: "SuggestionItem[]",
      defaultValue: "内置 4 项场景模板",
      description: "结构化建议列表（支持 label / description / category / badge / icon）。",
    },
    {
      name: "columns / scrollable / showCategoryFilter",
      type: "1 | 2 | 3 / boolean / boolean",
      defaultValue: "2 / false / true",
      description: "卡片网格列数、胶囊单行横向滚动轨道以及是否展示分类筛选行。",
    },
    {
      name: "onSelect",
      type: "(prompt: string, item?: SuggestionItem) => void",
      defaultValue: "—",
      description: "点击任一胶囊、卡片或列表项时的回调。",
    },
    {
      name: "variant / badge (Suggestion)",
      type: '"default" | "ghost" | "signal" / string',
      defaultValue: '"default" / -',
      description: "单条胶囊视觉风格与尾部等宽徽章（如快捷键或推荐标识）。",
    },
  ],
  accessibility: [
    "分类切换按钮声明 aria-pressed，全部胶囊、卡片与列表行均为原生 button，支持 Tab 与 Enter/Space 触发。",
    "所有交互面均使用统一单层清晰焦点环（focus-visible:ring-1 focus-visible:ring-inset），无双层边框冲突。",
  ],
};
