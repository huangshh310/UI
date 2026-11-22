"use client";

/**
 * AiAgentPlan：自主智能体多步任务规划与执行进度追踪器（参考 Devin / Manus / Deep Research）。
 */
import { cn } from "@matt-ui/utils";
import { Check, Circle, Loader2, Play, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { AiAgentPlanProps, AiPlanStep, AiPlanStepStatus } from "./ai-agent-plan.types.js";

const DEFAULT_STEPS: AiPlanStep[] = [
  {
    id: "p1",
    title: "扫描双主题设计令牌与阴影阶梯",
    tool: "read_tokens",
    duration: "0.4s",
    status: "completed",
  },
  {
    id: "p2",
    title: "合成 15 款 C 端 AI 交互组件",
    tool: "generate_ui",
    duration: "1.9s",
    status: "running",
  },
  { id: "p3", title: "扁平化 shadcn Registry 清单", tool: "registry_build", status: "pending" },
  { id: "p4", title: "运行双主题 Playwright axe 门禁", tool: "run_e2e", status: "pending" },
];

const StepGlyph = ({ status }: { status: AiPlanStepStatus }) => {
  if (status === "completed") {
    return (
      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
        <Check aria-hidden="true" className="size-3" />
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-signal/15 text-signal">
        <Loader2 aria-hidden="true" className="size-3 animate-spin motion-reduce:animate-none" />
      </span>
    );
  }
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
      <Circle aria-hidden="true" className="size-2.5" />
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

const PlanHeader = ({
  title,
  done,
  total,
  pct,
  reduced,
}: {
  title: string;
  done: number;
  total: number;
  pct: number;
  reduced: boolean | null;
}) => (
  <div className="flex flex-col gap-2.5">
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-semibold text-foreground">{title}</span>
      <span className="rounded-full border border-solid border-border/80 bg-secondary/75 px-2.5 py-0.5 font-mono text-[11px] font-medium text-foreground tabular-nums">
        {done} / {total} 步 · {pct}%
      </span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <motion.div
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-signal via-indigo-500 to-emerald-500"
      />
    </div>
  </div>
);

const PlanStepList = ({ steps }: { steps: AiPlanStep[] }) => (
  <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
    {steps.map((step) => (
      <li
        key={step.id}
        className={cn(
          "flex items-center justify-between gap-2.5 rounded-xl border border-solid px-3 py-2 text-xs transition-colors",
          step.status === "running"
            ? "border-signal/55 bg-signal/8 shadow-xs"
            : "border-border/70 bg-secondary/25",
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <StepGlyph status={step.status} />
          <span
            className={cn(
              "truncate font-medium",
              step.status === "pending" ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {step.title}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {step.tool && (
            <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {step.tool}
            </span>
          )}
          {step.duration && (
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              {step.duration}
            </span>
          )}
        </div>
      </li>
    ))}
  </ol>
);

const PlanFooter = ({
  finished,
  onReset,
  onAdvance,
}: {
  finished: boolean;
  onReset: () => void;
  onAdvance: () => void;
}) => (
  <div className="flex items-center justify-between gap-2 border-t border-solid border-border/70 pt-2.5">
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
        className="inline-flex h-7.5 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-signal bg-signal px-3 font-sans text-xs font-medium text-signal-foreground shadow-sm transition-opacity hover:opacity-92 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <Play aria-hidden="true" className="size-3" />
        <span>推进下一步</span>
      </button>
    )}
  </div>
);

export const AiAgentPlan = ({
  title = "智能体执行计划",
  initialSteps = DEFAULT_STEPS,
  onStepAdvance,
  className,
}: AiAgentPlanProps) => {
  const reduced = useReducedMotion();
  const [steps, setSteps] = useState<AiPlanStep[]>(initialSteps);
  const done = steps.filter((s) => s.status === "completed").length;
  const pct = Math.round((done / Math.max(1, steps.length)) * 100);
  const handleAdvance = () => {
    const next = advancePlan(steps);
    setSteps(next);
    onStepAdvance?.(next.filter((s) => s.status === "completed").length, next.length);
  };

  return (
    <div
      data-slot="ai-agent-plan"
      className={cn(
        "flex w-full max-w-xl flex-col gap-3.5 rounded-[22px] border border-solid border-border/90 bg-card p-4 text-card-foreground shadow-md",
        className,
      )}
    >
      <PlanHeader title={title} done={done} total={steps.length} pct={pct} reduced={reduced} />
      <PlanStepList steps={steps} />
      <PlanFooter
        finished={done === steps.length}
        onReset={() => setSteps(initialSteps)}
        onAdvance={handleAdvance}
      />
    </div>
  );
};
