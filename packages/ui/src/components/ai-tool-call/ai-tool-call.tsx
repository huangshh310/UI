"use client";

/**
 * AiToolCall：MCP / 智能体工具调用与流水线步骤检查器卡片，支持入参/返回 JSON 展开复制与失败重试。
 */
import { cn } from "@matt-ui/utils";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Loader2,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../badge/index.js";
import type { AiToolCallProps, AiToolCallStatus } from "./ai-tool-call.types.js";

const STATUS_META: Record<
  AiToolCallStatus,
  { label: string; variant: "secondary" | "success" | "destructive" }
> = {
  running: { label: "执行中", variant: "secondary" },
  completed: { label: "已完成", variant: "success" },
  error: { label: "失败", variant: "destructive" },
};

const StatusIcon = ({ status }: { status: AiToolCallStatus }) => {
  if (status === "running") {
    return (
      <Loader2
        aria-hidden="true"
        className="size-4 shrink-0 animate-spin text-signal motion-reduce:animate-none"
      />
    );
  }
  if (status === "error") {
    return <AlertCircle aria-hidden="true" className="size-4 shrink-0 text-destructive" />;
  }
  return (
    <CheckCircle2
      aria-hidden="true"
      className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
    />
  );
};

const PayloadBox = ({ label, json }: { label: string; json: string }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  const copy = () => {
    setCopied(true);
    navigator.clipboard?.writeText(json).catch(() => {});
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, 1200);
  };
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
        <button
          type="button"
          aria-label={copied ? `已复制 ${label}` : `复制 ${label}`}
          onClick={copy}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-3 text-signal" /> : <Copy className="size-3" />}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <pre className="m-0 rounded-xl border border-solid border-border/80 bg-card p-3 font-mono text-[11px] leading-relaxed break-all whitespace-pre-wrap text-foreground shadow-xs">
        <code>{json}</code>
      </pre>
    </div>
  );
};

const PayloadDrawer = ({
  inputJson,
  outputJson,
  status,
  onRetry,
}: {
  inputJson?: string;
  outputJson?: string;
  status: AiToolCallStatus;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col gap-3 border-t border-solid border-border/75 bg-secondary/35 p-4">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <PayloadBox label="Parameters" json={inputJson ?? "{}"} />
      <PayloadBox label="Result" json={outputJson ?? '{"ok":true}'} />
    </div>
    {status === "error" && onRetry && (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          <span>重试工具调用</span>
        </button>
      </div>
    )}
  </div>
);

const ToolHeaderMeta = ({
  status,
  durationLabel,
  expanded,
}: {
  status: AiToolCallStatus;
  durationLabel: string;
  expanded: boolean;
}) => (
  <div className="flex shrink-0 items-center gap-2">
    <Badge variant={STATUS_META[status].variant} shape="tag">
      {STATUS_META[status].label}
    </Badge>
    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
      {durationLabel}
    </span>
    <ChevronDown
      aria-hidden="true"
      className={cn(
        "size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast)",
        expanded && "rotate-180",
      )}
    />
  </div>
);

const ToolHeaderButton = ({
  toolName,
  provider,
  status,
  summary,
  durationLabel,
  expanded,
  onToggle,
}: {
  toolName: string;
  provider?: string;
  status: AiToolCallStatus;
  summary: string;
  durationLabel: string;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    aria-expanded={expanded}
    onClick={onToggle}
    className="flex w-full cursor-pointer flex-col gap-2 border-0 bg-transparent px-4 py-3.5 text-left transition-colors hover:bg-accent/40 outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div className="flex w-full flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <StatusIcon status={status} />
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
          <Terminal aria-hidden="true" className="size-3.5 text-muted-foreground" />
          {toolName}
        </span>
        {provider && (
          <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            {provider}
          </span>
        )}
      </div>
      <ToolHeaderMeta status={status} durationLabel={durationLabel} expanded={expanded} />
    </div>
    <span className="pl-6 text-xs text-muted-foreground">{summary}</span>
  </button>
);

export const AiToolCall = ({
  toolName,
  provider = "MCP",
  status = "completed",
  durationLabel = "142ms",
  summary = "已读取组件元数据并完成 Schema 校验",
  inputJson = '{"component":"sheet","inset":true}',
  outputJson = '{"status":"ok","tokens":384}',
  defaultExpanded = false,
  onRetry,
  className,
}: AiToolCallProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      data-slot="ai-tool-call"
      data-status={status}
      className={cn(
        "w-full max-w-xl overflow-hidden rounded-[22px] border border-solid border-border/90 bg-card text-card-foreground shadow-xs",
        className,
      )}
    >
      <ToolHeaderButton
        toolName={toolName}
        provider={provider}
        status={status}
        summary={summary}
        durationLabel={durationLabel}
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
      />
      {expanded && (
        <PayloadDrawer
          inputJson={inputJson}
          outputJson={outputJson}
          status={status}
          onRetry={onRetry}
        />
      )}
    </div>
  );
};
