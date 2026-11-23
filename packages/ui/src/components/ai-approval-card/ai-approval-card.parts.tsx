"use client";

/**
 * AiApprovalCard 内部子部件：微型终端命令面板、授权策略单选行与已审计结果卡。
 */
import { cn } from "@matt-ui/utils";
import { Check, Copy, RotateCcw, ShieldAlert, ShieldCheck, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../button/index.js";
import type { AiApprovalOption } from "./ai-approval-card.types.js";

const APPROVAL_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const CMD_OPERATORS = new Set(["&&", "||", "|", ";", ">", ">>"]);

const classifyCmdToken = (token: string, expectCmd: boolean): string => {
  if (CMD_OPERATORS.has(token)) return "font-semibold text-emerald-400";
  if (expectCmd) return "font-medium text-sky-300";
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

export const ApprovalCommandTerminal = ({
  command,
  workingDir,
}: {
  command: string;
  workingDir?: string;
}) => {
  const { copied, copy } = useCopyCommand(command);
  return (
    <div className="overflow-hidden rounded-lg border border-solid border-zinc-800/90 bg-zinc-950 text-zinc-100 shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b border-solid border-zinc-800/80 bg-zinc-900/85 px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-zinc-300">
          <span aria-hidden="true" className="flex shrink-0 items-center gap-1">
            <span className="size-2 rounded-full bg-zinc-700" />
            <span className="size-2 rounded-full bg-zinc-700" />
            <span className="size-2 rounded-full bg-zinc-700" />
          </span>
          <Terminal aria-hidden="true" className="size-3 shrink-0 text-emerald-400" />
          <span className="truncate">{workingDir ?? "shell"}</span>
        </div>
        <TerminalCopyButton copied={copied} onCopy={copy} />
      </div>
      <div className="overflow-x-auto px-3.5 py-2.5">
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

export const ApprovalOptionList = ({
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
            "flex w-full cursor-pointer items-start gap-2.5 rounded-lg border border-solid px-3 py-2.5 text-left transition-colors",
            APPROVAL_FOCUS_RING,
            active
              ? "border-foreground/30 bg-muted/40 text-foreground shadow-2xs dark:border-white/25 dark:bg-white/[0.06]"
              : "border-border/75 bg-transparent text-foreground hover:border-foreground/20 hover:bg-muted/25 dark:border-white/10 dark:hover:bg-white/[0.03]",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-solid transition-colors",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-muted-foreground/45 bg-transparent",
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

export const ApprovalDecisionCard = (p: ApprovalDecisionCardProps) => {
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
