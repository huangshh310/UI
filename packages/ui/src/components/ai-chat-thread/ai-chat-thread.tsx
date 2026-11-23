"use client";

/**
 * AiChatThread：C 端 AI 对话消息流，支持用户/助手气泡、流式生成态、多版本分支切换、复制、反馈评分与快捷追问。
 */
import { cn } from "@matt-ui/utils";
import { Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import {
  AssistantMetaHeader,
  FollowUpBar,
  MessageActions,
  UserBubble,
} from "./ai-chat-thread.parts.js";
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

const AssistantBubble = (p: AssistantBubbleProps) => {
  const variants = p.msg.variants?.length ? p.msg.variants : [p.msg.content];
  const idx = ((p.variantIdx % variants.length) + variants.length) % variants.length;
  const activeText = variants[idx] ?? p.msg.content;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-solid border-border/80 bg-secondary/75 text-foreground shadow-2xs">
        <Sparkles aria-hidden="true" className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <AssistantMetaHeader msg={p.msg} showTimestamps={p.showTimestamps} />
        <p className="m-0 text-[13.5px] leading-[1.68] text-foreground/92">
          {activeText}
          {p.msg.streaming && (
            <span
              aria-hidden="true"
              className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse rounded-[2px] bg-signal align-baseline"
            />
          )}
        </p>
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
    </div>
  );
};

const createFollowUpTurn = (prompt: string, seq: number): AiChatMessage[] => [
  { id: `u-${seq}`, role: "user", content: prompt, timestamp: "刚刚" },
  {
    id: `a-${seq}`,
    role: "assistant",
    model: "Claude Sonnet",
    timestamp: "刚刚",
    content: `好的，已按「${prompt}」为你整理好时间表与步行距离建议。`,
  },
];

export const AiChatThread = (props: AiChatThreadProps) => {
  const variant = props.variant ?? "card";
  const showTimestamps = props.showTimestamps ?? true;
  const [messages, setMessages] = useState<AiChatMessage[]>(
    props.initialMessages ?? CHAT_DEFAULT_MESSAGES,
  );
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  const seqRef = useRef(0);

  const askFollowUp = (prompt: string) => {
    seqRef.current += 1;
    setMessages((prev) => [...prev, ...createFollowUpTurn(prompt, seqRef.current)]);
    props.onFollowUp?.(prompt);
  };

  return (
    <div
      data-slot="ai-chat-thread"
      data-variant={variant}
      className={cn(chatThreadVariants({ variant }), props.className)}
    >
      <div aria-live="polite" className="flex flex-col gap-3.5">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserBubble
              key={msg.id}
              content={msg.content}
              timestamp={msg.timestamp}
              showTimestamps={showTimestamps}
            />
          ) : (
            <AssistantBubble
              key={msg.id}
              msg={msg}
              variantIdx={variants[msg.id] ?? 0}
              vote={votes[msg.id] ?? null}
              showTimestamps={showTimestamps}
              onSetVariant={(next) => setVariants((prev) => ({ ...prev, [msg.id]: next }))}
              onCopy={(text) => props.onCopy?.(text)}
              onVote={(v) => {
                setVotes((prev) => ({ ...prev, [msg.id]: v }));
                props.onFeedback?.(msg.id, v);
              }}
            />
          ),
        )}
      </div>
      <FollowUpBar items={props.followUps ?? CHAT_DEFAULT_FOLLOWUPS} onPick={askFollowUp} />
    </div>
  );
};
