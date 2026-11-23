/**
 * AiAgentActivity 的样式映射与步骤类型标签（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type {
  AiAgentActivityStatus,
  AiAgentActivityType,
  AiAgentActivityVariant,
} from "./ai-agent-activity.types.js";

export const ACTIVITY_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const ACTIVITY_COLLAPSE_TRANSITION = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const ACTIVITY_SHELL_VARIANT: Record<AiAgentActivityVariant, string> = {
  card: "rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10",
  ghost: "border-0 bg-transparent",
  glass:
    "rounded-xl border border-solid border-border bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/85",
};

export const ACTIVITY_STATUS_CIRCLE: Record<AiAgentActivityStatus, string> = {
  running:
    "border border-solid border-signal/35 bg-signal/10 text-signal dark:border-signal/40 dark:bg-signal/15",
  success:
    "border border-solid border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-400",
  error:
    "border border-solid border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/45 dark:bg-destructive/15",
  cancelled:
    "border border-solid border-border bg-muted/60 text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]",
  pending: "border border-solid border-border bg-card text-muted-foreground dark:border-white/12",
};

export const ACTIVITY_TYPE_LABELS: Record<AiAgentActivityType, string> = {
  thinking: "思考",
  searching: "检索",
  reading: "读取",
  writing: "写入",
  tool_execution: "工具",
  api_request: "请求",
  database_query: "查询",
  code_execution: "代码",
  completed: "完成",
  failed: "失败",
  cancelled: "取消",
};
