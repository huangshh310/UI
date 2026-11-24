"use client";

/**
 * AiToolCall：紧凑工具调用轨迹卡片，支持执行状态流转、入参与返回 JSON 载荷抽屉及失败重试。
 */
import { cn } from "@matt-ui/utils";
import { AlertCircle, CheckCircle2, ChevronDown, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { PayloadDrawer } from "./ai-tool-call.parts.js";
import type { AiToolCallProps, AiToolCallStatus, AiToolCallVariant } from "./ai-tool-call.types.js";
import { TOOL_STATUS_LABEL, toolCallShellVariants } from "./ai-tool-call.variants.js";

const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const StatusIcon = ({ status, obsidian }: { status: AiToolCallStatus; obsidian: boolean }) => {
  if (status === "running") {
    return (
      <Loader2
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0 animate-spin motion-reduce:animate-none",
          obsidian ? "text-sky-400" : "text-signal",
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
