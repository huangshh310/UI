"use client";

/**
 * AiResponse：流式 AI 回复容器，内置零 innerHTML 的安全 Markdown 渲染、生成状态头、工具调用折叠摘要、参考来源与反馈操作栏。
 */
import { cn } from "@matt-ui/utils";
import { createContext, useContext } from "react";
import { MarkdownStreamView } from "./ai-response-markdown.js";
import {
  ResponseActionBar,
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

interface AiResponseContextValue {
  content: string;
  status: AiResponseStatus;
  model: string;
  statusLabel?: string;
  tools: AiResponseTool[];
  sources: AiResponseSource[];
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

export const AiResponseHeader = ({ model, statusLabel, className }: AiResponseHeaderProps) => {
  const ctx = useAiResponse();
  const label = statusLabel ?? ctx.statusLabel ?? defaultStatusLabel(ctx.status);

  return (
    <div className={cn("mb-3 flex items-center justify-between gap-2 select-none", className)}>
      <div className="flex items-center gap-2">
        <ResponseStatusDot status={ctx.status} />
        <span className="text-xs font-medium tracking-tight text-foreground">
          {model ?? ctx.model}
        </span>
      </div>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
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
          "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-solid border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-xs text-destructive",
          className,
        )}
      >
        <span>{errorMessage ?? "回复生成失败，请稍后重试。"}</span>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="cursor-pointer rounded-full border border-solid border-destructive/30 bg-transparent px-2.5 py-1 font-sans text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
  const { tools } = useAiResponse();
  return <ResponseToolsPanel tools={tools} className={className} />;
};

export const AiResponseSources = ({ className }: AiResponseSourcesProps) => {
  const { sources } = useAiResponse();
  return <ResponseSourcesPanel sources={sources} className={className} />;
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

export const AiResponse = ({
  content,
  status = "complete",
  model = "Assistant",
  statusLabel,
  tools = [],
  sources = [],
  errorMessage,
  onRegenerate,
  onFeedback,
  onCopy,
  className,
  children,
}: AiResponseProps) => (
  <ResponseCtx.Provider
    value={{
      content,
      status,
      model,
      statusLabel,
      tools,
      sources,
      errorMessage,
      onRegenerate,
      onFeedback,
      onCopy,
    }}
  >
    <article
      data-slot="ai-response"
      data-status={status}
      className={cn(
        "w-full max-w-2xl rounded-[22px] border border-solid border-border bg-card p-5 font-sans text-card-foreground shadow-xs",
        className,
      )}
    >
      {children ?? (
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

export { safeHref };
