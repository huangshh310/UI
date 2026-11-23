import type { AiCockpitMode, AiCockpitVariant } from "./ai-agent-cockpit-block.types.js";

export const COCKPIT_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const COCKPIT_MODES = [
  { value: "chat", label: "智能对话" },
  { value: "voice", label: "实时语音" },
  { value: "research", label: "深度研究" },
];

export const COCKPIT_QUICK_PROMPTS = [
  "优化 C 端触感光影",
  "生成 AI 组件对比度报告",
  "同步 89 项 Registry 清单",
];

export const COCKPIT_SURFACE_CLASS: Record<AiCockpitVariant, string> = {
  default: "border-border bg-card shadow-xs dark:border-white/10",
  elevated: "border-border bg-card shadow-sm dark:border-white/12",
  studio:
    "border-border bg-card shadow-sm ring-1 ring-border/50 dark:border-white/12 dark:ring-white/6",
};

/** 精炼状态文字与克制微指示点（告别高饱和彩色大胶囊） */
export const COCKPIT_MODE_META: Record<AiCockpitMode, { badge: string; dotClass: string }> = {
  chat: {
    badge: "对话就绪",
    dotClass: "bg-foreground/75",
  },
  voice: {
    badge: "语音通道在线",
    dotClass: "bg-signal",
  },
  research: {
    badge: "深度推理中",
    dotClass: "bg-signal",
  },
};
