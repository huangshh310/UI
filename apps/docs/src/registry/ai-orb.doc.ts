import AiOrbBasicDemo from "@/demos/ai-orb/basic";
import AiOrbPillsDemo from "@/demos/ai-orb/pills";
import type { ComponentDoc } from "./registry.types";

export const AI_ORB_DOC: ComponentDoc = {
  slug: "ai-orb",
  name: "AI Orb",
  description:
    "AI 语音与智能体状态球，支持流体光学球（aurora）、精密微型 OLED 矩阵（lattice）、双轨声纹光环（ring）与触感胶囊形态。",
  category: "ai",
  registryName: "ai-orb",
  dependencies: ["motion"],
  createdAt: "2026-11-22",
  usage: `import { AiOrb } from "@/components/ui/ai-orb";

export function Example() {
  return <AiOrb state="thinking" variant="aurora" pill badge="Pro" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "三形态状态球实时切换",
      description:
        "在思考、聆听、回应与待命四种状态间实时切换，同台呈现流体光学球、微型 OLED 矩阵与双轨声纹光环。",
      file: "ai-orb/basic.tsx",
      Demo: AiOrbBasicDemo,
    },
    {
      slug: "pills",
      name: "内联触感状态胶囊（pill 模式）",
      description: "传入 pill 与 badge 包裹为精致顶栏状态触发胶囊，适合嵌入对话流顶部或工具栏。",
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
      type: '"aurora" | "lattice" | "ring"',
      defaultValue: '"aurora"',
      description: "流体光学球、微型 OLED 矩阵或双轨声纹光环形态",
    },
    {
      name: "size",
      type: '"xs" | "sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: "尺寸规格",
    },
    {
      name: "tone",
      type: '"auto" | "signal" | "emerald" | "amber" | "mono"',
      defaultValue: '"auto"',
      description: "色彩基调，auto 自动随 state 切换语义色",
    },
    {
      name: "pill",
      type: "boolean",
      defaultValue: "false",
      description: "是否渲染为带文案的触感胶囊",
    },
    { name: "label", type: "string", defaultValue: "按状态匹配", description: "状态描述文案" },
    {
      name: "badge",
      type: "string",
      defaultValue: "—",
      description: "胶囊模式右侧的可选元信息徽标",
    },
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
