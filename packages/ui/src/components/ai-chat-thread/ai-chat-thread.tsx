"use client";

/**
 * AiChatThread：对标 HextaUI Chat Thread 的极简 AI 对话消息流，
 * 支持模型切换分隔线、可折叠思考轨迹、联网搜索摘要、行内来源微胶囊、对比表、多版本分支切换与悬浮追问输入条。
 */
import { cn } from "@matt-ui/utils";
import { useRef, useState } from "react";
import {
  AssistantMetaHeader,
  FollowUpBar,
  MessageActions,
  UserBubble,
} from "./ai-chat-thread.parts.js";
import {
  ChatCheckpointsRail,
  ChatCitationsRow,
  ChatComparisonTable,
  ChatDivider,
  ChatFollowUpComposer,
  ChatThinkingTrace,
  ChatWebSearchRow,
} from "./ai-chat-thread.rich.js";
import type { AiChatMessage, AiChatThreadProps } from "./ai-chat-thread.types.js";
import {
  CHAT_DEFAULT_FOLLOWUPS,
  CHAT_DEFAULT_MESSAGES,
  chatThreadVariants,
} from "./ai-chat-thread.variants.js";

interface AssistantBubbleProps {
  msg: AiChatMessage;
  variantIdx: number;
  vote: "up" | "down" | null;
  showTimestamps: boolean;
  onSetVariant: (next: number) => void;
  onCopy: (text: string) => void;
  onVote: (v: "up" | "down") => void;
}

const AssistantRichParts = ({
  msg,
  showTimestamps,
}: {
  msg: AiChatMessage;
  showTimestamps: boolean;
}) => (
  <>
    {!(msg.thinking || msg.webSearch) && (
      <AssistantMetaHeader msg={msg} showTimestamps={showTimestamps} />
    )}
    {msg.thinking && <ChatThinkingTrace thinking={msg.thinking} />}
    {msg.webSearch && <ChatWebSearchRow search={msg.webSearch} />}
  </>
);

const AssistantAttachments = ({ msg }: { msg: AiChatMessage }) => (
  <>
    {msg.citations && msg.citations.length > 0 && <ChatCitationsRow citations={msg.citations} />}
    {msg.table && <ChatComparisonTable table={msg.table} />}
  </>
);

const AssistantBubble = (p: AssistantBubbleProps) => {
  const variants = p.msg.variants?.length ? p.msg.variants : [p.msg.content];
  const idx = ((p.variantIdx % variants.length) + variants.length) % variants.length;
  const activeText = variants[idx] ?? p.msg.content;

  return (
    <div className="flex flex-col">
      <AssistantRichParts msg={p.msg} showTimestamps={p.showTimestamps} />
      <p className="m-0 text-[13.5px] leading-[1.72] text-foreground/92">
        {activeText}
        {p.msg.streaming && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-foreground/75 align-baseline"
          />
        )}
      </p>
      <AssistantAttachments msg={p.msg} />
      <MessageActions
        text={activeText}
        variantIdx={idx}
        variantCount={variants.length}
        vote={p.vote}
        onPrevVariant={() => p.onSetVariant(idx - 1)}
        onNextVariant={() => p.onSetVariant(idx + 1)}
        onRegenerate={() => p.onSetVariant(idx + 1)}
        onCopy={() => p.onCopy(activeText)}
        onVote={p.onVote}
      />
    </div>
  );
};

const createFollowUpTurn = (prompt: string, seq: number, model: string): AiChatMessage[] => [
  { id: `u-${seq}`, role: "user", content: prompt, timestamp: "刚刚" },
  {
    id: `a-${seq}`,
    role: "assistant",
    model,
    timestamp: "刚刚",
    thinking: {
      duration: "1s",
      defaultOpen: false,
      steps: [{ title: "理解追问上下文", detail: `结合上一轮讨论整理「${prompt}」的核心结论。` }],
    },
    content: `好的，已按「${prompt}」为你整理好可执行建议与关键要点。`,
  },
];

const ThreadMessageItem = ({
  msg,
  variantIdx,
  vote,
  showTimestamps,
  onSetVariant,
  onCopy,
  onVote,
}: {
  msg: AiChatMessage;
  variantIdx: number;
  vote: "up" | "down" | null;
  showTimestamps: boolean;
  onSetVariant: (next: number) => void;
  onCopy: (text: string) => void;
  onVote: (v: "up" | "down") => void;
}) => (
  <div className="flex flex-col gap-3">
    {msg.divider && <ChatDivider label={msg.divider} />}
    {msg.role === "user" ? (
      <UserBubble content={msg.content} timestamp={msg.timestamp} showTimestamps={showTimestamps} />
    ) : (
      <AssistantBubble
        msg={msg}
        variantIdx={variantIdx}
        vote={vote}
        showTimestamps={showTimestamps}
        onSetVariant={onSetVariant}
        onCopy={onCopy}
        onVote={onVote}
      />
    )}
  </div>
);

const DEFAULT_THREAD_CONFIG = {
  variant: "card" as const,
  showTimestamps: true,
  initialMessages: CHAT_DEFAULT_MESSAGES,
  followUps: CHAT_DEFAULT_FOLLOWUPS,
  showComposer: true,
  composerPlaceholder: "继续追问…",
  modelName: "Nova 3",
  effortLabel: "Medium",
  contextUsage: 7,
  showCheckpoints: true,
};

const ThreadMessageList = (p: {
  messages: AiChatMessage[];
  variants: Record<string, number>;
  votes: Record<string, "up" | "down">;
  showTimestamps: boolean;
  onSetVariant: (id: string, next: number) => void;
  onCopy: (text: string) => void;
  onVote: (id: string, v: "up" | "down") => void;
}) => (
  <div aria-live="polite" className="flex flex-col gap-4">
    {p.messages.map((msg) => (
      <ThreadMessageItem
        key={msg.id}
        msg={msg}
        variantIdx={p.variants[msg.id] ?? 0}
        vote={p.votes[msg.id] ?? null}
        showTimestamps={p.showTimestamps}
        onSetVariant={(next) => p.onSetVariant(msg.id, next)}
        onCopy={p.onCopy}
        onVote={(v) => p.onVote(msg.id, v)}
      />
    ))}
  </div>
);

export const AiChatThread = (props: AiChatThreadProps) => {
  const cfg = { ...DEFAULT_THREAD_CONFIG, ...props };
  const [messages, setMessages] = useState<AiChatMessage[]>(cfg.initialMessages);
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  const seqRef = useRef(0);

  const askFollowUp = (prompt: string) => {
    seqRef.current += 1;
    setMessages((prev) => [...prev, ...createFollowUpTurn(prompt, seqRef.current, cfg.modelName)]);
    props.onFollowUp?.(prompt);
  };
  const handleVote = (id: string, vote: "up" | "down") => {
    setVotes((prev) => ({ ...prev, [id]: vote }));
    props.onFeedback?.(id, vote);
  };
  const userTurns = messages.filter((m) => m.role === "user").length;

  return (
    <div
      data-slot="ai-chat-thread"
      data-variant={cfg.variant}
      className={cn(chatThreadVariants({ variant: cfg.variant }), props.className)}
    >
      {cfg.showCheckpoints && <ChatCheckpointsRail count={userTurns} activeIndex={userTurns - 1} />}
      <ThreadMessageList
        messages={messages}
        variants={variants}
        votes={votes}
        showTimestamps={cfg.showTimestamps}
        onSetVariant={(id, next) => setVariants((prev) => ({ ...prev, [id]: next }))}
        onCopy={(text) => props.onCopy?.(text)}
        onVote={handleVote}
      />
      <FollowUpBar items={cfg.followUps} onPick={askFollowUp} />
      {cfg.showComposer && (
        <ChatFollowUpComposer
          placeholder={cfg.composerPlaceholder}
          streaming={messages.some((m) => m.streaming)}
          modelName={cfg.modelName}
          effortLabel={cfg.effortLabel}
          contextUsage={cfg.contextUsage}
          onSubmit={askFollowUp}
        />
      )}
    </div>
  );
};
