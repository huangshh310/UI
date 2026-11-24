// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiAgentPlan：自主智能体多步任务规划与执行进度清单。
 */

import { cn } from "@/lib/utils";
import { AlertCircle, Check, Loader2, Minus, Play, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";

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
  running:
    "border border-solid border-signal/35 bg-signal/10 text-signal dark:border-signal/40 dark:bg-signal/15",
  pending: "border border-solid border-border bg-card text-muted-foreground dark:border-white/15",
  failed:
    "border border-solid border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/45 dark:bg-destructive/15",
  skipped:
    "border border-solid border-border/70 bg-muted/60 text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]",
};
export type AiPlanStepStatus = "completed" | "running" | "pending" | "failed" | "skipped";
export type AiAgentPlanVariant = "card" | "timeline" | "compact";

export interface AiPlanStep {
  id: string;
  title: string;
  /** 可选步骤补充说明 */
  detail?: string;
  tool?: string;
  duration?: string;
  status: AiPlanStepStatus;
}

export interface AiAgentPlanProps {
  /** 任务计划标题 */
  title?: string;
  /** 副标题或运行环境标识（如 "Matt Pro · Autonomous"） */
  subtitle?: string;
  /** 视觉布局形态：标准卡片（card）、时间轴轨道（timeline）或紧凑面板（compact） */
  variant?: AiAgentPlanVariant;
  /** 是否显示底部步进控制栏 */
  showControls?: boolean;
  /** 初始执行步骤 */
  initialSteps?: AiPlanStep[];
  /** 步骤推进回调 */
  onStepAdvance?: (completedCount: number, totalCount: number) => void;
  /** 自定义类名 */
  className?: string;
}
const StepGlyph = ({ status, reduced }: { status: AiPlanStepStatus; reduced: boolean | null }) => {
  const iconMap: Record<AiPlanStepStatus, ReactNode> = {
    completed: <Check aria-hidden="true" className="size-3 stroke-[2.25]" />,
    running: (
      <Loader2 aria-hidden="true" className="size-3 animate-spin motion-reduce:animate-none" />
    ),
    pending: (
      <span aria-hidden="true" className="size-1.5 rounded-full bg-border dark:bg-white/25" />
    ),
    failed: <AlertCircle aria-hidden="true" className="size-3" />,
    skipped: <Minus aria-hidden="true" className="size-3" />,
  };
  return (
    <motion.span
      key={status}
      initial={reduced ? false : { scale: 0.88, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.16, ease: "easeOut" }}
      className={cn(
        "relative z-10 mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
        PLAN_GLYPH_TONE[status],
      )}
    >
      {iconMap[status]}
    </motion.span>
  );
};

const advancePlan = (steps: AiPlanStep[]): AiPlanStep[] => {
  const runningIdx = steps.findIndex((s) => s.status === "running");
  if (runningIdx === -1) return steps;
  return steps.map((step, i) => {
    if (i === runningIdx)
      return { ...step, status: "completed", duration: step.duration ?? "0.9s" };
    if (i === runningIdx + 1) return { ...step, status: "running" };
    return step;
  });
};

interface HeaderProps {
  title: string;
  subtitle?: string;
  variant: AiAgentPlanVariant;
  done: number;
  total: number;
  pct: number;
  finished: boolean;
  reduced: boolean | null;
}

const PlanHeader = (p: HeaderProps) => (
  <div className={cn("flex flex-col gap-2.5", PLAN_HEADER_PADDING[p.variant])}>
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-[13px] font-medium tracking-tight text-foreground">
          {p.title}
        </span>
        {p.subtitle && (
          <span className="truncate font-mono text-[11px] text-muted-foreground">{p.subtitle}</span>
        )}
      </div>
      <span
        className={cn(
          "shrink-0 font-mono text-[11px] font-medium tabular-nums",
          p.finished ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
        )}
      >
        {p.done} / {p.total} 步 · {p.pct}%
      </span>
    </div>
    <div className="h-0.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/10">
      <motion.div
        initial={false}
        animate={{ width: `${p.pct}%` }}
        transition={{ duration: p.reduced ? 0 : 0.3, ease: "easeOut" }}
        className={cn(
          "h-full rounded-full transition-colors",
          p.finished ? "bg-emerald-500" : "bg-signal",
        )}
      />
    </div>
  </div>
);

const StepMetaTags = ({ tool, duration }: { tool?: string; duration?: string }) => (
  <div className="flex shrink-0 items-center gap-2 pt-0.5">
    {tool && (
      <span className="rounded-md bg-muted/65 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground dark:bg-white/[0.06]">
        {tool}
      </span>
    )}
    {duration && (
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{duration}</span>
    )}
  </div>
);

const stepTitleClass = (status: AiPlanStepStatus) =>
  cn(
    "truncate text-[13px] leading-snug tracking-tight",
    status === "running" ? "font-medium text-foreground" : "font-normal",
    status === "pending" || status === "skipped" ? "text-muted-foreground" : "text-foreground",
    status === "skipped" && "line-through",
  );

const TimelinePlanRow = ({
  step,
  isLast,
  reduced,
}: {
  step: AiPlanStep;
  isLast: boolean;
  reduced: boolean | null;
}) => (
  <li data-status={step.status} className="flex gap-3">
    <div className="flex w-5 shrink-0 flex-col items-center">
      <StepGlyph status={step.status} reduced={reduced} />
      {!isLast && (
        <span aria-hidden="true" className="my-1 w-px flex-1 bg-border/80 dark:bg-white/10" />
      )}
    </div>
    <div
      className={cn("flex min-w-0 flex-1 items-start justify-between gap-3", !isLast && "pb-3.5")}
    >
      <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
        <span className={stepTitleClass(step.status)}>{step.title}</span>
        {step.detail && (
          <span className="text-xs leading-relaxed text-muted-foreground">{step.detail}</span>
        )}
      </div>
      <StepMetaTags tool={step.tool} duration={step.duration} />
    </div>
  </li>
);

const ListPlanRow = ({
  step,
  compact,
  reduced,
}: {
  step: AiPlanStep;
  compact: boolean;
  reduced: boolean | null;
}) => (
  <li
    data-status={step.status}
    className={cn(
      "flex items-start justify-between gap-3 transition-colors duration-(--ui-duration-fast)",
      compact ? "px-3.5 py-2" : "px-4 py-2.5",
      PLAN_ROW_TONE[step.status],
    )}
  >
    <div className="flex min-w-0 items-start gap-2.5">
      <StepGlyph status={step.status} reduced={reduced} />
      <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
        <span className={stepTitleClass(step.status)}>{step.title}</span>
        {step.detail && !compact && (
          <span className="text-xs leading-relaxed text-muted-foreground">{step.detail}</span>
        )}
      </div>
    </div>
    <StepMetaTags tool={step.tool} duration={step.duration} />
  </li>
);

interface PlanFooterProps {
  variant: AiAgentPlanVariant;
  finished: boolean;
  onReset: () => void;
  onAdvance: () => void;
}

const PlanFooter = ({ variant, finished, onReset, onAdvance }: PlanFooterProps) => (
  <div
    className={cn(
      "flex items-center justify-between gap-3 border-t border-solid border-border/75 dark:border-white/10",
      PLAN_FOOTER_PADDING[variant],
    )}
  >
    <span className="text-xs text-muted-foreground">
      {finished ? "所有步骤已自动验收完成" : "实时追踪工具调用与状态跃迁"}
    </span>
    {finished ? (
      <button type="button" onClick={onReset} className={PLAN_RESET_BTN}>
        <RotateCcw aria-hidden="true" className="size-3.5" />
        <span>重置计划</span>
      </button>
    ) : (
      <button type="button" onClick={onAdvance} className={PLAN_ADVANCE_BTN}>
        <Play aria-hidden="true" className="size-3.5" />
        <span>推进下一步</span>
      </button>
    )}
  </div>
);

const PlanStepList = ({
  steps,
  variant,
  reduced,
}: {
  steps: AiPlanStep[];
  variant: AiAgentPlanVariant;
  reduced: boolean | null;
}) => {
  if (variant === "timeline") {
    return (
      <ol className="m-0 flex list-none flex-col p-0 pt-1">
        {steps.map((step, idx) => (
          <TimelinePlanRow
            key={step.id}
            step={step}
            isLast={idx === steps.length - 1}
            reduced={reduced}
          />
        ))}
      </ol>
    );
  }
  return (
    <ol className="m-0 flex list-none flex-col divide-y divide-border/70 border-t border-solid border-border/70 p-0 dark:divide-white/10 dark:border-white/10">
      {steps.map((step) => (
        <ListPlanRow key={step.id} step={step} compact={variant === "compact"} reduced={reduced} />
      ))}
    </ol>
  );
};

export const AiAgentPlan = (props: AiAgentPlanProps) => {
  const variant = props.variant ?? "card";
  const initialSteps = props.initialSteps ?? PLAN_DEFAULT_STEPS;
  const reduced = useReducedMotion();
  const [steps, setSteps] = useState<AiPlanStep[]>(initialSteps);
  const done = steps.filter((s) => s.status === "completed").length;
  const pct = Math.round((done / Math.max(1, steps.length)) * 100);
  const finished = done === steps.length;

  const handleAdvance = () => {
    const next = advancePlan(steps);
    setSteps(next);
    props.onStepAdvance?.(next.filter((s) => s.status === "completed").length, next.length);
  };

  return (
    <div
      data-slot="ai-agent-plan"
      data-variant={variant}
      className={cn(
        "flex w-full flex-col overflow-hidden text-card-foreground",
        PLAN_SHELL_CLASS[variant],
        props.className,
      )}
    >
      <PlanHeader
        title={props.title ?? "智能体执行计划"}
        subtitle={props.subtitle}
        variant={variant}
        done={done}
        total={steps.length}
        pct={pct}
        finished={finished}
        reduced={reduced}
      />
      <PlanStepList steps={steps} variant={variant} reduced={reduced} />
      {(props.showControls ?? true) && (
        <PlanFooter
          variant={variant}
          finished={finished}
          onReset={() => setSteps(initialSteps)}
          onAdvance={handleAdvance}
        />
      )}
    </div>
  );
};
