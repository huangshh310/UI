import AudioWavesBasicDemo from "@/demos/audio-waves/basic";
import AudioWavesCompactDemo from "@/demos/audio-waves/compact";
import type { ComponentDoc } from "./registry.types";

export const AUDIO_WAVES_DOC: ComponentDoc = {
  slug: "audio-waves",
  name: "Audio Waves",
  description:
    "AI 语音声波律动条与听写胶囊，支持镜像声波、音柱与点阵三种波形，以及曜石暗色和紧凑胶囊形态。",
  category: "ai",
  registryName: "audio-waves",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AudioWaves } from "@/components/ui/audio-waves";

export function Example() {
  return <AudioWaves defaultActive tone="signal" locale="中 / EN" />;
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
      name: "多波形与暗色紧凑胶囊对比",
      description: "组合 variant、tone 与 compact 属性，适配暗色语音面板和聊天输入框内联口述场景。",
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
      type: '"mirror" | "bars" | "dots"',
      defaultValue: '"mirror"',
      description: "声波排列形态（对称镜像、底边对齐音柱或律动点阵）",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "声波区域高度规格",
    },
    {
      name: "tone",
      type: '"default" | "signal" | "emerald" | "obsidian"',
      defaultValue: '"default"',
      description: "外壳与声波色彩风格",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "紧凑胶囊模式（隐藏转写字幕区域）",
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
