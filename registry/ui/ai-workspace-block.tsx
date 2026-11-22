// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiWorkspaceBlock：由 PromptInput、Badge、Button 与多会话侧栏组合的 AI 助手与提示词工作台区块。
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PromptInput } from "@/components/ui/prompt-input";
import { cn } from "@/lib/utils";
import { Bot, MessageSquare, Plus, Sparkles, User } from "lucide-react";
import { useState } from "react";

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
  /** 发送消息回调 */
  onSend?: (text: string, model: string) => void;
  /** 自定义类名 */
  className?: string;
}
const MODELS = [
  { id: "claude-sonnet", label: "Claude Sonnet" },
  { id: "gemini-pro", label: "Gemini Pro" },
  { id: "gpt-4o", label: "GPT-4o" },
];

const SUGGESTIONS = ["检查浅色与深色对比度", "生成 shadcn Registry 命令", "审查表单键盘焦点顺序"];

const DEFAULT_THREADS: AiThread[] = [
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

const ThreadSidebar = ({
  threads,
  activeId,
  onSelect,
  onNew,
}: {
  threads: AiThread[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}) => (
  <div className="flex shrink-0 flex-col gap-3 border-b border-solid border-border bg-secondary/35 p-3.5 md:w-60 md:border-r md:border-b-0">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-md bg-signal text-signal-foreground">
          <Sparkles aria-hidden="true" className="size-3.5" />
        </span>
        <span className="text-sm font-semibold text-foreground">AI 工程助手</span>
      </div>
      <Button size="icon" variant="ghost" aria-label="新建对话" onClick={onNew}>
        <Plus className="size-4" />
      </Button>
    </div>
    <div className="flex flex-row gap-1.5 overflow-x-auto md:flex-col">
      {threads.map((thread) => (
        <button
          key={thread.id}
          type="button"
          onClick={() => onSelect(thread.id)}
          className={cn(
            "flex shrink-0 cursor-pointer items-center justify-between gap-2 rounded-lg border border-solid px-2.5 py-2 text-left text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeId === thread.id
              ? "border-border bg-background font-medium text-foreground shadow-xs dark:bg-card"
              : "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <MessageSquare aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">{thread.title}</span>
          </span>
          <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground md:inline">
            {thread.updatedAt}
          </span>
        </button>
      ))}
    </div>
  </div>
);

const MessageList = ({ messages }: { messages: AiMessage[] }) => (
  <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={cn("flex items-start gap-2.5", msg.role === "user" && "flex-row-reverse")}
      >
        <span
          className={cn(
            "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-solid",
            msg.role === "user"
              ? "border-signal bg-signal text-signal-foreground"
              : "border-border bg-secondary text-foreground",
          )}
        >
          {msg.role === "user" ? (
            <User aria-hidden="true" className="size-3.5" />
          ) : (
            <Bot aria-hidden="true" className="size-3.5" />
          )}
        </span>
        <div
          className={cn(
            "max-w-[82%] rounded-xl border border-solid px-3.5 py-2.5 text-xs leading-relaxed",
            msg.role === "user"
              ? "border-signal bg-signal text-signal-foreground"
              : "border-border bg-secondary/45 text-foreground",
          )}
        >
          <p className="m-0">{msg.content}</p>
        </div>
      </div>
    ))}
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

const ChatPane = ({
  thread,
  model,
  draft,
  onModelChange,
  onDraftChange,
  onSubmit,
}: {
  thread?: AiThread;
  model: string;
  draft: string;
  onModelChange: (id: string) => void;
  onDraftChange: (text: string) => void;
  onSubmit: (text: string) => void;
}) => (
  <div className="flex min-w-0 flex-1 flex-col">
    <div className="flex items-center justify-between gap-2 border-b border-solid border-border px-4 py-3">
      <p className="m-0 truncate text-sm font-semibold text-foreground">{thread?.title}</p>
      <Badge variant="secondary" dot>
        {MODELS.find((m) => m.id === model)?.label}
      </Badge>
    </div>
    {thread && <MessageList messages={thread.messages} />}
    <div className="border-t border-solid border-border/80 bg-secondary/20 p-3.5">
      <PromptInput
        value={draft}
        onValueChange={onDraftChange}
        onSubmit={onSubmit}
        models={MODELS}
        selectedModel={model}
        onModelChange={onModelChange}
        suggestions={SUGGESTIONS}
        onSelectSuggestion={onDraftChange}
        placeholder="输入组件问题、代码审查指令或 Token 需求…"
        aria-label="向 AI 助手发送消息"
      />
    </div>
  </div>
);

export const AiWorkspaceBlock = ({
  initialThreads = DEFAULT_THREADS,
  onSend,
  className,
}: AiWorkspaceBlockProps) => {
  const [threads, setThreads] = useState(initialThreads);
  const [activeId, setActiveId] = useState(initialThreads[0]?.id ?? "t1");
  const [model, setModel] = useState("claude-sonnet");
  const [draft, setDraft] = useState("");
  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0];

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !activeThread) return;
    setThreads((prev) => appendReply(prev, activeThread.id, trimmed, model));
    setDraft("");
    onSend?.(trimmed, model);
  };

  const handleNewThread = () => {
    const created = createBlankThread(threads.length);
    setThreads((prev) => [created, ...prev]);
    setActiveId(created.id);
  };

  return (
    <div
      data-slot="ai-workspace-block"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-solid border-border bg-card shadow-sm md:min-h-[430px] md:flex-row",
        className,
      )}
    >
      <ThreadSidebar
        threads={threads}
        activeId={activeThread?.id ?? ""}
        onSelect={setActiveId}
        onNew={handleNewThread}
      />
      <ChatPane
        thread={activeThread}
        model={model}
        draft={draft}
        onModelChange={setModel}
        onDraftChange={setDraft}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
