import AiAgentCockpitBlockBasicDemo from "@/demos/ai-agent-cockpit-block/basic";
import AiAgentCockpitBlockVoiceModeDemo from "@/demos/ai-agent-cockpit-block/voice-mode";
import type { ComponentDoc } from "./registry.types";

export const AI_AGENT_COCKPIT_BLOCK_DOC: ComponentDoc = {
  slug: "ai-agent-cockpit-block",
  name: "AI Agent Cockpit Block",
  description:
    "由 AiOrb、AudioWaves、AiReasoning、SegmentedControl 与 NumberFlow 组合的 C 端多模态智能体驾驶舱区块。",
  category: "blocks",
  registryName: "ai-agent-cockpit-block",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiAgentCockpitBlock } from "@/components/ui/ai-agent-cockpit-block";

export function Example() {
  return <AiAgentCockpitBlock />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "多模态智能体驾驶舱（对话 / 语音 / 研究）",
      description:
        "切换顶部分段控制器时，状态球、模式状态徽章、思维链推理面板、实时语音声波与 Token 滚轮自动联动。",
      file: "ai-agent-cockpit-block/basic.tsx",
      Demo: AiAgentCockpitBlockBasicDemo,
    },
    {
      slug: "voice-mode",
      name: "Studio 光影实时语音交互模式",
      description: '通过 defaultMode="voice" 与 variant="studio" 启动即进入实时语音声波聆听态。',
      file: "ai-agent-cockpit-block/voice-mode.tsx",
      Demo: AiAgentCockpitBlockVoiceModeDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "defaultMode",
      type: '"chat" | "voice" | "research"',
      defaultValue: '"chat"',
      description: "初始工作台模式",
    },
    {
      name: "variant",
      type: '"default" | "elevated" | "studio"',
      defaultValue: '"default"',
      description: "容器表面与光影变体",
    },
    {
      name: "title",
      type: "string",
      defaultValue: '"多模态智能体驾驶舱"',
      description: "驾驶舱主标题",
    },
    {
      name: "subtitle",
      type: "string",
      defaultValue: '"融合实时语音波形、思维链推理轨迹与物理分段控制器的 C 端工作台。"',
      description: "驾驶舱副标题",
    },
    {
      name: "initialTokens",
      type: "number",
      defaultValue: "1420",
      description: "初始 Token 计数显示值",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "是否启用紧凑内边距布局",
    },
    {
      name: "onRunPrompt",
      type: "(prompt: string, mode: AiCockpitMode) => void",
      defaultValue: "—",
      description: "执行指令回调",
    },
  ],
  accessibility: [
    "所有内嵌子组件（AiOrb、AudioWaves、AiReasoning、SegmentedControl）均保持独立键盘可达与读屏标签。",
    "指令输入框与快捷提示词按钮均具备单层清晰焦点环，避免双层重边框干扰。",
  ],
};
