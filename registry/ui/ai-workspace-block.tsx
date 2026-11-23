// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiWorkspaceBlock：由 PromptInput 与多会话侧栏组合的 AI 助手与提示词工作台区块。
 */

import { PromptInput } from "@/components/ui/prompt-input";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus } from "lucide-react";
import { useState } from "react";

export const AI_WORKSPACE_MODELS = [
  { id: "claude-sonnet", label: "Claude Sonnet" },
  { id: "gemini-pro", label: "Gemini Pro" },
  { id: "gpt-4o", label: "GPT-4o" },
];

export const AI_WORKSPACE_SUGGESTIONS = [
  "检查浅色与深色对比度",
  "生成 shadcn Registry 命令",
  "审查表单键盘焦点顺序",
];

export const AI_WORKSPACE_DEFAULT_THREADS: AiThread[] = [
  {
    id: "t1",
    title: "设计系统 Token 巡检",
    updatedAt: "刚刚",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "帮我核对新组件在浅色和深色主题下的边框与文字对比度。",
        timestamp: "10:12",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "已核对：信号色 bg-signal 配 text-signal-foreground 在双主题下达到 4.95:1，1px 发丝边框采用 --ui-border，无重边框残留。",
        timestamp: "10:12",
      },
    ],
  },
  {
    id: "t2",
    title: "Registry 分发检查",
    updatedAt: "15 分钟前",
    messages: [
      {
        id: "m3",
        role: "assistant",
        content: "全部 71 个 Registry 条目已生成并通过独立 Vite 消费方构建验证。",
        timestamp: "09:56",
      },
    ],
  },
];

export const AI_WORKSPACE_SHELL_CLASS: Record<AiWorkspaceVariant, string> = {
  split: "@2xl:min-h-[450px] @2xl:flex-row",
  compact: "min-h-[400px] flex-col",
};
export type AiWorkspaceVariant = "split" | "compact";

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AiThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: AiMessage[];
}

export interface AiWorkspaceBlockProps {
  /** 初始会话列表 */
  initialThreads?: AiThread[];
  /** 助手名称 */
  title?: string;
  /** 布局变体：分栏侧边栏或紧凑顶部会话条 */
  variant?: AiWorkspaceVariant;
  /** 默认选中的模型标识 */
  defaultModel?: string;
  /** 是否显示消息时间戳 */
  showTimestamps?: boolean;
  /** 发送消息回调 */
  onSend?: (text: string, model: string) => void;
  /** 自定义类名 */
  className?: string;
}
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

const ThreadSidebar = ({
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

const ChatPane = ({
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
const appendReply = (
  threads: AiThread[],
  activeId: string,
  text: string,
  model: string,
): AiThread[] => {
  const userMsg: AiMessage = {
    id: `u-${Date.now()}`,
    role: "user",
    content: text,
    timestamp: "刚刚",
  };
  const botMsg: AiMessage = {
    id: `a-${Date.now() + 1}`,
    role: "assistant",
    content: `[${model}] 已收到「${text}」，相关组件 Token 与可访问性方案已就绪。`,
    timestamp: "刚刚",
  };
  return threads.map((t) =>
    t.id === activeId ? { ...t, updatedAt: "刚刚", messages: [...t.messages, userMsg, botMsg] } : t,
  );
};

const createBlankThread = (count: number): AiThread => ({
  id: `t-${Date.now()}`,
  title: `新对话 ${count + 1}`,
  updatedAt: "刚刚",
  messages: [
    {
      id: `m-${Date.now()}`,
      role: "assistant",
      content: "你好！可以向我提问组件选型、无障碍规范或 Registry 集成问题。",
      timestamp: "刚刚",
    },
  ],
});

const useWorkspaceState = (props: AiWorkspaceBlockProps) => {
  const initial = props.initialThreads ?? AI_WORKSPACE_DEFAULT_THREADS;
  const [threads, setThreads] = useState(initial);
  const [activeId, setActiveId] = useState(initial[0]?.id ?? "t1");
  const [model, setModel] = useState(props.defaultModel ?? "claude-sonnet");
  const [draft, setDraft] = useState("");
  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0];

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !activeThread) return;
    setThreads((prev) => appendReply(prev, activeThread.id, trimmed, model));
    setDraft("");
    props.onSend?.(trimmed, model);
  };

  const handleNewThread = () => {
    const created = createBlankThread(threads.length);
    setThreads((prev) => [created, ...prev]);
    setActiveId(created.id);
  };

  return {
    threads,
    activeThread,
    setActiveId,
    model,
    setModel,
    draft,
    setDraft,
    handleSubmit,
    handleNewThread,
  };
};

export const AiWorkspaceBlock = (props: AiWorkspaceBlockProps) => {
  const variant = props.variant ?? "split";
  const state = useWorkspaceState(props);

  return (
    <div
      data-slot="ai-workspace-block"
      data-variant={variant}
      className={cn("@container w-full", props.className)}
    >
      <div
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10",
          AI_WORKSPACE_SHELL_CLASS[variant],
        )}
      >
        <ThreadSidebar
          title={props.title ?? "AI 工程助手"}
          variant={variant}
          threads={state.threads}
          activeId={state.activeThread?.id ?? ""}
          onSelect={state.setActiveId}
          onNew={state.handleNewThread}
        />
        <ChatPane
          thread={state.activeThread}
          model={state.model}
          draft={state.draft}
          showTimestamps={props.showTimestamps ?? true}
          onModelChange={state.setModel}
          onDraftChange={state.setDraft}
          onSubmit={state.handleSubmit}
        />
      </div>
    </div>
  );
};
