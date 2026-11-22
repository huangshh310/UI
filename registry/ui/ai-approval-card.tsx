// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiApprovalCard：C 端人机协同（Human-in-the-Loop）敏感动作审批与护栏确认卡片。
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, RotateCcw, ShieldAlert, Terminal, X } from "lucide-react";
import { useState } from "react";

export type AiApprovalRisk = "low" | "medium" | "high";

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
  /** 待执行的终端命令或目标摘要 */
  command?: string;
  /** 风险等级 */
  riskLevel?: AiApprovalRisk;
  /** 授权策略可选项 */
  options?: AiApprovalOption[];
  /** 批准回调 */
  onApprove?: (selectedOptionId: string) => void;
  /** 拒绝回调 */
  onReject?: () => void;
  /** 自定义类名 */
  className?: string;
}
const DEFAULT_OPTIONS: AiApprovalOption[] = [
  { id: "once", label: "单次授权并记录审计日志", description: "仅对本次 Agent 调用生效。" },
  {
    id: "session",
    label: "当前会话内自动放行同类命令",
    description: "会话结束后自动回收权限。",
  },
];

const RISK_META: Record<
  AiApprovalRisk,
  { label: string; variant: "secondary" | "warning" | "destructive"; accent: string }
> = {
  low: { label: "低风险", variant: "secondary", accent: "from-signal/10 via-transparent" },
  medium: { label: "需确认", variant: "warning", accent: "from-amber-500/12 via-transparent" },
  high: { label: "高危操作", variant: "destructive", accent: "from-rose-500/14 via-transparent" },
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
            "flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border border-solid px-3 py-2 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "border-signal/65 bg-signal/8 shadow-xs"
              : "border-border/80 bg-secondary/25 hover:bg-accent/45",
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
              "inline-flex size-4.5 shrink-0 items-center justify-center rounded-full border border-solid",
              active
                ? "border-signal bg-signal text-signal-foreground shadow-xs"
                : "border-border bg-card",
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
}) => (
  <div className="flex items-center justify-between gap-3 px-4 py-3.5 text-xs">
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={decision === "approved" ? "success" : "secondary"} dot>
        {decision === "approved" ? "已批准执行" : "已拒绝执行"}
      </Badge>
      <span className="text-muted-foreground">{optionLabel}</span>
    </div>
    <Button size="sm" variant="ghost" onClick={onReset}>
      <RotateCcw className="size-3.5" />
      <span>重审</span>
    </Button>
  </div>
);

const ApprovalHeader = ({
  title,
  description,
  risk,
}: {
  title: string;
  description: string;
  risk: { label: string; variant: "secondary" | "warning" | "destructive"; accent: string };
}) => (
  <div
    className={cn(
      "flex items-start justify-between gap-3 rounded-xl bg-gradient-to-r to-transparent p-2.5",
      risk.accent,
    )}
  >
    <div className="flex items-center gap-2.5">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-solid border-signal/25 bg-card text-signal shadow-xs">
        <ShieldAlert aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="m-0 text-xs font-semibold text-foreground">{title}</p>
        <p className="m-0 mt-0.5 text-[11px] text-muted-foreground">{description}</p>
      </div>
    </div>
    <Badge variant={risk.variant} shape="tag">
      {risk.label}
    </Badge>
  </div>
);

const ApprovalFooter = ({
  onReject,
  onApprove,
}: {
  onReject: () => void;
  onApprove: () => void;
}) => (
  <div className="flex items-center justify-between gap-2 border-t border-solid border-border/70 pt-2.5">
    <span className="font-mono text-[10px] text-muted-foreground">护栏保护 · 可回滚</span>
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={onReject}>
        <X className="size-3.5" />
        <span>拒绝</span>
      </Button>
      <Button size="sm" variant="signal" onClick={onApprove}>
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
  options: props.options ?? DEFAULT_OPTIONS,
});

export const AiApprovalCard = (props: AiApprovalCardProps) => {
  const { description, command, riskLevel, options } = resolveApprovalDefaults(props);
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? "once");
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">("pending");
  const selectedLabel = options.find((o) => o.id === selectedId)?.label ?? "";

  if (decision !== "pending") {
    return (
      <div
        data-slot="ai-approval-card"
        className={cn(
          "w-full max-w-md overflow-hidden rounded-[22px] border border-solid border-border/90 bg-card shadow-md",
          props.className,
        )}
      >
        <DecisionBanner
          decision={decision}
          optionLabel={selectedLabel}
          onReset={() => setDecision("pending")}
        />
      </div>
    );
  }

  return (
    <div
      data-slot="ai-approval-card"
      className={cn(
        "flex w-full max-w-md flex-col gap-2.5 rounded-[22px] border border-solid border-border/90 bg-card p-3.5 text-card-foreground shadow-md",
        props.className,
      )}
    >
      <ApprovalHeader title={props.title} description={description} risk={RISK_META[riskLevel]} />
      <div className="flex items-center gap-2 rounded-xl border border-solid border-border/80 bg-secondary/50 px-3 py-2 font-mono text-[11px] text-foreground">
        <Terminal aria-hidden="true" className="size-3.5 shrink-0 text-signal" />
        <span className="truncate">{command}</span>
      </div>
      <OptionList options={options} selectedId={selectedId} onSelect={setSelectedId} />
      <ApprovalFooter
        onReject={() => (setDecision("rejected"), props.onReject?.())}
        onApprove={() => (setDecision("approved"), props.onApprove?.(selectedId))}
      />
    </div>
  );
};
