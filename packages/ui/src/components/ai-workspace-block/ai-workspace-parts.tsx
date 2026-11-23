"use client";

/**
 * AiWorkspaceBlock 内部会话侧栏、消息流与底部输入面板部件。
 */
import { cn } from "@matt-ui/utils";
import { MessageSquare, Plus } from "lucide-react";
import { PromptInput } from "../prompt-input/index.js";
import type { AiMessage, AiThread, AiWorkspaceVariant } from "./ai-workspace-block.types.js";
import { AI_WORKSPACE_MODELS, AI_WORKSPACE_SUGGESTIONS } from "./ai-workspace-block.variants.js";

const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const ThreadButton = ({
  thread,
  active,
  compact,
  onSelect,
}: {
  thread: AiThread;
  active: boolean;
  compact: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    aria-current={active ? "true" : undefined}
    onClick={onSelect}
    className={cn(
      "flex shrink-0 cursor-pointer items-center justify-between gap-2 rounded-lg border border-solid border-transparent px-2.5 py-1.5 text-left text-xs transition-colors",
      FOCUS_RING,
      active
        ? "bg-accent/70 font-medium text-foreground"
        : "bg-transparent text-muted-foreground hover:bg-accent/40 hover:text-foreground",
    )}
  >
    <span className="flex min-w-0 items-center gap-2">
      <MessageSquare aria-hidden="true" className="size-3.5 shrink-0 opacity-75" />
      <span className="truncate">{thread.title}</span>
    </span>
    {!compact && (
      <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums @2xl:inline">
        {thread.updatedAt}
      </span>
    )}
  </button>
);

const SidebarHeader = ({
  title,
  count,
  onNew,
}: {
  title: string;
  count: number;
  onNew: () => void;
}) => (
  <div className="flex items-center justify-between gap-2 px-1">
    <div className="flex min-w-0 items-center gap-2">
      <span className="truncate text-xs font-semibold tracking-tight text-foreground">{title}</span>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{count}</span>
    </div>
    <button
      type="button"
      aria-label="新建对话"
      onClick={onNew}
      className={cn(
        "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-solid border-transparent bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        FOCUS_RING,
      )}
    >
      <Plus className="size-3.5" />
    </button>
  </div>
);

export const ThreadSidebar = ({
  title,
  variant,
  threads,
  activeId,
  onSelect,
  onNew,
}: {
  title: string;
  variant: AiWorkspaceVariant;
  threads: AiThread[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}) => {
  const isCompact = variant === "compact";
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-2.5 border-b border-solid border-border/75 bg-muted/35 p-3 dark:border-white/8 dark:bg-white/[0.02]",
        !isCompact && "@2xl:w-60 @2xl:border-r @2xl:border-b-0",
      )}
    >
      <SidebarHeader title={title} count={threads.length} onNew={onNew} />
      <div className={cn("flex flex-row gap-1 overflow-x-auto", !isCompact && "@2xl:flex-col")}>
        {threads.map((thread) => (
          <ThreadButton
            key={thread.id}
            thread={thread}
            active={activeId === thread.id}
            compact={isCompact}
            onSelect={() => onSelect(thread.id)}
          />
        ))}
      </div>
    </div>
  );
};

const MessageRow = ({ msg, showTimestamps }: { msg: AiMessage; showTimestamps: boolean }) => {
  if (msg.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="max-w-[82%] rounded-xl bg-secondary/80 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-foreground">
          <p className="m-0">{msg.content}</p>
        </div>
        {showTimestamps && (
          <span className="pr-1 font-mono text-[11px] text-muted-foreground tabular-nums">
            你 · {msg.timestamp}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start gap-1">
      <p className="m-0 text-[13.5px] leading-[1.7] text-foreground/92">{msg.content}</p>
      {showTimestamps && (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          助手 · {msg.timestamp}
        </span>
      )}
    </div>
  );
};

const ChatHeader = ({ thread, model }: { thread?: AiThread; model: string }) => {
  const modelLabel = AI_WORKSPACE_MODELS.find((m) => m.id === model)?.label ?? model;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-border/75 px-4 py-2.5 dark:border-white/8">
      <div className="flex min-w-0 items-center gap-2">
        <p className="m-0 truncate text-xs font-semibold tracking-tight text-foreground">
          {thread?.title}
        </p>
        {thread && (
          <span className="hidden font-mono text-[11px] text-muted-foreground tabular-nums sm:inline">
            {thread.messages.length} 条消息
          </span>
        )}
      </div>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
        {modelLabel}
      </span>
    </div>
  );
};

export const ChatPane = ({
  thread,
  model,
  draft,
  showTimestamps,
  onModelChange,
  onDraftChange,
  onSubmit,
}: {
  thread?: AiThread;
  model: string;
  draft: string;
  showTimestamps: boolean;
  onModelChange: (id: string) => void;
  onDraftChange: (text: string) => void;
  onSubmit: (text: string) => void;
}) => (
  <div className="flex min-w-0 flex-1 flex-col">
    <ChatHeader thread={thread} model={model} />
    {thread && (
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
        {thread.messages.map((msg) => (
          <MessageRow key={msg.id} msg={msg} showTimestamps={showTimestamps} />
        ))}
      </div>
    )}
    <div className="border-t border-solid border-border/75 px-4 py-3 dark:border-white/8">
      <PromptInput
        className="max-w-none"
        size="sm"
        radius="lg"
        value={draft}
        onValueChange={onDraftChange}
        onSubmit={onSubmit}
        models={AI_WORKSPACE_MODELS}
        selectedModel={model}
        onModelChange={onModelChange}
        suggestions={AI_WORKSPACE_SUGGESTIONS}
        onSelectSuggestion={onDraftChange}
        placeholder="输入组件问题、代码审查指令或 Token 需求…"
        aria-label="向 AI 助手发送消息"
      />
    </div>
  </div>
);
