import AiResponseBasicDemo from "@/demos/ai-response/basic";
import AiResponseStreamingDemo from "@/demos/ai-response/streaming";
import AiResponseVariantsDemo from "@/demos/ai-response/variants";
import type { ComponentDoc } from "./registry.types";

export const AI_RESPONSE_DOC: ComponentDoc = {
  slug: "ai-response",
  name: "AiResponse",
  description:
    "流式 AI 回复容器，内置零 innerHTML 的安全 Markdown 渲染、卡片/无框/毛玻璃变体、模型徽章、工具摘要与参考来源卡片。",
  category: "ai",
  registryName: "ai-response",
  dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import { AiResponse } from "@/components/ui/ai-response";

export function Example() {
  return (
    <AiResponse
      model="Matt Pro 4"
      modelBadge="200K"
      status="complete"
      content="已整理完**核心要点**，可直接运行 \`pnpm build\` 验证。"
    />
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "安全 Markdown 与工具/来源折叠",
      description:
        "内置代码块一键复制、模型等宽徽章、工具摘要胶囊、带摘要预览的参考来源卡片与反馈栏。",
      file: "ai-response/basic.tsx",
      Demo: AiResponseBasicDemo,
    },
    {
      slug: "streaming",
      name: "毛玻璃流式光标与错误重试态",
      description: "通过 variant='glass' 呈现 generating 骨架屏、实时流式光标与高对比错误重试态。",
      file: "ai-response/streaming.tsx",
      Demo: AiResponseStreamingDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "无框对话流模式与默认展开来源",
      description: "使用 variant='ghost' 与 defaultSourcesOpen 无缝嵌入对话画布。",
      file: "ai-response/variants.tsx",
      Demo: AiResponseVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "content / status",
      type: 'string / "idle" | "generating" | "streaming" | "complete" | "error"',
      defaultValue: '必填 / "complete"',
      description: "流式或完整 Markdown 回复正文及当前生成状态。",
    },
    {
      name: "variant / size",
      type: '"card" | "ghost" | "glass" / "sm" | "md"',
      defaultValue: '"card" / "md"',
      description: "容器表面材质（发丝卡片、无框对话流或毛玻璃）与内边距密度。",
    },
    {
      name: "model / modelBadge / timestamp",
      type: "string / string / string",
      defaultValue: '"Assistant" / — / —',
      description: "顶部模型名称、等宽规格徽章与响应耗时/时间戳。",
    },
    {
      name: "tools / defaultToolsOpen / sources / defaultSourcesOpen",
      type: "AiResponseTool[] / boolean / AiResponseSource[] / boolean",
      defaultValue: "[] / false / [] / false",
      description: "调用工具列表、参考来源卡片（自动过滤危险协议）及其默认展开开关。",
    },
    {
      name: "onRegenerate / onFeedback / onCopy",
      type: '() => void / (type: "up" | "down") => void / (content: string) => void',
      defaultValue: "—",
      description: "重新生成、赞踩反馈与复制正文回调。",
    },
  ],
  accessibility: [
    "全量使用 React 节点渲染 Markdown，零 innerHTML；safeHref 白名单自动拦截 javascript:/data: 等危险链接。",
    '正文容器带有 aria-live="polite"，错误态使用 role="alert"，赞踩按钮绑定 aria-pressed 与统一单层焦点环。',
  ],
};
