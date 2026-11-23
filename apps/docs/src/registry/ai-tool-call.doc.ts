import AiToolCallBasicDemo from "@/demos/ai-tool-call/basic";
import AiToolCallStatesDemo from "@/demos/ai-tool-call/states";
import type { ComponentDoc } from "./registry.types";

export const AI_TOOL_CALL_DOC: ComponentDoc = {
  slug: "ai-tool-call",
  name: "AI Tool Call",
  description:
    "智能体工具调用与流水线步骤检查器卡片，支持暗色 JSON 载荷抽屉、多状态胶囊、紧凑与曜石外观以及失败重试。",
  category: "ai",
  registryName: "ai-tool-call",
  dependencies: ["class-variance-authority", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiToolCall } from "@/components/ui/ai-tool-call";

export function Example() {
  return <AiToolCall toolName="search_registry" status="completed" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "工具调用摘要与暗色 JSON 载荷抽屉",
      description:
        "展开后以暗色曜石面板呈现结构化 Parameters 入参与 Result 返回结果，并支持一键复制。",
      file: "ai-tool-call/basic.tsx",
      Demo: AiToolCallBasicDemo,
    },
    {
      slug: "states",
      name: "多状态流水线与曜石暗色形态",
      description: "并排展示 running / pending / error 状态以及 compact 与 obsidian 变体。",
      file: "ai-tool-call/states.tsx",
      Demo: AiToolCallStatesDemo,
      directory: false,
    },
  ],
  api: [
    { name: "toolName", type: "string", defaultValue: "必填", description: "工具或函数名" },
    {
      name: "status",
      type: '"running" | "completed" | "error" | "pending"',
      defaultValue: '"completed"',
      description: "执行状态",
    },
    {
      name: "variant",
      type: '"card" | "compact" | "obsidian"',
      defaultValue: '"card"',
      description: "卡片视觉风格",
    },
    {
      name: "provider",
      type: "string",
      defaultValue: '"MCP"',
      description: "工具提供方或 MCP 服务标识",
    },
    { name: "durationLabel", type: "string", defaultValue: '"142ms"', description: "耗时标签" },
    {
      name: "tokensLabel",
      type: "string",
      defaultValue: "—",
      description: "可选 Token 或载荷读数",
    },
    {
      name: "summary",
      type: "string",
      defaultValue: "—",
      description: "折叠顶栏下方展示的简短结果摘要",
    },
    {
      name: "inputJson",
      type: "string",
      defaultValue: "内置示例",
      description: "入参 JSON 字符串",
    },
    {
      name: "outputJson",
      type: "string",
      defaultValue: "内置示例",
      description: "返回结果 JSON 字符串",
    },
    { name: "expanded", type: "boolean", defaultValue: "—", description: "受控展开状态" },
    {
      name: "defaultExpanded",
      type: "boolean",
      defaultValue: "false",
      description: "初始是否展开载荷明细",
    },
    {
      name: "onExpandedChange",
      type: "(expanded: boolean) => void",
      defaultValue: "—",
      description: "展开状态变化回调",
    },
    {
      name: "onRetry",
      type: "() => void",
      defaultValue: "—",
      description: "失败态点击重试按钮回调",
    },
  ],
  accessibility: ["顶栏按钮通过 aria-expanded 声明展开状态，执行状态同时具备图标与文字徽章。"],
};
