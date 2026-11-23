"use client";

/**
 * AiResponse：流式 AI 回复容器，内置零 innerHTML 的安全 Markdown 渲染、卡片/无框/毛玻璃变体、工具摘要、参考来源与反馈操作栏。
 */
import { cn } from "@matt-ui/utils";
import { createContext, useContext } from "react";
import { ResponseActionBar } from "./ai-response-actions.js";
import { MarkdownStreamView } from "./ai-response-markdown.js";
import {
  ResponseGeneratingSkeleton,
  ResponseSourcesPanel,
  ResponseStatusDot,
  ResponseToolsPanel,
} from "./ai-response-parts.js";
import { safeHref } from "./ai-response-safe.js";
import type {
  AiResponseActionsProps,
  AiResponseContentProps,
  AiResponseHeaderProps,
  AiResponseProps,
  AiResponseSource,
  AiResponseSourcesProps,
  AiResponseStatus,
  AiResponseTool,
  AiResponseToolsSummaryProps,
} from "./ai-response.types.js";
import {
  AI_RESPONSE_FOCUS_RING,
  AI_RESPONSE_SHELL_PADDING,
  AI_RESPONSE_SHELL_VARIANT,
} from "./ai-response.variants.js";

interface AiResponseContextValue {
  content: string;
  status: AiResponseStatus;
  model: string;
  modelBadge?: string;
  timestamp?: string;
  statusLabel?: string;
  tools: AiResponseTool[];
  defaultToolsOpen: boolean;
  sources: AiResponseSource[];
  defaultSourcesOpen: boolean;
  errorMessage?: string;
  onRegenerate?: () => void;
  onFeedback?: (type: "up" | "down") => void;
  onCopy?: (content: string) => void;
}

const ResponseCtx = createContext<AiResponseContextValue | null>(null);

export const useAiResponse = () => {
  const ctx = useContext(ResponseCtx);
  if (!ctx) throw new Error("AiResponse 子部件必须置于 <AiResponse> 内部使用");
  return ctx;
};

const defaultStatusLabel = (status: AiResponseStatus) => {
  if (status === "generating") return "正在构思回复…";
  if (status === "streaming") return "正在生成…";
  if (status === "error") return "生成中断";
  return "";
};

export const AiResponseHeader = ({
  model,
  modelBadge,
  timestamp,
  statusLabel,
  className,
}: AiResponseHeaderProps) => {
  const ctx = useAiResponse();
  const label = statusLabel ?? ctx.statusLabel ?? defaultStatusLabel(ctx.status);
  const badge = modelBadge ?? ctx.modelBadge;
  const time = timestamp ?? ctx.timestamp;

  return (
    <div className={cn("mb-3 flex items-center justify-between gap-2 select-none", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <ResponseStatusDot status={ctx.status} />
        <span className="truncate text-xs font-medium tracking-tight text-foreground">
          {model ?? ctx.model}
        </span>
        {badge && (
          <span className="shrink-0 rounded-md border border-solid border-border/70 bg-secondary/70 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground dark:border-white/10 dark:bg-white/8">
            {badge}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
        {label && <span>{label}</span>}
        {time && <span className="font-mono text-[11px] tabular-nums">{time}</span>}
      </div>
    </div>
  );
};

export const AiResponseContent = ({ className }: AiResponseContentProps) => {
  const { content, status, statusLabel, errorMessage, onRegenerate } = useAiResponse();

  if (status === "error") {
    return (
      <div
        role="alert"
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-solid border-destructive/35 bg-destructive/8 px-3.5 py-2.5 text-xs text-foreground dark:border-destructive dark:bg-destructive/14",
          className,
        )}
      >
        <span className="text-destructive">{errorMessage ?? "回复生成失败，请稍后重试。"}</span>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className={cn(
              "cursor-pointer rounded-full border border-solid border-destructive/40 bg-transparent px-2.5 py-1 font-sans text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 dark:border-destructive",
              AI_RESPONSE_FOCUS_RING,
            )}
          >
            重试
          </button>
        )}
      </div>
    );
  }

  if (status === "generating" && !content.trim()) {
    return <ResponseGeneratingSkeleton label={statusLabel ?? defaultStatusLabel("generating")} />;
  }

  return (
    <div className={className} aria-live="polite">
      <MarkdownStreamView content={content} streaming={status === "streaming"} />
    </div>
  );
};

export const AiResponseToolsSummary = ({ className }: AiResponseToolsSummaryProps) => {
  const { tools, defaultToolsOpen } = useAiResponse();
  return <ResponseToolsPanel tools={tools} defaultOpen={defaultToolsOpen} className={className} />;
};

export const AiResponseSources = ({ className }: AiResponseSourcesProps) => {
  const { sources, defaultSourcesOpen } = useAiResponse();
  return (
    <ResponseSourcesPanel
      sources={sources}
      defaultOpen={defaultSourcesOpen}
      className={className}
    />
  );
};

export const AiResponseActions = ({ className }: AiResponseActionsProps) => {
  const { content, status, onRegenerate, onFeedback, onCopy } = useAiResponse();
  if (status === "generating" || status === "streaming" || !content.trim()) return null;
  return (
    <ResponseActionBar
      content={content}
      onRegenerate={onRegenerate}
      onFeedback={onFeedback}
      onCopy={onCopy}
      className={className}
    />
  );
};

const buildResponseContext = (props: AiResponseProps): AiResponseContextValue => ({
  content: props.content,
  status: props.status ?? "complete",
  model: props.model ?? "Assistant",
  modelBadge: props.modelBadge,
  timestamp: props.timestamp,
  statusLabel: props.statusLabel,
  tools: props.tools ?? [],
  defaultToolsOpen: props.defaultToolsOpen ?? false,
  sources: props.sources ?? [],
  defaultSourcesOpen: props.defaultSourcesOpen ?? false,
  errorMessage: props.errorMessage,
  onRegenerate: props.onRegenerate,
  onFeedback: props.onFeedback,
  onCopy: props.onCopy,
});

export const AiResponse = (props: AiResponseProps) => {
  const variant = props.variant ?? "card";
  const size = props.size ?? "md";
  const ctxValue = buildResponseContext(props);

  return (
    <ResponseCtx.Provider value={ctxValue}>
      <article
        data-slot="ai-response"
        data-status={ctxValue.status}
        data-variant={variant}
        className={cn(
          "w-full max-w-2xl font-sans text-card-foreground",
          AI_RESPONSE_SHELL_VARIANT[variant],
          variant !== "ghost" && AI_RESPONSE_SHELL_PADDING[size],
          props.className,
        )}
      >
        {props.children ?? (
          <>
            <AiResponseHeader />
            <AiResponseContent />
            <AiResponseToolsSummary />
            <AiResponseSources />
            <AiResponseActions />
          </>
        )}
      </article>
    </ResponseCtx.Provider>
  );
};

export { safeHref };
