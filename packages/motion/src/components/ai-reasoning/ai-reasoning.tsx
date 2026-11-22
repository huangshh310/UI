"use client";

/**
 * AiReasoning：Claude / DeepSeek / o3 风格的深度思考与思维链可折叠推理轨迹卡片。
 */
import { cn } from "@matt-ui/utils";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { AiReasoningProps, AiReasoningStatus, AiReasoningStep } from "./ai-reasoning.types.js";

const DEFAULT_STEPS: AiReasoningStep[] = [
  {
    id: "s1",
    tag: "检索",
    title: "检索设计 Token 与对比度基线",
    detail: "定位 --ui-specular 高光变量与 WCAG AA 4.5:1 阈值。",
    duration: "0.8s",
  },
  {
    id: "s2",
    tag: "推理",
    title: "构建单交互底座无障碍状态机",
    detail: "隔离底座类型并绑定方向键与焦点环。",
    duration: "1.1s",
  },
  {
    id: "s3",
    tag: "生成",
    title: "生成 shadcn Registry 单文件产物",
    detail: "扁平化子模块并登记 registryDependencies。",
    duration: "0.7s",
  },
];

const StepTimeline = ({
  steps,
  reduced,
}: {
  steps: AiReasoningStep[];
  reduced: boolean | null;
}) => (
  <div className="border-t border-solid border-border/75 bg-secondary/30 px-4 py-3">
    <ol className="m-0 flex list-none flex-col gap-2.5 border-l-2 border-solid border-signal/35 pl-3.5">
      {steps.map((step, idx) => (
        <motion.li
          key={step.id}
          initial={reduced ? false : { x: -3 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.16, delay: idx * 0.04 }}
          className="relative flex flex-col gap-0.5 rounded-xl border border-solid border-border/65 bg-card/90 px-3 py-2 shadow-xs"
        >
          <span
            aria-hidden="true"
            className="absolute top-3 -left-[20.5px] size-2.5 rounded-full border-2 border-solid border-card bg-signal shadow-xs"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              {step.tag && (
                <span className="shrink-0 rounded-md bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-800 dark:bg-blue-400/15 dark:text-blue-200">
                  {step.tag}
                </span>
              )}
              <span className="truncate text-xs font-semibold text-foreground">{step.title}</span>
            </div>
            {step.duration && (
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                {step.duration}
              </span>
            )}
          </div>
          {step.detail && <p className="m-0 text-xs text-muted-foreground">{step.detail}</p>}
        </motion.li>
      ))}
    </ol>
  </div>
);

const ReasoningBadge = ({ status }: { status: AiReasoningStatus }) => (
  <span
    className={cn(
      "inline-flex size-7 items-center justify-center rounded-xl border border-solid shadow-xs",
      status === "thinking"
        ? "border-signal bg-gradient-to-br from-signal to-indigo-600 text-signal-foreground"
        : "border-signal/25 bg-signal/10 text-signal",
    )}
  >
    <Sparkles aria-hidden="true" className="size-3.5" />
  </span>
);

const ReasoningHeader = (p: {
  status: AiReasoningStatus;
  durationLabel: string;
  stepCount: number;
  expanded: boolean;
  preview?: string;
  onToggle: () => void;
}) => (
  <button
    type="button"
    aria-expanded={p.expanded}
    onClick={p.onToggle}
    className="flex w-full cursor-pointer flex-col gap-1 border-0 bg-transparent px-4 py-3 text-left transition-colors hover:bg-accent/40 outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <ReasoningBadge status={p.status} />
        <span className="text-xs font-semibold text-foreground">
          {p.status === "thinking" ? "正在深度推理…" : "已完成深度推理"}
        </span>
        <span className="rounded-full border border-solid border-border/80 bg-secondary/75 px-2.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
          {p.durationLabel} · {p.stepCount} 步
        </span>
      </div>
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "size-4 text-muted-foreground transition-transform duration-(--ui-duration-fast)",
          p.expanded && "rotate-180",
        )}
      />
    </div>
    {!p.expanded && p.preview && (
      <span className="truncate pl-9.5 text-xs text-muted-foreground">{p.preview}</span>
    )}
  </button>
);

export const AiReasoning = ({
  status = "completed",
  durationLabel = "2.6s",
  steps = DEFAULT_STEPS,
  defaultExpanded = true,
  className,
}: AiReasoningProps) => {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      data-slot="ai-reasoning"
      data-status={status}
      className={cn(
        "w-full max-w-xl overflow-hidden rounded-[22px] border border-solid border-border/90 bg-card text-card-foreground shadow-md",
        className,
      )}
    >
      <ReasoningHeader
        status={status}
        durationLabel={durationLabel}
        stepCount={steps.length}
        expanded={expanded}
        preview={steps[steps.length - 1]?.title}
        onToggle={() => setExpanded((prev) => !prev)}
      />
      {expanded && <StepTimeline steps={steps} reduced={reduced} />}
    </div>
  );
};
