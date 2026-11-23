"use client";

/**
 * AiAgentPlan：自主智能体多步任务规划与执行进度追踪器（参考 Linear Agent / Cursor / Devin）。
 */
import { cn } from "@matt-ui/utils";
import { AlertCircle, Check, Circle, Loader2, Minus, Play, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import type {
  AiAgentPlanProps,
  AiAgentPlanVariant,
  AiPlanStep,
  AiPlanStepStatus,
} from "./ai-agent-plan.types.js";
import {
  PLAN_DEFAULT_STEPS,
  PLAN_GLYPH_TONE,
  PLAN_ROW_TONE,
  PLAN_SHELL_CLASS,
} from "./ai-agent-plan.variants.js";

const StepGlyph = ({ status }: { status: AiPlanStepStatus }) => {
  const iconMap: Record<AiPlanStepStatus, ReactNode> = {
    completed: <Check aria-hidden="true" className="size-3" />,
    running: (
      <Loader2 aria-hidden="true" className="size-3 animate-spin motion-reduce:animate-none" />
    ),
    pending: <Circle aria-hidden="true" className="size-2" />,
    failed: <AlertCircle aria-hidden="true" className="size-3" />,
    skipped: <Minus aria-hidden="true" className="size-3" />,
  };
  return (
    <span
      className={cn(
        "relative z-10 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
        PLAN_GLYPH_TONE[status],
      )}
    >
      {iconMap[status]}
    </span>
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
  done: number;
  total: number;
  pct: number;
  finished: boolean;
  reduced: boolean | null;
}

const PlanHeader = ({ title, subtitle, done, total, pct, finished, reduced }: HeaderProps) => (
  <div className="flex flex-col gap-2.5">
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-[13px] font-semibold tracking-tight text-foreground">
          {title}
        </span>
        {subtitle && (
          <span className="truncate font-mono text-[11px] text-muted-foreground">{subtitle}</span>
        )}
      </div>
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-solid px-2.5 py-0.5 font-mono text-[11px] font-medium tabular-nums",
          finished
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : "border-border/80 bg-secondary/75 text-foreground",
        )}
      >
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", finished ? "bg-emerald-500" : "bg-signal")}
        />
        {done} / {total} 步 · {pct}%
      </span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <motion.div
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
        className={cn(
          "h-full rounded-full transition-colors",
          finished ? "bg-emerald-500" : "bg-signal",
        )}
      />
    </div>
  </div>
);

const StepMetaTags = ({ tool, duration }: { tool?: string; duration?: string }) => (
  <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
    {tool && (
      <span className="rounded-md border border-solid border-border/60 bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        {tool}
      </span>
    )}
    {duration && (
      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{duration}</span>
    )}
  </div>
);

const stepTitleClass = (status: AiPlanStepStatus) =>
  cn(
    "truncate font-medium leading-snug",
    status === "pending" || status === "skipped" ? "text-muted-foreground" : "text-foreground",
    status === "skipped" && "line-through",
  );

const PlanStepRow = ({
  step,
  variant,
  isLast,
}: {
  step: AiPlanStep;
  variant: AiAgentPlanVariant;
  isLast: boolean;
}) => {
  const isTimeline = variant === "timeline";
  const boxClass = isTimeline
    ? "py-2 pl-0"
    : cn(
        "rounded-xl border border-solid",
        variant === "compact" ? "px-2.5 py-2" : "px-3 py-2.5",
        PLAN_ROW_TONE[step.status],
      );

  return (
    <li
      data-status={step.status}
      className={cn(
        "relative flex items-start justify-between gap-2.5 text-xs transition-colors",
        boxClass,
      )}
    >
      {isTimeline && !isLast && (
        <span
          aria-hidden="true"
          className="absolute top-7 bottom-[-8px] left-[9.5px] w-px bg-border/80"
        />
      )}
      <div className="flex min-w-0 items-start gap-2.5">
        <StepGlyph status={step.status} />
        <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
          <span className={stepTitleClass(step.status)}>{step.title}</span>
          {step.detail && variant !== "compact" && (
            <span className="text-[11px] leading-relaxed text-muted-foreground">{step.detail}</span>
          )}
        </div>
      </div>
      <StepMetaTags tool={step.tool} duration={step.duration} />
    </li>
  );
};

const PlanFooter = ({
  finished,
  onReset,
  onAdvance,
}: {
  finished: boolean;
  onReset: () => void;
  onAdvance: () => void;
}) => (
  <div className="flex items-center justify-between gap-2 border-t border-solid border-border/70 pt-3">
    <span className="text-[11px] text-muted-foreground">
      {finished ? "所有步骤已自动验收完成" : "实时追踪工具调用与状态跃迁"}
    </span>
    {finished ? (
      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-7.5 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-border bg-card px-3 font-sans text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw aria-hidden="true" className="size-3" />
        <span>重置计划</span>
      </button>
    ) : (
      <button
        type="button"
        onClick={onAdvance}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-primary bg-primary px-3.5 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Play aria-hidden="true" className="size-3" />
        <span>推进下一步</span>
      </button>
    )}
  </div>
);

const PlanStepList = ({ steps, variant }: { steps: AiPlanStep[]; variant: AiAgentPlanVariant }) => (
  <ol
    className={cn(
      "m-0 flex list-none flex-col p-0",
      variant === "timeline" ? "gap-0.5" : "gap-1.5",
    )}
  >
    {steps.map((step, idx) => (
      <PlanStepRow key={step.id} step={step} variant={variant} isLast={idx === steps.length - 1} />
    ))}
  </ol>
);

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
        "flex w-full max-w-xl flex-col border border-solid text-card-foreground",
        PLAN_SHELL_CLASS[variant],
        props.className,
      )}
    >
      <PlanHeader
        title={props.title ?? "智能体执行计划"}
        subtitle={props.subtitle}
        done={done}
        total={steps.length}
        pct={pct}
        finished={finished}
        reduced={reduced}
      />
      <PlanStepList steps={steps} variant={variant} />
      {(props.showControls ?? true) && (
        <PlanFooter
          finished={finished}
          onReset={() => setSteps(initialSteps)}
          onAdvance={handleAdvance}
        />
      )}
    </div>
  );
};
