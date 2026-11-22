import AiVoiceStageBasicDemo from "@/demos/ai-voice-stage/basic";
import AiVoiceStageSpeakingDemo from "@/demos/ai-voice-stage/speaking";
import type { ComponentDoc } from "./registry.types";

export const AI_VOICE_STAGE_DOC: ComponentDoc = {
  slug: "ai-voice-stage",
  name: "AI Voice Stage",
  description: "C 端全模态实时语音交互舞台，集成流体极光状态球、实时字幕与圆形通话控制栏。",
  category: "ai",
  registryName: "ai-voice-stage",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { AiVoiceStage } from "@/components/ui/ai-voice-stage";

export function Example() {
  return <AiVoiceStage />;
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
      name: "语音回复播放态预览",
      description: '以 defaultState="speaking" 展示翡翠青蓝流体极光与自定义助手播报字幕。',
      file: "ai-voice-stage/speaking.tsx",
      Demo: AiVoiceStageSpeakingDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "defaultState",
      type: "AiOrbState",
      defaultValue: '"listening"',
      description: "初始语音交互状态",
    },
    {
      name: "assistantName",
      type: "string",
      defaultValue: '"Matt Live Voice"',
      description: "语音助手名称",
    },
    { name: "caption", type: "string", defaultValue: "内置字幕", description: "实时字幕展示文本" },
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
  accessibility: ["四个圆形控制按钮全部提供清晰中文 aria-label 与 aria-pressed 开关状态。"],
};
