/**
 * AiAgentPlan 视觉变体与默认步骤定义。
 */
import type { AiAgentPlanVariant, AiPlanStep, AiPlanStepStatus } from "./ai-agent-plan.types.js";

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
  card: "gap-4 rounded-2xl border-border/85 bg-card p-5 shadow-xs",
  timeline: "gap-4 rounded-2xl border-border/85 bg-card p-5 shadow-xs",
  compact: "gap-3 rounded-xl border-border/80 bg-card p-3.5 shadow-xs",
};

export const PLAN_ROW_TONE: Record<AiPlanStepStatus, string> = {
  completed: "border-border/60 bg-background/60 dark:bg-secondary/20",
  running: "border-signal/35 bg-signal/[0.04] shadow-2xs",
  pending: "border-border/55 bg-background/40 dark:bg-secondary/15",
  failed: "border-destructive/35 bg-destructive/[0.05]",
  skipped: "border-border/45 bg-secondary/25 opacity-75",
};

export const PLAN_GLYPH_TONE: Record<AiPlanStepStatus, string> = {
  completed: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  running: "bg-signal text-signal-foreground shadow-xs",
  pending: "bg-secondary text-muted-foreground",
  failed: "bg-destructive/15 text-destructive",
  skipped: "bg-secondary/80 text-muted-foreground",
};
