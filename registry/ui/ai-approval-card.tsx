// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiApprovalCard：人机协同（Human-in-the-Loop）敏感动作审批与护栏确认卡片。
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Check, Copy, RotateCcw, ShieldAlert, ShieldCheck, Terminal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const approvalCardVariants = cva(
  "flex w-full flex-col overflow-hidden rounded-2xl border border-solid border-border bg-card text-card-foreground shadow-xs",
  {
    variants: {
      variant: {
        card: "",
        compact: "",
      },
    },
    defaultVariants: {
      variant: "card",
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
  { label: string; dotClass: string; badgeClass: string; iconWrapClass: string }
> = {
  low: {
    label: "低风险",
    dotClass: "bg-emerald-600 dark:bg-emerald-400",
    badgeClass: "bg-emerald-500/12 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
    iconWrapClass:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  medium: {
    label: "需确认",
    dotClass: "bg-amber-600 dark:bg-amber-400",
    badgeClass: "bg-amber-500/12 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200",
    iconWrapClass: "bg-amber-500/10 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  high: {
    label: "高危操作",
    dotClass: "bg-rose-600 dark:bg-rose-400",
    badgeClass: "bg-rose-500/12 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200",
    iconWrapClass: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
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
const APPROVAL_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const CMD_OPERATORS = new Set(["&&", "||", "|", ";", ">", ">>"]);

const classifyCmdToken = (token: string, expectCmd: boolean): string => {
  if (CMD_OPERATORS.has(token)) return "font-semibold text-emerald-400";
  if (expectCmd) return "font-medium text-[#b49eff]";
  if (token.startsWith("-")) return "text-amber-300";
  if (/^["'].*["']$/.test(token)) return "text-emerald-300";
  return "text-zinc-100";
};

const renderCommandTokens = (command: string) => {
  const parts = command.split(/(\s+)/);
  let expectCmd = true;
  return parts.map((part, idx) => {
    if (!part || /^\s+$/.test(part)) return <span key={idx}>{part}</span>;
    const cls = classifyCmdToken(part, expectCmd);
    expectCmd = CMD_OPERATORS.has(part);
    return (
      <span key={idx} className={cls}>
        {part}
      </span>
    );
  });
};

const useCopyCommand = (command: string) => {
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
  return { copied, copy };
};

const TerminalCopyButton = ({ copied, onCopy }: { copied: boolean; onCopy: () => void }) => (
  <button
    type="button"
    aria-label={copied ? "已复制命令" : "复制命令"}
    onClick={onCopy}
    className={cn(
      "inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent bg-transparent px-1.5 font-sans text-[11px] font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50",
      APPROVAL_FOCUS_RING,
    )}
  >
    {copied ? (
      <Check aria-hidden="true" className="size-3 text-emerald-400" />
    ) : (
      <Copy aria-hidden="true" className="size-3" />
    )}
    <span>{copied ? "已复制" : "复制"}</span>
  </button>
);

const ApprovalCommandTerminal = ({
  command,
  workingDir,
}: {
  command: string;
  workingDir?: string;
}) => {
  const { copied, copy } = useCopyCommand(command);
  return (
    <div className="overflow-hidden rounded-xl bg-zinc-950 text-zinc-100">
      <div className="flex items-center justify-between gap-2 px-3.5 pt-2.5 pb-1">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-zinc-400">
          <Terminal aria-hidden="true" className="size-3 shrink-0 text-emerald-400" />
          <span className="truncate">{workingDir ?? "shell"}</span>
        </div>
        <TerminalCopyButton copied={copied} onCopy={copy} />
      </div>
      <div
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="overflow-x-auto px-3.5 pt-1 pb-3 outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="flex min-w-max items-center gap-2 font-mono text-xs leading-relaxed">
          <span aria-hidden="true" className="select-none font-semibold text-emerald-400">
            $
          </span>
          <code className="whitespace-pre text-zinc-100">
            <span className="sr-only select-none">{command}</span>
            <span aria-hidden="true">{renderCommandTokens(command)}</span>
          </code>
        </div>
      </div>
    </div>
  );
};

const ApprovalOptionList = ({
  options,
  selectedId,
  onSelect,
}: {
  options: AiApprovalOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => (
  <div className="flex flex-col gap-2">
    {options.map((opt) => {
      const active = opt.id === selectedId;
      return (
        <button
          key={opt.id}
          type="button"
          aria-pressed={active}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "flex w-full cursor-pointer items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-colors",
            APPROVAL_FOCUS_RING,
            active ? "bg-accent text-foreground" : "bg-muted/45 text-foreground hover:bg-muted/80",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-solid transition-colors",
              active ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card",
            )}
          >
            {active && <span className="size-1.5 rounded-full bg-current" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="m-0 text-xs font-medium leading-snug text-foreground">{opt.label}</p>
            {opt.description && (
              <p className="m-0 mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                {opt.description}
              </p>
            )}
          </div>
        </button>
      );
    })}
  </div>
);

const DecisionBadge = ({ approved }: { approved: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-md border border-solid px-2 py-0.5 text-[11px] font-medium",
      approved
        ? "border-emerald-600/20 bg-emerald-500/12 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-200"
        : "border-border/75 bg-muted/60 text-foreground",
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "size-1.5 rounded-full",
        approved ? "bg-emerald-600 dark:bg-emerald-400" : "bg-muted-foreground",
      )}
    />
    {approved ? "已批准执行" : "已拒绝执行"}
  </span>
);

interface ApprovalDecisionCardProps {
  decision: "approved" | "rejected";
  optionLabel: string;
  className?: string;
  onReset: () => void;
}

const ApprovalDecisionCard = (p: ApprovalDecisionCardProps) => {
  const approved = p.decision === "approved";
  return (
    <div
      data-slot="ai-approval-card"
      data-decision={p.decision}
      className={cn(
        "flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border border-solid border-border bg-card px-4 py-3 text-xs shadow-xs dark:border-white/10",
        p.className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-solid",
            approved
              ? "border-emerald-600/20 bg-emerald-500/12 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-300"
              : "border-border bg-muted/60 text-muted-foreground",
          )}
        >
          {approved ? <ShieldCheck className="size-3.5" /> : <ShieldAlert className="size-3.5" />}
        </span>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <DecisionBadge approved={approved} />
          <span className="truncate text-muted-foreground">{p.optionLabel}</span>
        </div>
      </div>
      <Button size="sm" variant="ghost" className="h-8 shrink-0 rounded-lg" onClick={p.onReset}>
        <RotateCcw aria-hidden="true" className="size-3.5" />
        <span>重审</span>
      </Button>
    </div>
  );
};
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
