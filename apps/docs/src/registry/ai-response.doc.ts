import AiResponseBasicDemo from "@/demos/ai-response/basic";
import AiResponseStreamingDemo from "@/demos/ai-response/streaming";
import type { ComponentDoc } from "./registry.types";

export const AI_RESPONSE_DOC: ComponentDoc = {
  slug: "ai-response",
  name: "AiResponse",
  description:
    "流式 AI 回复容器，内置零 innerHTML 的安全 Markdown 渲染、工具调用折叠摘要、编号参考来源卡片与复制/重生成/反馈栏。",
  category: "ai",
  registryName: "ai-response",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiResponse } from "@/components/ui/ai-response";

export function Example() {
  return (
    <AiResponse
      model="Matt AI"
      status="complete"
      content="已整理完**核心要点**，可直接运行 \`pnpm build\` 验证。"
    />
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "安全 Markdown 与工具/来源折叠",
      description: "内置代码块一键复制、工具摘要胶囊、参考来源卡片与反馈栏。",
      file: "ai-response/basic.tsx",
      Demo: AiResponseBasicDemo,
    },
    {
      slug: "streaming",
      name: "生成中、流式光标与错误态",
      description: "支持从 generating 骨架屏平滑过渡到 streaming 实时光标与错误重试态。",
      file: "ai-response/streaming.tsx",
      Demo: AiResponseStreamingDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "content",
      type: "string",
      defaultValue: "必填",
      description: "流式或完整 Markdown 回复正文",
    },
    {
      name: "status",
      type: '"idle" | "generating" | "streaming" | "complete" | "error"',
      defaultValue: '"complete"',
      description: "当前回复状态",
    },
    { name: "model", type: "string", defaultValue: '"Assistant"', description: "模型或助手名称" },
    {
      name: "tools",
      type: "AiResponseTool[]",
      defaultValue: "[]",
      description: "本次回复调用的工具列表",
    },
    {
      name: "sources",
      type: "AiResponseSource[]",
      defaultValue: "[]",
      description: "参考来源卡片列表（自动过滤危险协议）",
    },
    {
      name: "onRegenerate",
      type: "() => void",
      defaultValue: "—",
      description: "点击重新生成按钮时触发",
    },
    {
      name: "onFeedback",
      type: '(type: "up" | "down") => void',
      defaultValue: "—",
      description: "点击点赞或点踩按钮时触发",
    },
  ],
  accessibility: [
    "全量使用 React 节点渲染 Markdown，零 innerHTML；safeHref 白名单自动拦截 javascript:/data: 等危险链接。",
    '正文容器带有 aria-live="polite"，错误态使用 role="alert"，点赞按钮绑定 aria-pressed。',
  ],
};
