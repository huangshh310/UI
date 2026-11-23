import type { AiThread, AiWorkspaceVariant } from "./ai-workspace-block.types.js";

export const AI_WORKSPACE_MODELS = [
  { id: "claude-sonnet", label: "Claude Sonnet" },
  { id: "gemini-pro", label: "Gemini Pro" },
  { id: "gpt-4o", label: "GPT-4o" },
];

export const AI_WORKSPACE_SUGGESTIONS = [
  "检查浅色与深色对比度",
  "生成 shadcn Registry 命令",
  "审查表单键盘焦点顺序",
];

export const AI_WORKSPACE_DEFAULT_THREADS: AiThread[] = [
  {
    id: "t1",
    title: "设计系统 Token 巡检",
    updatedAt: "刚刚",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "帮我核对新组件在浅色和深色主题下的边框与文字对比度。",
        timestamp: "10:12",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "已核对：信号色 bg-signal 配 text-signal-foreground 在双主题下达到 4.95:1，1px 发丝边框采用 --ui-border，无重边框残留。",
        timestamp: "10:12",
      },
    ],
  },
  {
    id: "t2",
    title: "Registry 分发检查",
    updatedAt: "15 分钟前",
    messages: [
      {
        id: "m3",
        role: "assistant",
        content: "全部 71 个 Registry 条目已生成并通过独立 Vite 消费方构建验证。",
        timestamp: "09:56",
      },
    ],
  },
];

export const AI_WORKSPACE_SHELL_CLASS: Record<AiWorkspaceVariant, string> = {
  split: "@2xl:min-h-[450px] @2xl:flex-row",
  compact: "min-h-[400px] flex-col",
};
