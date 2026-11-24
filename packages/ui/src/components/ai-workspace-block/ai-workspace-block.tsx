"use client";

/**
 * AiWorkspaceBlock：由 PromptInput 与多会话侧栏组合的 AI 助手与提示词工作台区块。
 */
import { cn } from "@matt-ui/utils";
import { useState } from "react";
import { ChatPane, ThreadSidebar } from "./ai-workspace-parts.js";
import type { AiMessage, AiThread, AiWorkspaceBlockProps } from "./ai-workspace-block.types.js";
import {
  AI_WORKSPACE_DEFAULT_THREADS,
  AI_WORKSPACE_SHELL_CLASS,
} from "./ai-workspace-block.variants.js";

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
  const [model, setModel] = useState(props.defaultModel ?? "matt-pro");
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
