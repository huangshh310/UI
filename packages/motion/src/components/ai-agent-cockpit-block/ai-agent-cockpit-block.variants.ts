import type { AiCockpitMode, AiCockpitVariant } from "./ai-agent-cockpit-block.types.js";

export const COCKPIT_MODES = [
  { value: "chat", label: "智能对话" },
  { value: "voice", label: "实时语音", badge: "Live" },
  { value: "research", label: "深度研究" },
];

export const COCKPIT_QUICK_PROMPTS = [
  "优化 C 端触感光影",
  "生成 AI 组件对比度报告",
  "同步 89 项 Registry 清单",
];

export const COCKPIT_SURFACE_CLASS: Record<AiCockpitVariant, string> = {
  default: "border-border/80 bg-card shadow-xs dark:border-white/10",
  elevated: "border-border/80 bg-card shadow-md dark:border-white/12",
  studio:
    "border-border/80 bg-card shadow-md ring-1 ring-border/40 dark:border-white/12 dark:ring-white/6",
};

export const COCKPIT_MODE_META: Record<
  AiCockpitMode,
  { badge: string; pillClass: string; dotClass: string }
> = {
  chat: {
    badge: "对话就绪",
    pillClass:
      "border-emerald-600/20 bg-emerald-500/12 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/16 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  voice: {
    badge: "语音通道在线",
    pillClass:
      "border-signal/25 bg-signal/10 text-blue-700 dark:border-signal/35 dark:bg-signal/18 dark:text-blue-300",
    dotClass: "bg-signal",
  },
  research: {
    badge: "深度推理中",
    pillClass:
      "border-amber-600/25 bg-amber-500/14 text-amber-900 dark:border-amber-400/25 dark:bg-amber-500/16 dark:text-amber-200",
    dotClass: "bg-amber-500",
  },
};
