import AiTokenMeterBasicDemo from "@/demos/ai-token-meter/basic";
import AiTokenMeterCompactWindowDemo from "@/demos/ai-token-meter/compact-window";
import type { ComponentDoc } from "./registry.types";

export const AI_TOKEN_METER_DOC: ComponentDoc = {
  slug: "ai-token-meter",
  name: "AI Token Meter",
  description: "AI 上下文窗口与分段 Token 预算指示器，支持分类图例与一键压缩上下文。",
  category: "ai",
  registryName: "ai-token-meter",
  dependencies: ["lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiTokenMeter } from "@/components/ui/ai-token-meter";

export function Example() {
  return <AiTokenMeter />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "200K 上下文分段占用与一键压缩",
      description:
        "按系统提示、历史对话、知识库与工具输出四色分段展示，点击压缩可即时释放历史 Token。",
      file: "ai-token-meter/basic.tsx",
      Demo: AiTokenMeterBasicDemo,
    },
    {
      slug: "compact-window",
      name: "32K 端侧 WebGPU 模型预算条",
      description: "自定义 maxTokens 与 costLabel，适合本地浏览器端小模型上下文监控。",
      file: "ai-token-meter/compact-window.tsx",
      Demo: AiTokenMeterCompactWindowDemo,
      directory: false,
    },
  ],
  api: [
    { name: "maxTokens", type: "number", defaultValue: "200000", description: "上下文最大容量" },
    {
      name: "segments",
      type: "AiTokenSegment[]",
      defaultValue: "内置 4 段",
      description: "分段 Token 列表",
    },
    { name: "costLabel", type: "string", defaultValue: '"~$0.038"', description: "预估成本标签" },
    {
      name: "onCompact",
      type: "(savedTokens: number) => void",
      defaultValue: "—",
      description: "压缩上下文回调",
    },
  ],
  accessibility: ["每个分段同时在下方图例中给出文字标签与等宽 Token 数值，不单纯依赖颜色区分。"],
};
