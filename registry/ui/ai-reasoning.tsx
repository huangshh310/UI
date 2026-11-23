// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiReasoning：Claude / DeepSeek / o3 风格的深度思考与思维链可折叠推理轨迹卡片。
 */

import { cn } from "@/lib/utils";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type AiReasoningStatus = "thinking" | "completed";

export interface AiReasoningStep {
  id: string;
  title: string;
  detail?: string;
  duration?: string;
  tag?: string;
}

export interface AiReasoningProps {
  /** 当前推理状态 */
  status?: AiReasoningStatus;
  /** 思考总耗时文本 */
  durationLabel?: string;
  /** 思维链步骤列表 */
  steps?: AiReasoningStep[];
  /** 默认是否展开详细思考轨迹 */
  defaultExpanded?: boolean;
  /** 自定义类名 */
  className?: string;
}
const DEFAULT_STEPS: AiReasoningStep[] = [
  {
    id: "s1",
    tag: "天气",
    title: "查询京都本周末天气与日落时间",
    detail: "周六多云转晴 21°C，鸭川日落约 17:42，适合户外步行。",
    duration: "0.6s",
  },
  {
    id: "s2",
    tag: "路线",
    title: "按步行距离串联东山与冈崎街区",
    detail: "南禅寺 → 哲学之道 → 京瓷美术馆总步行约 3.2 公里。",
    duration: "0.9s",
  },
  {
    id: "s3",
    tag: "精选",
    title: "筛选高评分手冲咖啡馆与晚餐位置",
    detail: "剔除需长队预约门店，保留三家可直接到店的小馆。",
    duration: "0.5s",
  },
];

const StepTimeline = ({
  steps,
  reduced,
}: {
  steps: AiReasoningStep[];
  reduced: boolean | null;
}) => (
  <div className="border-t border-solid border-border/70 px-4 py-3.5">
    <ol className="m-0 flex list-none flex-col gap-3 border-l border-solid border-border pl-4">
      {steps.map((step, idx) => (
        <motion.li
          key={step.id}
          initial={reduced ? false : { opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, delay: idx * 0.04 }}
          className="relative flex flex-col gap-0.5"
        >
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-[20.5px] size-2 rounded-full border border-solid border-border bg-card"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-[13px] font-medium text-foreground">{step.title}</span>
              {step.tag && (
                <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {step.tag}
                </span>
              )}
            </div>
            {step.duration && (
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                {step.duration}
              </span>
            )}
          </div>
          {step.detail && (
            <p className="m-0 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
          )}
        </motion.li>
      ))}
    </ol>
  </div>
);

const ReasoningBadge = ({ status }: { status: AiReasoningStatus }) => (
  <span
    className={cn(
      "inline-flex size-7 items-center justify-center rounded-full",
      status === "thinking" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
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
