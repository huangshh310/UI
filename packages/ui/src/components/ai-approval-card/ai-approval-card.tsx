"use client";

/**
 * AiApprovalCard：人机协同（Human-in-the-Loop）敏感动作审批与护栏确认卡片。
 */
import { cn } from "@matt-ui/utils";
import { Check, ShieldAlert, ShieldCheck, Terminal, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../button/index.js";
import {
  ApprovalCommandTerminal,
  ApprovalDecisionCard,
  ApprovalOptionList,
} from "./ai-approval-card.parts.js";
import type {
  AiApprovalCardProps,
  AiApprovalCardVariant,
  AiApprovalRisk,
} from "./ai-approval-card.types.js";
import {
  APPROVAL_DEFAULT_OPTIONS,
  APPROVAL_RISK_META,
  approvalCardVariants,
} from "./ai-approval-card.variants.js";

interface ApprovalHeaderProps {
  title: string;
  description: string;
  agentName?: string;
  riskLevel: AiApprovalRisk;
  compact: boolean;
}

const ApprovalRiskBadge = ({ riskLevel }: { riskLevel: AiApprovalRisk }) => {
  const risk = APPROVAL_RISK_META[riskLevel];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-none",
        risk.badgeClass,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", risk.dotClass)} />
      <span>{risk.label}</span>
    </span>
  );
};

const ApprovalHeader = (p: ApprovalHeaderProps) => {
  const risk = APPROVAL_RISK_META[p.riskLevel];
  const RiskIcon =
    p.riskLevel === "high" ? ShieldAlert : p.riskLevel === "low" ? ShieldCheck : Terminal;
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3",
        p.compact ? "px-3.5 pt-3 pb-1" : "px-4 pt-4 pb-1",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg",
            risk.iconWrapClass,
          )}
        >
          <RiskIcon className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="m-0 text-[13px] font-semibold tracking-tight text-foreground">
              {p.title}
            </p>
            <ApprovalRiskBadge riskLevel={p.riskLevel} />
          </div>
          <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
        </div>
      </div>
      {p.agentName && (
        <span className="inline-flex shrink-0 rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
          {p.agentName}
        </span>
      )}
    </div>
  );
};

const ApprovalFooter = ({
  impact,
  riskLevel,
  compact,
  onReject,
  onApprove,
}: {
  impact?: string;
  riskLevel: AiApprovalRisk;
  compact: boolean;
  onReject: () => void;
  onApprove: () => void;
}) => (
  <div
    className={cn(
      "flex flex-wrap items-center gap-2.5",
      impact ? "justify-between" : "justify-end",
      compact ? "px-3.5 pt-1 pb-3" : "px-4 pt-1 pb-4",
    )}
  >
    {impact && (
      <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-foreground/70" />
        <span className="truncate font-mono text-[11px] tabular-nums">{impact}</span>
      </div>
    )}
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary" className="h-8 rounded-lg" onClick={onReject}>
        <X aria-hidden="true" className="size-3.5" />
        <span>拒绝</span>
      </Button>
      <Button
        size="sm"
        variant={riskLevel === "high" ? "destructive" : "primary"}
        className="h-8 rounded-lg"
        onClick={onApprove}
      >
        <Check aria-hidden="true" className="size-3.5" />
        <span>批准执行</span>
      </Button>
    </div>
  </div>
);

const resolveApprovalDefaults = (props: AiApprovalCardProps) => ({
  description: props.description ?? "Agent 请求执行受保护指令，请确认授权范围。",
  command: props.command ?? "pnpm registry:generate && pnpm test:registry",
  riskLevel: props.riskLevel ?? ("medium" as AiApprovalRisk),
  variant: props.variant ?? ("card" as AiApprovalCardVariant),
  impact: props.impact,
  options: props.options ?? APPROVAL_DEFAULT_OPTIONS,
});

const useApprovalDecision = (props: AiApprovalCardProps, initialId: string) => {
  const [selectedId, setSelectedId] = useState(initialId);
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">("pending");
  const reject = () => {
    setDecision("rejected");
    props.onReject?.();
  };
  const approve = () => {
    setDecision("approved");
    props.onApprove?.(selectedId);
  };
  return {
    selectedId,
    setSelectedId,
    decision,
    reset: () => setDecision("pending"),
    reject,
    approve,
  };
};

export const AiApprovalCard = (props: AiApprovalCardProps) => {
  const cfg = resolveApprovalDefaults(props);
  const compact = cfg.variant === "compact";
  const state = useApprovalDecision(props, cfg.options[0]?.id ?? "once");
  const selectedLabel = cfg.options.find((o) => o.id === state.selectedId)?.label ?? "";

  if (state.decision !== "pending") {
    return (
      <ApprovalDecisionCard
        decision={state.decision}
        optionLabel={selectedLabel}
        className={props.className}
        onReset={state.reset}
      />
    );
  }

  return (
    <div
      data-slot="ai-approval-card"
      data-risk={cfg.riskLevel}
      data-variant={cfg.variant}
      className={cn(approvalCardVariants({ variant: cfg.variant }), props.className)}
    >
      <ApprovalHeader
        title={props.title}
        description={cfg.description}
        agentName={props.agentName}
        riskLevel={cfg.riskLevel}
        compact={compact}
      />
      <div className={cn("flex flex-col", compact ? "gap-2.5 p-3.5" : "gap-3.5 p-4")}>
        <ApprovalCommandTerminal command={cfg.command} workingDir={props.workingDir} />
        <ApprovalOptionList
          options={cfg.options}
          selectedId={state.selectedId}
          onSelect={state.setSelectedId}
        />
      </div>
      <ApprovalFooter
        impact={cfg.impact}
        riskLevel={cfg.riskLevel}
        compact={compact}
        onReject={state.reject}
        onApprove={state.approve}
      />
    </div>
  );
};
