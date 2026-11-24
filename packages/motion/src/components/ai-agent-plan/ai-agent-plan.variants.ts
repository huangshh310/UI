/**
 * AiAgentPlan 视觉变体与默认步骤定义。
 */
import type { AiAgentPlanVariant, AiPlanStep, AiPlanStepStatus } from "./ai-agent-plan.types.js";

export const PLAN_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const PLAN_DEFAULT_STEPS: AiPlanStep[] = [
  {
    id: "p1",
    title: "检索 11 月京都天气与红叶实况",
    tool: "weather_search",
    duration: "0.4s",
    status: "completed",
  },
  {
    id: "p2",
    title: "筛选东山区步行可达的小众咖啡馆",
    detail: "优先保留无需长队预约且支持手冲单品的独立烘焙店",
    tool: "places_rank",
    duration: "1.2s",
    status: "running",
  },
  { id: "p3", title: "按步行距离排布三天慢逛动线", tool: "route_plan", status: "pending" },
  { id: "p4", title: "生成可离线查看的行程手账卡片", tool: "export_card", status: "pending" },
];

export const PLAN_SHELL_CLASS: Record<AiAgentPlanVariant, string> = {
  card: "rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10",
  timeline: "border-0 bg-transparent",
  compact: "rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10",
};

export const PLAN_HEADER_PADDING: Record<AiAgentPlanVariant, string> = {
  card: "px-4 pt-3.5 pb-3",
  timeline: "pb-3",
  compact: "px-3.5 pt-3 pb-2.5",
};

export const PLAN_FOOTER_PADDING: Record<AiAgentPlanVariant, string> = {
  card: "px-4 py-3",
  timeline: "mt-3 pt-3",
  compact: "px-3.5 py-2.5",
};

export const PLAN_RESET_BTN = `inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-border bg-card px-3 font-sans text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent dark:border-white/10 ${PLAN_FOCUS_RING}`;

export const PLAN_ADVANCE_BTN = `inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-primary bg-primary px-3 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98] ${PLAN_FOCUS_RING}`;

export const PLAN_ROW_TONE: Record<AiPlanStepStatus, string> = {
  completed: "hover:bg-muted/40 dark:hover:bg-white/[0.03]",
  running:
    "bg-signal/[0.04] hover:bg-signal/[0.06] dark:bg-signal/[0.07] dark:hover:bg-signal/[0.1]",
  pending: "hover:bg-muted/40 dark:hover:bg-white/[0.03]",
  failed:
    "bg-destructive/[0.04] hover:bg-destructive/[0.06] dark:bg-destructive/[0.08] dark:hover:bg-destructive/[0.11]",
  skipped: "opacity-75 hover:bg-muted/30 dark:hover:bg-white/[0.02]",
};

export const PLAN_GLYPH_TONE: Record<AiPlanStepStatus, string> = {
  completed:
    "border border-solid border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-400",
  running: "bg-signal/12 text-info dark:bg-signal/20",
  pending: "border border-solid border-border bg-card text-muted-foreground dark:border-white/15",
  failed:
    "border border-solid border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/45 dark:bg-destructive/15",
  skipped:
    "border border-solid border-border/70 bg-muted/60 text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]",
};
