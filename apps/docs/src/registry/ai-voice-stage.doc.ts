import AiVoiceStageBasicDemo from "@/demos/ai-voice-stage/basic";
import AiVoiceStageSpeakingDemo from "@/demos/ai-voice-stage/speaking";
import type { ComponentDoc } from "./registry.types";

export const AI_VOICE_STAGE_DOC: ComponentDoc = {
  slug: "ai-voice-stage",
  name: "AI Voice Stage",
  description:
    "C 端全模态实时语音交互舞台，集成流体极光状态球、动态声压均衡条、实时字幕与圆形通话控制栏。",
  category: "ai",
  registryName: "ai-voice-stage",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiVoiceStage } from "@/components/ui/ai-voice-stage";

export function Example() {
  return <AiVoiceStage modelLabel="Realtime · 24kHz" durationLabel="00:42" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "全模态语音交互舞台与控制栏",
      description: "支持静音麦克风、切换极光球交互态、开关实时字幕以及结束会话后重新连线。",
      file: "ai-voice-stage/basic.tsx",
      Demo: AiVoiceStageBasicDemo,
    },
    {
      slug: "speaking",
      name: "曜石暗色沉浸播报舞台（obsidian）",
      description:
        '以 variant="obsidian" 与 defaultState="speaking" 呈现暗色语音演播舞台与实时播报字幕。',
      file: "ai-voice-stage/speaking.tsx",
      Demo: AiVoiceStageSpeakingDemo,
      directory: false,
    },
  ],
  api: [
    { name: "state", type: "AiOrbState", defaultValue: "—", description: "受控语音交互状态" },
    {
      name: "defaultState",
      type: "AiOrbState",
      defaultValue: '"listening"',
      description: "非受控初始语音状态",
    },
    {
      name: "variant",
      type: '"card" | "obsidian" | "compact"',
      defaultValue: '"card"',
      description: "舞台表面风格（标准卡片、曜石暗色或紧凑横排）",
    },
    {
      name: "orbVariant",
      type: '"aurora" | "lattice" | "ring"',
      defaultValue: '"aurora"',
      description: "中央状态球视觉形态",
    },
    {
      name: "assistantName",
      type: "string",
      defaultValue: '"实时语音助手"',
      description: "语音助手名称",
    },
    { name: "modelLabel", type: "string", defaultValue: "—", description: "模型或通道副标题" },
    { name: "durationLabel", type: "string", defaultValue: "—", description: "等宽通话时长读数" },
    { name: "caption", type: "string", defaultValue: "内置字幕", description: "实时字幕展示文本" },
    {
      name: "speaker",
      type: '"assistant" | "user"',
      defaultValue: '"assistant"',
      description: "字幕发言者标识",
    },
    {
      name: "onStateChange",
      type: "(state: AiOrbState) => void",
      defaultValue: "—",
      description: "语音状态切换回调",
    },
    {
      name: "onEndSession",
      type: "() => void",
      defaultValue: "—",
      description: "结束语音会话回调",
    },
  ],
  accessibility: [
    "四个圆形控制按钮全部提供清晰中文 aria-label 与 aria-pressed 开关状态。",
    "曜石暗色模式声明 [color-scheme:dark] 并确保正文与元信息满足 WCAG AA 对比度。",
  ],
};
