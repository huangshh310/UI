"use client";

import { cn } from "@matt-ui/utils";
import { Bot, MessageSquare, Plus, Sparkles, User } from "lucide-react";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { PromptInput } from "../prompt-input/index.js";
import type { AiMessage, AiThread, AiWorkspaceVariant } from "./ai-workspace-block.types.js";
import { AI_WORKSPACE_MODELS, AI_WORKSPACE_SUGGESTIONS } from "./ai-workspace-block.variants.js";

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
      "flex shrink-0 cursor-pointer items-center justify-between gap-2 rounded-xl border border-solid px-3 py-2 text-left text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active
        ? "border-border/80 bg-card font-medium text-foreground shadow-xs dark:border-white/12"
        : "border-transparent bg-transparent text-muted-foreground hover:bg-accent/70 hover:text-foreground",
    )}
  >
    <span className="flex min-w-0 items-center gap-2">
      <MessageSquare aria-hidden="true" className="size-3.5 shrink-0" />
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
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      <span className="inline-flex size-6.5 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
        <Sparkles aria-hidden="true" className="size-3.5" />
      </span>
      <span className="text-sm font-semibold tracking-tight text-foreground">{title}</span>
      <Badge variant="secondary" size="sm" className="font-mono tabular-nums">
        {count}
      </Badge>
    </div>
    <Button size="icon" variant="ghost" aria-label="新建对话" onClick={onNew}>
      <Plus className="size-4" />
    </Button>
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
        "flex shrink-0 flex-col gap-3 border-b border-solid border-border/80 bg-secondary/30 p-3.5 dark:border-white/10 dark:bg-secondary/20",
        !isCompact && "@2xl:w-64 @2xl:border-r @2xl:border-b-0",
      )}
    >
      <SidebarHeader title={title} count={threads.length} onNew={onNew} />
      <div className={cn("flex flex-row gap-1.5 overflow-x-auto", !isCompact && "@2xl:flex-col")}>
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
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}>
      <span
        className={cn(
          "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-solid",
          isUser
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border/80 bg-secondary text-foreground dark:border-white/12",
        )}
      >
        {isUser ? (
          <User aria-hidden="true" className="size-3.5" />
        ) : (
          <Bot aria-hidden="true" className="size-3.5" />
        )}
      </span>
      <div className={cn("flex max-w-[82%] flex-col gap-1", isUser && "items-end")}>
        <div
          className={cn(
            "px-3.5 py-2.5 text-[13px] leading-relaxed",
            isUser
              ? "rounded-[18px] rounded-tr-sm bg-secondary text-foreground"
              : "rounded-[18px] rounded-tl-sm border border-solid border-border/80 bg-background text-foreground shadow-xs dark:border-white/10 dark:bg-secondary/35",
          )}
        >
          <p className="m-0">{msg.content}</p>
        </div>
        {showTimestamps && (
          <span className="px-1 font-mono text-[10px] text-muted-foreground tabular-nums">
            {isUser ? "你" : "助手"} · {msg.timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

const ChatHeader = ({ thread, model }: { thread?: AiThread; model: string }) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-border/80 px-4 py-3 dark:border-white/10">
    <div className="flex min-w-0 items-center gap-2">
      <p className="m-0 truncate text-sm font-semibold tracking-tight text-foreground">
        {thread?.title}
      </p>
      {thread && (
        <span className="hidden font-mono text-[11px] text-muted-foreground tabular-nums sm:inline">
          {thread.messages.length} 条消息
        </span>
      )}
    </div>
    <Badge variant="soft" size="sm" dot>
      {AI_WORKSPACE_MODELS.find((m) => m.id === model)?.label ?? model}
    </Badge>
  </div>
);

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
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {thread.messages.map((msg) => (
          <MessageRow key={msg.id} msg={msg} showTimestamps={showTimestamps} />
        ))}
      </div>
    )}
    <div className="border-t border-solid border-border/80 bg-secondary/20 p-3.5 dark:border-white/10 dark:bg-secondary/15">
      <PromptInput
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
