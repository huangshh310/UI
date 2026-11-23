// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiApprovalCard：C 端人机协同（Human-in-the-Loop）敏感动作审批与护栏确认卡片。
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Check, Copy, RotateCcw, ShieldAlert, ShieldCheck, Terminal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const approvalCardVariants = cva(
  "flex w-full max-w-md flex-col border border-solid bg-card text-card-foreground shadow-xs",
  {
    variants: {
      variant: {
        card: "gap-3.5 rounded-2xl p-5",
        compact: "gap-2.5 rounded-xl p-4",
      },
      riskLevel: {
        low: "border-border/85",
        medium: "border-amber-500/35",
        high: "border-destructive/40",
      },
    },
    defaultVariants: {
      variant: "card",
      riskLevel: "medium",
    },
  },
);

export const APPROVAL_DEFAULT_OPTIONS: AiApprovalOption[] = [
  { id: "once", label: "单次授权并记录审计日志", description: "仅对本次 Agent 调用生效。" },
  {
    id: "session",
    label: "当前会话内自动放行同类命令",
    description: "会话结束后自动回收权限。",
  },
];

export const APPROVAL_RISK_META: Record<
  AiApprovalRisk,
  { label: string; iconClass: string; pillClass: string }
> = {
  low: {
    label: "低风险",
    iconClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    pillClass: "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  },
  medium: {
    label: "需确认",
    iconClass: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300",
    pillClass: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300",
  },
  high: {
    label: "高危操作",
    iconClass: "border-destructive/30 bg-destructive/10 text-destructive",
    pillClass: "border-destructive/35 bg-destructive/12 text-destructive",
  },
};
export type AiApprovalRisk = "low" | "medium" | "high";
export type AiApprovalCardVariant = "card" | "compact";

export interface AiApprovalOption {
  id: string;
  label: string;
  description?: string;
}

export interface AiApprovalCardProps {
  /** 审批主标题 */
  title: string;
  /** 补充背景说明 */
  description?: string;
  /** 发起请求的智能体或工具来源 */
  agentName?: string;
  /** 命令执行工作目录 */
  workingDir?: string;
  /** 影响范围说明（显示在底部左栏） */
  impact?: string;
  /** 待执行的终端命令或目标摘要 */
  command?: string;
  /** 风险等级 */
  riskLevel?: AiApprovalRisk;
  /** 密度与布局变体 */
  variant?: AiApprovalCardVariant;
  /** 授权策略可选项 */
  options?: AiApprovalOption[];
  /** 批准回调 */
  onApprove?: (selectedOptionId: string) => void;
  /** 拒绝回调 */
  onReject?: () => void;
  /** 自定义类名 */
  className?: string;
}
const CommandPreview = ({ command, workingDir }: { command: string; workingDir?: string }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  const copy = () => {
    navigator.clipboard?.writeText(command).catch(() => {});
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, 1200);
  };
  return (
    <div className="[color-scheme:dark] overflow-hidden rounded-xl border border-solid border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="flex items-center justify-between gap-2 border-b border-solid border-zinc-800/90 bg-zinc-900/75 px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] text-zinc-400">
          <Terminal aria-hidden="true" className="size-3 shrink-0 text-zinc-400" />
          <span className="truncate">{workingDir ?? "shell"}</span>
        </div>
        <button
          type="button"
          aria-label={copied ? "已复制命令" : "复制命令"}
          onClick={copy}
          className="inline-flex cursor-pointer items-center gap-1 rounded border-0 bg-transparent px-1.5 py-0.5 font-sans text-[10px] font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5 font-mono text-[11.5px] leading-relaxed">
        <span aria-hidden="true" className="select-none text-emerald-400">
          $
        </span>
        <code className="min-w-0 flex-1 truncate text-zinc-100">{command}</code>
      </div>
    </div>
  );
};

const OptionList = ({
  options,
  selectedId,
  onSelect,
}: {
  options: AiApprovalOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    {options.map((opt) => {
      const active = opt.id === selectedId;
      return (
        <button
          key={opt.id}
          type="button"
          aria-pressed={active}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border border-solid px-3.5 py-2.5 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "border-signal/45 bg-signal/[0.04] shadow-2xs"
              : "border-border/80 bg-transparent hover:border-foreground/20 hover:bg-secondary/40",
          )}
        >
          <div className="min-w-0">
            <p className="m-0 text-xs font-semibold text-foreground">{opt.label}</p>
            {opt.description && (
              <p className="m-0 mt-0.5 text-[11px] text-muted-foreground">{opt.description}</p>
            )}
          </div>
          <span
            className={cn(
              "inline-flex size-4.5 shrink-0 items-center justify-center rounded-full border border-solid transition-colors",
              active ? "border-signal bg-signal text-signal-foreground" : "border-border bg-card",
            )}
          >
            {active && <Check aria-hidden="true" className="size-2.5" />}
          </span>
        </button>
      );
    })}
  </div>
);

const DecisionBanner = ({
  decision,
  optionLabel,
  onReset,
}: {
  decision: "approved" | "rejected";
  optionLabel: string;
  onReset: () => void;
}) => {
  const approved = decision === "approved";
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 text-xs">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-solid px-2.5 py-0.5 text-[11px] font-medium",
            approved
              ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
              : "border-border bg-secondary text-muted-foreground",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full",
              approved ? "bg-emerald-500" : "bg-muted-foreground",
            )}
          />
          {approved ? "已批准执行" : "已拒绝执行"}
        </span>
        <span className="truncate text-muted-foreground">{optionLabel}</span>
      </div>
      <Button size="sm" variant="ghost" onClick={onReset}>
        <RotateCcw className="size-3.5" />
        <span>重审</span>
      </Button>
    </div>
  );
};

const ApprovalHeader = ({
  title,
  description,
  agentName,
  riskLevel,
}: {
  title: string;
  description: string;
  agentName?: string;
  riskLevel: AiApprovalRisk;
}) => {
  const risk = APPROVAL_RISK_META[riskLevel];
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2.5">
        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-solid",
            risk.iconClass,
          )}
        >
          {riskLevel === "low" ? (
            <ShieldCheck aria-hidden="true" className="size-4" />
          ) : (
            <ShieldAlert aria-hidden="true" className="size-4" />
          )}
        </span>
        <div className="min-w-0">
          <p className="m-0 text-[13px] font-semibold tracking-tight text-foreground">{title}</p>
          <p className="m-0 mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
            {description}
          </p>
          {agentName && (
            <span className="mt-1 inline-block font-mono text-[10px] text-muted-foreground">
              来源 · {agentName}
            </span>
          )}
        </div>
      </div>
      <span
        className={cn(
          "inline-flex shrink-0 items-center rounded-full border border-solid px-2 py-0.5 text-[11px] font-medium",
          risk.pillClass,
        )}
      >
        {risk.label}
      </span>
    </div>
  );
};

const ApprovalFooter = ({
  impact,
  onReject,
  onApprove,
}: {
  impact: string;
  onReject: () => void;
  onApprove: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-solid border-border/70 pt-3">
    <span className="font-mono text-[10.5px] text-muted-foreground">{impact}</span>
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" className="rounded-full" onClick={onReject}>
        <X className="size-3.5" />
        <span>拒绝</span>
      </Button>
      <Button size="sm" variant="primary" className="rounded-full" onClick={onApprove}>
        <Check className="size-3.5" />
        <span>批准执行</span>
      </Button>
    </div>
  </div>
);

const resolveApprovalDefaults = (props: AiApprovalCardProps) => ({
  description: props.description ?? "Agent 请求执行受保护指令，请确认授权范围。",
  command: props.command ?? "pnpm registry:generate && pnpm test:registry",
  riskLevel: props.riskLevel ?? "medium",
  variant: props.variant ?? "card",
  impact: props.impact ?? "护栏保护 · 可回滚",
  options: props.options ?? APPROVAL_DEFAULT_OPTIONS,
});

const DecisionCard = ({
  decision,
  optionLabel,
  className,
  onReset,
}: {
  decision: "approved" | "rejected";
  optionLabel: string;
  className?: string;
  onReset: () => void;
}) => (
  <div
    data-slot="ai-approval-card"
    data-decision={decision}
    className={cn(
      "w-full max-w-md overflow-hidden rounded-2xl border border-solid border-border/85 bg-card shadow-xs",
      className,
    )}
  >
    <DecisionBanner decision={decision} optionLabel={optionLabel} onReset={onReset} />
  </div>
);

export const AiApprovalCard = (props: AiApprovalCardProps) => {
  const cfg = resolveApprovalDefaults(props);
  const [selectedId, setSelectedId] = useState(cfg.options[0]?.id ?? "once");
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">("pending");
  const selectedLabel = cfg.options.find((o) => o.id === selectedId)?.label ?? "";

  if (decision !== "pending") {
    return (
      <DecisionCard
        decision={decision}
        optionLabel={selectedLabel}
        className={props.className}
        onReset={() => setDecision("pending")}
      />
    );
  }

  return (
    <div
      data-slot="ai-approval-card"
      data-risk={cfg.riskLevel}
      data-variant={cfg.variant}
      className={cn(
        approvalCardVariants({ variant: cfg.variant, riskLevel: cfg.riskLevel }),
        props.className,
      )}
    >
      <ApprovalHeader
        title={props.title}
        description={cfg.description}
        agentName={props.agentName}
        riskLevel={cfg.riskLevel}
      />
      <CommandPreview command={cfg.command} workingDir={props.workingDir} />
      <OptionList options={cfg.options} selectedId={selectedId} onSelect={setSelectedId} />
      <ApprovalFooter
        impact={cfg.impact}
        onReject={() => {
          setDecision("rejected");
          props.onReject?.();
        }}
        onApprove={() => {
          setDecision("approved");
          props.onApprove?.(selectedId);
        }}
      />
    </div>
  );
};
