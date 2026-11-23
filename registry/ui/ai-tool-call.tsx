// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiToolCall：MCP / 智能体工具调用与流水线步骤检查器卡片，支持入参/返回暗色 JSON 载荷展开复制与失败重试。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Loader2,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const toolCallShellVariants = cva(
  "w-full max-w-xl overflow-hidden border border-solid transition-colors",
  {
    variants: {
      variant: {
        card: "rounded-2xl border-border/85 bg-card text-card-foreground shadow-xs",
        compact: "rounded-xl border-border/80 bg-card text-card-foreground shadow-2xs",
        obsidian:
          "[color-scheme:dark] rounded-2xl border-zinc-800 bg-zinc-950 text-zinc-50 shadow-md",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  },
);

export const TOOL_STATUS_META: Record<
  AiToolCallStatus,
  { label: string; pillClass: string; dotClass: string }
> = {
  running: {
    label: "执行中",
    pillClass: "border-signal/30 bg-signal/10 text-signal",
    dotClass: "bg-signal animate-pulse",
  },
  completed: {
    label: "已完成",
    pillClass: "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  error: {
    label: "失败",
    pillClass: "border-destructive/35 bg-destructive/12 text-destructive",
    dotClass: "bg-destructive",
  },
  pending: {
    label: "排队中",
    pillClass: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
};

export const TOOL_STATUS_META_DARK: Record<
  AiToolCallStatus,
  { label: string; pillClass: string; dotClass: string }
> = {
  running: {
    label: "执行中",
    pillClass: "border-sky-500/35 bg-sky-500/15 text-sky-300",
    dotClass: "bg-sky-400 animate-pulse",
  },
  completed: {
    label: "已完成",
    pillClass: "border-emerald-500/35 bg-emerald-500/15 text-emerald-300",
    dotClass: "bg-emerald-400",
  },
  error: {
    label: "失败",
    pillClass: "border-rose-500/35 bg-rose-500/15 text-rose-300",
    dotClass: "bg-rose-400",
  },
  pending: {
    label: "排队中",
    pillClass: "border-amber-500/35 bg-amber-500/15 text-amber-300",
    dotClass: "bg-amber-400",
  },
};
export type AiToolCallStatus = "running" | "completed" | "error" | "pending";
export type AiToolCallVariant = "card" | "compact" | "obsidian";

export interface AiToolCallProps {
  /** 工具名称（如 search_registry / run_e2e） */
  toolName: string;
  /** 执行状态 */
  status?: AiToolCallStatus;
  /** 容器视觉变体：标准卡片（card）、紧凑行内（compact）或曜石暗色（obsidian） */
  variant?: AiToolCallVariant;
  /** 工具提供方或 MCP 服务标识 */
  provider?: string;
  /** 执行耗时 */
  durationLabel?: string;
  /** 可选载荷大小或 Token 读数 */
  tokensLabel?: string;
  /** 简短结果摘要 */
  summary?: string;
  /** 请求入参 JSON 文本 */
  inputJson?: string;
  /** 返回结果 JSON 文本 */
  outputJson?: string;
  /** 受控展开状态 */
  expanded?: boolean;
  /** 初始是否展开载荷明细 */
  defaultExpanded?: boolean;
  /** 展开状态变化回调 */
  onExpandedChange?: (expanded: boolean) => void;
  /** 失败态重试回调 */
  onRetry?: () => void;
  /** 自定义类名 */
  className?: string;
}
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
    <div className="[color-scheme:dark] flex flex-col overflow-hidden rounded-xl border border-solid border-zinc-800 bg-zinc-950 text-zinc-100">
      <div className="flex items-center justify-between gap-2 border-b border-solid border-zinc-800/90 bg-zinc-900/75 px-3 py-1.5">
        <span className="font-mono text-[10px] font-semibold tracking-wider text-zinc-300 uppercase">
          {label}
        </span>
        <button
          type="button"
          aria-label={copied ? `已复制 ${label}` : `复制 ${label}`}
          onClick={copy}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-1.5 py-0.5 font-sans text-[10px] font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <pre className="m-0 p-3 font-mono text-[11px] leading-relaxed break-all whitespace-pre-wrap text-zinc-200">
        <code>{json}</code>
      </pre>
    </div>
  );
};

interface PayloadDrawerProps {
  inputJson: string;
  outputJson: string;
  status: AiToolCallStatus;
  obsidian: boolean;
  onRetry?: () => void;
}

const PayloadDrawer = ({
  inputJson,
  outputJson,
  status,
  obsidian,
  onRetry,
}: PayloadDrawerProps) => (
  <div
    className={cn(
      "flex flex-col gap-3 border-t border-solid p-4",
      obsidian ? "border-zinc-800 bg-zinc-900/50" : "border-border/75 bg-secondary/35",
    )}
  >
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <PayloadBox label="Parameters" json={inputJson} />
      <PayloadBox label="Result" json={outputJson} />
    </div>
    {status === "error" && onRetry && (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "inline-flex h-7.5 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-3 font-sans text-xs font-medium shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
            obsidian
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              : "border-border bg-card text-foreground hover:bg-accent",
          )}
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          <span>重试工具调用</span>
        </button>
      </div>
    )}
  </div>
);
const StatusIcon = ({ status, obsidian }: { status: AiToolCallStatus; obsidian: boolean }) => {
  if (status === "running") {
    return (
      <Loader2
        aria-hidden="true"
        className={cn(
          "size-4 shrink-0 animate-spin motion-reduce:animate-none",
          obsidian ? "text-sky-400" : "text-signal",
        )}
      />
    );
  }
  if (status === "error") {
    return (
      <AlertCircle
        aria-hidden="true"
        className={cn("size-4 shrink-0", obsidian ? "text-rose-400" : "text-destructive")}
      />
    );
  }
  if (status === "pending") {
    return (
      <Clock
        aria-hidden="true"
        className={cn(
          "size-4 shrink-0",
          obsidian ? "text-amber-400" : "text-amber-600 dark:text-amber-400",
        )}
      />
    );
  }
  return (
    <CheckCircle2
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0",
        obsidian ? "text-emerald-400" : "text-emerald-600 dark:text-emerald-400",
      )}
    />
  );
};

interface MetaProps {
  status: AiToolCallStatus;
  durationLabel: string;
  tokensLabel?: string;
  obsidian: boolean;
  expanded: boolean;
}

const ToolHeaderMeta = ({ status, durationLabel, tokensLabel, obsidian, expanded }: MetaProps) => {
  const meta = obsidian ? TOOL_STATUS_META_DARK[status] : TOOL_STATUS_META[status];
  const muted = obsidian ? "text-zinc-400" : "text-muted-foreground";
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-solid px-2 py-0.5 text-[11px] font-medium",
          meta.pillClass,
        )}
      >
        <span aria-hidden="true" className={cn("size-1.5 rounded-full", meta.dotClass)} />
        {meta.label}
      </span>
      <span className={cn("font-mono text-[11px] tabular-nums", muted)}>{durationLabel}</span>
      {tokensLabel && (
        <span className={cn("hidden font-mono text-[11px] tabular-nums sm:inline", muted)}>
          {tokensLabel}
        </span>
      )}
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "size-3.5 transition-transform duration-(--ui-duration-fast)",
          muted,
          expanded && "rotate-180",
        )}
      />
    </div>
  );
};

const ToolIdentity = ({
  toolName,
  provider,
  status,
  obsidian,
}: {
  toolName: string;
  provider?: string;
  status: AiToolCallStatus;
  obsidian: boolean;
}) => (
  <div className="flex min-w-0 items-center gap-2">
    <StatusIcon status={status} obsidian={obsidian} />
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs font-semibold",
        obsidian ? "text-zinc-100" : "text-foreground",
      )}
    >
      <Terminal
        aria-hidden="true"
        className={cn("size-3.5", obsidian ? "text-zinc-400" : "text-muted-foreground")}
      />
      {toolName}
    </span>
    {provider && (
      <span
        className={cn(
          "rounded-md border border-solid px-1.5 py-0.5 font-mono text-[10px] font-medium",
          obsidian
            ? "border-zinc-800 bg-zinc-900 text-zinc-300"
            : "border-border/70 bg-secondary/80 text-muted-foreground",
        )}
      >
        {provider}
      </span>
    )}
  </div>
);

interface HeaderBtnProps {
  toolName: string;
  provider?: string;
  status: AiToolCallStatus;
  variant: AiToolCallVariant;
  summary: string;
  durationLabel: string;
  tokensLabel?: string;
  expanded: boolean;
  onToggle: () => void;
}

const ToolHeaderButton = (p: HeaderBtnProps) => {
  const obsidian = p.variant === "obsidian";
  const compact = p.variant === "compact";
  return (
    <button
      type="button"
      aria-expanded={p.expanded}
      onClick={p.onToggle}
      className={cn(
        "flex w-full cursor-pointer flex-col border-0 bg-transparent text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        compact ? "gap-1 px-3.5 py-2.5" : "gap-1.5 px-4 py-3.5",
        obsidian ? "hover:bg-zinc-900/70" : "hover:bg-accent/40",
      )}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <ToolIdentity
          toolName={p.toolName}
          provider={p.provider}
          status={p.status}
          obsidian={obsidian}
        />
        <ToolHeaderMeta
          status={p.status}
          durationLabel={p.durationLabel}
          tokensLabel={p.tokensLabel}
          obsidian={obsidian}
          expanded={p.expanded}
        />
      </div>
      {!compact && (
        <span className={cn("pl-6 text-xs", obsidian ? "text-zinc-400" : "text-muted-foreground")}>
          {p.summary}
        </span>
      )}
    </button>
  );
};

const resolveToolDefaults = (props: AiToolCallProps) => ({
  provider: props.provider ?? "MCP",
  status: props.status ?? "completed",
  variant: props.variant ?? "card",
  durationLabel: props.durationLabel ?? "142ms",
  summary: props.summary ?? "已读取组件元数据并完成 Schema 校验",
  inputJson: props.inputJson ?? '{"component":"sheet","inset":true}',
  outputJson: props.outputJson ?? '{"status":"ok","tokens":384}',
});

export const AiToolCall = (props: AiToolCallProps) => {
  const cfg = resolveToolDefaults(props);
  const [internalExpanded, setInternalExpanded] = useState(props.defaultExpanded ?? false);
  const expanded = props.expanded ?? internalExpanded;

  const toggle = () => {
    const next = !expanded;
    if (props.expanded === undefined) setInternalExpanded(next);
    props.onExpandedChange?.(next);
  };

  return (
    <div
      data-slot="ai-tool-call"
      data-status={cfg.status}
      data-variant={cfg.variant}
      className={cn(toolCallShellVariants({ variant: cfg.variant }), props.className)}
    >
      <ToolHeaderButton
        toolName={props.toolName}
        provider={cfg.provider}
        status={cfg.status}
        variant={cfg.variant}
        summary={cfg.summary}
        durationLabel={cfg.durationLabel}
        tokensLabel={props.tokensLabel}
        expanded={expanded}
        onToggle={toggle}
      />
      {expanded && (
        <PayloadDrawer
          inputJson={cfg.inputJson}
          outputJson={cfg.outputJson}
          status={cfg.status}
          obsidian={cfg.variant === "obsidian"}
          onRetry={props.onRetry}
        />
      )}
    </div>
  );
};
