// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiToolCall：紧凑工具调用轨迹卡片，支持执行状态流转、入参与返回 JSON 载荷抽屉及失败重试。
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
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const toolCallShellVariants = cva(
  "w-full overflow-hidden rounded-2xl border border-solid transition-colors",
  {
    variants: {
      variant: {
        card: "border-border bg-card text-card-foreground shadow-xs",
        compact: "border-border bg-card text-card-foreground",
        obsidian: "[color-scheme:dark] border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  },
);

export const TOOL_STATUS_LABEL: Record<AiToolCallStatus, string> = {
  running: "执行中",
  completed: "已完成",
  error: "失败",
  pending: "排队中",
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
const DRAWER_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const useCopyText = (text: string) => {
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
    navigator.clipboard?.writeText(text).catch(() => {});
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, 1200);
  };

  return { copied, copy };
};

interface PayloadSectionProps {
  label: string;
  json: string;
  obsidian: boolean;
}

const PayloadSection = ({ label, json, obsidian }: PayloadSectionProps) => {
  const { copied, copy } = useCopyText(json);
  const btnCls = obsidian
    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    : "text-muted-foreground hover:bg-accent hover:text-foreground";
  const preCls = obsidian
    ? "bg-zinc-900/80 text-zinc-200"
    : "bg-muted/50 text-foreground dark:bg-white/[0.04]";
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "font-mono text-[11px] font-medium tracking-wide",
            obsidian ? "text-zinc-400" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
        <button
          type="button"
          aria-label={copied ? `已复制 ${label}` : `复制 ${label}`}
          onClick={copy}
          className={cn(
            "inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent bg-transparent px-1.5 font-sans text-[11px] font-medium transition-colors",
            DRAWER_FOCUS_RING,
            btnCls,
          )}
        >
          {copied ? (
            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="size-3" />
          )}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <pre
        className={cn(
          "m-0 overflow-x-auto rounded-lg px-3 py-2.5 font-mono text-[11.5px] leading-relaxed",
          preCls,
        )}
      >
        <code className="whitespace-pre-wrap break-words">{json}</code>
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
      "flex flex-col gap-3 border-t border-solid px-4 py-3.5",
      obsidian ? "border-zinc-800" : "border-border/75 dark:border-white/8",
    )}
  >
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <PayloadSection label="Parameters" json={inputJson} obsidian={obsidian} />
      <PayloadSection label="Result" json={outputJson} obsidian={obsidian} />
    </div>
    {status === "error" && onRetry && (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border border-solid px-2.5 font-sans text-xs font-medium transition-colors",
            DRAWER_FOCUS_RING,
            obsidian
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              : "border-border bg-card text-foreground hover:bg-accent dark:border-white/10",
          )}
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          <span>重试工具调用</span>
        </button>
      </div>
    )}
  </div>
);
const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const StatusIcon = ({ status, obsidian }: { status: AiToolCallStatus; obsidian: boolean }) => {
  if (status === "running") {
    return (
      <Loader2
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0 animate-spin motion-reduce:animate-none",
          obsidian ? "text-[#b49eff]" : "text-info",
        )}
      />
    );
  }
  if (status === "error") {
    return (
      <AlertCircle
        aria-hidden="true"
        className={cn("size-3.5 shrink-0", obsidian ? "text-rose-400" : "text-destructive")}
      />
    );
  }
  if (status === "pending") {
    return (
      <Clock
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0",
          obsidian ? "text-amber-400" : "text-amber-600 dark:text-amber-400",
        )}
      />
    );
  }
  return (
    <CheckCircle2
      aria-hidden="true"
      className={cn(
        "size-3.5 shrink-0",
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
  const muted = obsidian ? "text-zinc-400" : "text-muted-foreground";
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="sr-only">{TOOL_STATUS_LABEL[status]}</span>
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
        "truncate font-mono text-xs font-medium",
        obsidian ? "text-zinc-100" : "text-foreground",
      )}
    >
      {toolName}
    </span>
    {provider && (
      <span
        className={cn(
          "shrink-0 font-mono text-[11px] tabular-nums",
          obsidian ? "text-zinc-400" : "text-muted-foreground",
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
        "flex w-full cursor-pointer flex-col border border-solid border-transparent bg-transparent text-left transition-colors",
        FOCUS_RING,
        compact ? "gap-1 px-3.5 py-2.5" : "gap-1 px-4 py-3",
        obsidian ? "hover:bg-zinc-900/60" : "hover:bg-muted/40 dark:hover:bg-white/[0.03]",
      )}
    >
      <div className="flex w-full items-center justify-between gap-2">
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
        <span
          className={cn(
            "pl-5.5 text-xs leading-relaxed",
            obsidian ? "text-zinc-400" : "text-muted-foreground",
          )}
        >
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
