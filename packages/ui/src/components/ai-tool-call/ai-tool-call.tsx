"use client";

/**
 * AiToolCall：MCP / 智能体工具调用与流水线步骤检查器卡片，支持入参/返回暗色 JSON 载荷展开复制与失败重试。
 */
import { cn } from "@matt-ui/utils";
import { AlertCircle, CheckCircle2, ChevronDown, Clock, Loader2, Terminal } from "lucide-react";
import { useState } from "react";
import { PayloadDrawer } from "./ai-tool-call.parts.js";
import type { AiToolCallProps, AiToolCallStatus, AiToolCallVariant } from "./ai-tool-call.types.js";
import {
  TOOL_STATUS_META,
  TOOL_STATUS_META_DARK,
  toolCallShellVariants,
} from "./ai-tool-call.variants.js";

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
