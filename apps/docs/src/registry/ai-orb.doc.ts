import AiOrbBasicDemo from "@/demos/ai-orb/basic";
import AiOrbPillsDemo from "@/demos/ai-orb/pills";
import type { ComponentDoc } from "./registry.types";

export const AI_ORB_DOC: ComponentDoc = {
  slug: "ai-orb",
  name: "AI Orb",
  description:
    "AI 语音与智能体状态球，支持流光球体（aurora）与 3x3 像素点阵（lattice）两种形态及胶囊模式。",
  category: "ai",
  registryName: "ai-orb",
  dependencies: ["motion"],
  createdAt: "2026-11-22",
  usage: `import { AiOrb } from "@/components/ui/ai-orb";

export function Example() {
  return <AiOrb state="thinking" variant="aurora" pill />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "流光球体与 3x3 点阵双形态",
      description: "支持在思考、聆听、回应与待命四种状态间实时切换，同时呈现流光球体与像素点阵。",
      file: "ai-orb/basic.tsx",
      Demo: AiOrbBasicDemo,
    },
    {
      slug: "pills",
      name: "内联触感状态胶囊（pill 模式）",
      description: "传入 pill 属性包裹为 C 端圆角状态胶囊，适合嵌入对话流顶部或输入框。",
      file: "ai-orb/pills.tsx",
      Demo: AiOrbPillsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "state",
      type: '"idle" | "thinking" | "listening" | "speaking"',
      defaultValue: '"thinking"',
      description: "当前智能体状态",
    },
    {
      name: "variant",
      type: '"aurora" | "lattice"',
      defaultValue: '"aurora"',
      description: "流光球体或 3x3 点阵形态",
    },
    { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "尺寸规格" },
    {
      name: "pill",
      type: "boolean",
      defaultValue: "false",
      description: "是否渲染为带文案的触感胶囊",
    },
    { name: "label", type: "string", defaultValue: "按状态匹配", description: "状态描述文案" },
    {
      name: "onClick",
      type: "() => void",
      defaultValue: "—",
      description: "点击回调（传入时自动渲染为可交互按钮）",
    },
  ],
  accessibility: [
    "非交互状态使用语义化 <output> 标签并附带 aria-label，胶囊点击态使用 <button>。",
    "自动响应 prefers-reduced-motion，减弱动效时停留在平衡静态帧。",
  ],
};
