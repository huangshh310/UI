// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiReasoning：Claude / DeepSeek / o3 风格的深度思考与思维链可折叠推理轨迹卡片。
 */

import { cn } from "@/lib/utils";
import { Check, ChevronDown, Loader2, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export const REASONING_DEFAULT_STEPS: AiReasoningStep[] = [
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

export const REASONING_SHELL_CLASS: Record<AiReasoningVariant, string> = {
  card: "rounded-2xl border border-solid border-border/85 bg-card text-card-foreground shadow-xs",
  ghost: "rounded-xl border border-solid border-border/65 bg-secondary/35 text-card-foreground",
  inline: "rounded-lg border-0 bg-transparent text-foreground",
};
export type AiReasoningStatus = "thinking" | "completed";
export type AiReasoningVariant = "card" | "ghost" | "inline";

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
  /** 视觉变体：标准卡片（card）、柔光内嵌（ghost）或极简行内折叠（inline） */
  variant?: AiReasoningVariant;
  /** 自定义标题文案（默认按 status 自动生成） */
  title?: string;
  /** 思考总耗时文本 */
  durationLabel?: string;
  /** 可选思考 Token 计数（如 "486 tok"） */
  tokensLabel?: string;
  /** 思维链步骤列表 */
  steps?: AiReasoningStep[];
  /** 受控展开状态 */
  expanded?: boolean;
  /** 默认是否展开详细思考轨迹 */
  defaultExpanded?: boolean;
  /** 展开状态变化回调 */
  onExpandedChange?: (expanded: boolean) => void;
  /** 自定义类名 */
  className?: string;
}
const TimelineStepItem = ({
  step,
  idx,
  isActiveStep,
  reduced,
}: {
  step: AiReasoningStep;
  idx: number;
  isActiveStep: boolean;
  reduced: boolean | null;
}) => (
  <motion.li
    initial={reduced ? false : { opacity: 0, y: 2 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.16, delay: idx * 0.04 }}
    className="relative flex flex-col gap-0.5"
  >
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-1.5 -left-[20.5px] size-2 rounded-full border border-solid",
        isActiveStep
          ? "border-signal bg-signal shadow-[0_0_0_3px_color-mix(in_srgb,var(--ui-signal)_18%,transparent)]"
          : "border-border bg-card",
      )}
    />
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-[13px] font-medium text-foreground">{step.title}</span>
        {step.tag && (
          <span className="shrink-0 rounded-md border border-solid border-border/60 bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
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
);

const StepTimeline = ({
  steps,
  status,
  variant,
  reduced,
}: {
  steps: AiReasoningStep[];
  status: AiReasoningStatus;
  variant: AiReasoningVariant;
  reduced: boolean | null;
}) => (
  <motion.div
    initial={reduced ? false : { opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: reduced ? 0 : 0.16, ease: "easeOut" }}
    className={cn(
      variant === "inline"
        ? "pt-2 pb-1 pl-3"
        : "border-t border-solid border-border/70 px-4 py-3.5",
    )}
  >
    <ol className="m-0 flex list-none flex-col gap-3 border-l border-solid border-border/85 pl-4">
      {steps.map((step, idx) => (
        <TimelineStepItem
          key={step.id}
          step={step}
          idx={idx}
          isActiveStep={status === "thinking" && idx === steps.length - 1}
          reduced={reduced}
        />
      ))}
    </ol>
  </motion.div>
);

const ReasoningBadge = ({ status }: { status: AiReasoningStatus }) => (
  <span
    className={cn(
      "inline-flex size-6.5 shrink-0 items-center justify-center rounded-full",
      status === "thinking"
        ? "bg-signal/12 text-signal"
        : "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    )}
  >
    {status === "thinking" ? (
      <Loader2 aria-hidden="true" className="size-3.5 animate-spin motion-reduce:animate-none" />
    ) : (
      <Sparkles aria-hidden="true" className="size-3.5" />
    )}
  </span>
);

interface HeaderProps {
  status: AiReasoningStatus;
  variant: AiReasoningVariant;
  title?: string;
  durationLabel: string;
  tokensLabel?: string;
  stepCount: number;
  expanded: boolean;
  preview?: string;
  onToggle: () => void;
}

const ReasoningHeader = (p: HeaderProps) => {
  const heading = p.title ?? (p.status === "thinking" ? "正在深度推理…" : "已完成深度推理");
  return (
    <button
      type="button"
      aria-expanded={p.expanded}
      onClick={p.onToggle}
      className={cn(
        "flex w-full cursor-pointer flex-col gap-1 border-0 bg-transparent text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        p.variant === "inline"
          ? "rounded-lg px-2 py-1.5 hover:bg-accent/50"
          : "px-4 py-3 hover:bg-accent/40",
      )}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <ReasoningBadge status={p.status} />
          <span className="text-xs font-semibold tracking-tight text-foreground">{heading}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-solid border-border/75 bg-secondary/75 px-2.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
            {p.status === "completed" && (
              <Check aria-hidden="true" className="size-3 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>
              {p.durationLabel} · {p.stepCount} 步
            </span>
          </span>
          {p.tokensLabel && (
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {p.tokensLabel}
            </span>
          )}
        </div>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-fast)",
            p.expanded && "rotate-180",
          )}
        />
      </div>
      {!p.expanded && p.preview && (
        <span className="truncate pl-8.5 text-xs text-muted-foreground">{p.preview}</span>
      )}
    </button>
  );
};

export const AiReasoning = (props: AiReasoningProps) => {
  const status = props.status ?? "completed";
  const variant = props.variant ?? "card";
  const steps = props.steps ?? REASONING_DEFAULT_STEPS;
  const reduced = useReducedMotion();
  const [internalExpanded, setInternalExpanded] = useState(props.defaultExpanded ?? true);
  const expanded = props.expanded ?? internalExpanded;

  const toggle = () => {
    const next = !expanded;
    if (props.expanded === undefined) setInternalExpanded(next);
    props.onExpandedChange?.(next);
  };

  return (
    <div
      data-slot="ai-reasoning"
      data-status={status}
      data-variant={variant}
      className={cn(
        "w-full max-w-xl overflow-hidden",
        REASONING_SHELL_CLASS[variant],
        props.className,
      )}
    >
      <ReasoningHeader
        status={status}
        variant={variant}
        title={props.title}
        durationLabel={props.durationLabel ?? "2.6s"}
        tokensLabel={props.tokensLabel}
        stepCount={steps.length}
        expanded={expanded}
        preview={steps[steps.length - 1]?.title}
        onToggle={toggle}
      />
      {expanded && (
        <StepTimeline steps={steps} status={status} variant={variant} reduced={reduced} />
      )}
    </div>
  );
};
