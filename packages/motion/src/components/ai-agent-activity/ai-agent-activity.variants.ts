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

export const ACTIVITY_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
  mass: 0.6,
};

export const ACTIVITY_SHELL_VARIANT: Record<AiAgentActivityVariant, string> = {
  card: "rounded-2xl border border-solid border-border/80 bg-card/95 shadow-xs dark:border-white/10 dark:bg-card/85",
  ghost: "border-0 bg-transparent",
  glass:
    "rounded-2xl border border-solid border-border/75 bg-popover/92 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-popover/82",
};

export const ACTIVITY_STATUS_CIRCLE: Record<AiAgentActivityStatus, string> = {
  running:
    "border border-solid border-border/85 bg-card ring-2 ring-emerald-500/22 dark:border-white/15",
  success:
    "border border-solid border-emerald-500/25 bg-emerald-500/12 dark:border-emerald-400/25 dark:bg-emerald-500/16",
  error:
    "border border-solid border-destructive/40 bg-destructive/12 dark:border-destructive dark:bg-destructive/18",
  cancelled: "border border-solid border-border/80 bg-secondary/75 dark:border-white/10",
  pending: "border border-solid border-border/80 bg-card dark:border-white/12",
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
