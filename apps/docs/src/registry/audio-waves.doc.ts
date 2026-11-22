import AudioWavesBasicDemo from "@/demos/audio-waves/basic";
import AudioWavesCompactDemo from "@/demos/audio-waves/compact";
import type { ComponentDoc } from "./registry.types";

export const AUDIO_WAVES_DOC: ComponentDoc = {
  slug: "audio-waves",
  name: "Audio Waves",
  description: "AI 语音声波律动条与听写胶囊，支持实时声波动画、聆听/暂停切换与计时读数。",
  category: "ai",
  registryName: "audio-waves",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AudioWaves } from "@/components/ui/audio-waves";

export function Example() {
  return <AudioWaves defaultActive />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "实时语音声波与聆听切换",
      description: "点击左侧麦克风/暂停按钮即可在动态声波律动与静默暂停态之间切换。",
      file: "audio-waves/basic.tsx",
      Demo: AudioWavesBasicDemo,
    },
    {
      slug: "compact",
      name: "多规格音柱密度对比",
      description: "通过 bars 自定义音柱数量，适配长句实时转写与紧凑内联口述条。",
      file: "audio-waves/compact.tsx",
      Demo: AudioWavesCompactDemo,
      directory: false,
    },
  ],
  api: [
    { name: "active", type: "boolean", defaultValue: "—", description: "受控聆听激活态" },
    { name: "defaultActive", type: "boolean", defaultValue: "true", description: "非受控初始状态" },
    {
      name: "onActiveChange",
      type: "(active: boolean) => void",
      defaultValue: "—",
      description: "聆听状态切换回调",
    },
    {
      name: "variant",
      type: '"bars" | "mirror"',
      defaultValue: '"mirror"',
      description: "声波排列形态（对称镜像或底边对齐音柱）",
    },
    { name: "bars", type: "number", defaultValue: "14", description: "声波音柱数量" },
    { name: "label", type: "string", defaultValue: "按状态自动切换", description: "右侧状态文案" },
    { name: "durationLabel", type: "string", defaultValue: '"00:14"', description: "等宽计时读数" },
    {
      name: "transcript",
      type: "string",
      defaultValue: "—",
      description: "可选实时语音转写字幕预览",
    },
    { name: "locale", type: "string", defaultValue: "—", description: "可选识别语种徽章" },
  ],
  accessibility: [
    "触发按钮声明 aria-pressed 与动态 aria-label（「暂停语音输入」/「开始语音输入」）。",
    "声波装饰条标记 aria-hidden，减弱动效模式下自动静止为低高度音柱。",
  ],
};
