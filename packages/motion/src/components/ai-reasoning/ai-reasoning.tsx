"use client";

/**
 * AiReasoning：极简深度思考与可折叠思维链推理流组件。
 */
import { cn } from "@matt-ui/utils";
import { ChevronDown, Loader2, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type {
  AiReasoningProps,
  AiReasoningStatus,
  AiReasoningStep,
  AiReasoningVariant,
} from "./ai-reasoning.types.js";
import {
  REASONING_COLLAPSE_TRANSITION,
  REASONING_DEFAULT_STEPS,
  REASONING_FOCUS_RING,
  REASONING_SHELL_CLASS,
} from "./ai-reasoning.variants.js";

const StepRail = ({ isActiveStep, isLast }: { isActiveStep: boolean; isLast: boolean }) => (
  <div className="flex w-4 shrink-0 flex-col items-center">
    <span
      aria-hidden="true"
      className={cn(
        "mt-1.5 size-1.5 shrink-0 rounded-full",
        isActiveStep
          ? "bg-signal"
          : "border border-solid border-muted-foreground/45 bg-card dark:border-white/30",
      )}
    />
    {!isLast && (
      <span aria-hidden="true" className="my-1 w-px flex-1 bg-border/80 dark:bg-white/10" />
    )}
  </div>
);

interface TimelineStepItemProps {
  step: AiReasoningStep;
  idx: number;
  isActiveStep: boolean;
  isLast: boolean;
  reduced: boolean | null;
}

const TimelineStepItem = ({ step, idx, isActiveStep, isLast, reduced }: TimelineStepItemProps) => (
  <motion.li
    initial={reduced ? false : { opacity: 0, y: 2 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: reduced ? 0 : 0.16, delay: reduced ? 0 : idx * 0.035 }}
    className="flex gap-2.5"
  >
    <StepRail isActiveStep={isActiveStep} isLast={isLast} />
    <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", !isLast && "pb-3")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[13px] font-medium text-foreground">{step.title}</span>
          {step.tag && (
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{step.tag}</span>
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
    </div>
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
    key="reasoning-timeline"
    initial={reduced ? false : { opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
    transition={reduced ? { duration: 0 } : REASONING_COLLAPSE_TRANSITION}
    className="overflow-hidden"
  >
    <div className={cn(variant === "inline" ? "pt-1.5 pb-1 pl-2" : "px-4 pt-1 pb-3.5")}>
      <ol className="m-0 flex list-none flex-col p-0">
        {steps.map((step, idx) => (
          <TimelineStepItem
            key={step.id}
            step={step}
            idx={idx}
            isActiveStep={status === "thinking" && idx === steps.length - 1}
            isLast={idx === steps.length - 1}
            reduced={reduced}
          />
        ))}
      </ol>
    </div>
  </motion.div>
);

const ReasoningStatusIcon = ({ status }: { status: AiReasoningStatus }) => (
  <span className="inline-flex size-4 shrink-0 items-center justify-center">
    {status === "thinking" ? (
      <Loader2
        aria-hidden="true"
        className="size-3.5 animate-spin text-signal motion-reduce:animate-none"
      />
    ) : (
      <Sparkles aria-hidden="true" className="size-3.5 text-muted-foreground" />
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
        "flex w-full cursor-pointer flex-col gap-0.5 border border-solid border-transparent bg-transparent text-left transition-colors duration-(--ui-duration-fast)",
        REASONING_FOCUS_RING,
        p.variant === "inline"
          ? "rounded-lg px-2 py-1.5 hover:bg-muted/60 dark:hover:bg-white/[0.05]"
          : "px-4 py-3 hover:bg-muted/40 dark:hover:bg-white/[0.03]",
      )}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <ReasoningStatusIcon status={p.status} />
          <span className="text-[13px] font-medium tracking-tight text-foreground">{heading}</span>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {p.durationLabel} · {p.stepCount} 步
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
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-fast)",
            p.expanded && "rotate-180",
          )}
        />
      </div>
      {!p.expanded && p.preview && (
        <span className="truncate pl-6 text-xs text-muted-foreground">{p.preview}</span>
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
      className={cn("w-full overflow-hidden", REASONING_SHELL_CLASS[variant], props.className)}
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
      <AnimatePresence initial={false}>
        {expanded && (
          <StepTimeline steps={steps} status={status} variant={variant} reduced={reduced} />
        )}
      </AnimatePresence>
    </div>
  );
};
