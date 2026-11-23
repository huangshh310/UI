"use client";

/**
 * AiChatThread 内部消息操作、投票、追问与用户气泡部件。
 */
import { cn } from "@matt-ui/utils";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AiChatMessage } from "./ai-chat-thread.types.js";
import { CHAT_ACTION_BTN } from "./ai-chat-thread.variants.js";

const VariantPager = ({
  idx,
  count,
  onPrev,
  onNext,
}: {
  idx: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
}) =>
  count > 1 ? (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border/70 bg-secondary/50 px-1 py-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
      <button type="button" aria-label="上一版本回复" onClick={onPrev} className={CHAT_ACTION_BTN}>
        <ChevronLeft className="size-3.5" />
      </button>
      <span className="px-1">
        {idx + 1} / {count}
      </span>
      <button type="button" aria-label="下一版本回复" onClick={onNext} className={CHAT_ACTION_BTN}>
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  ) : null;

const VoteButtons = ({
  vote,
  onVote,
}: {
  vote: "up" | "down" | null;
  onVote: (v: "up" | "down") => void;
}) => (
  <>
    <button
      type="button"
      aria-label="赞同回复"
      aria-pressed={vote === "up"}
      onClick={() => onVote("up")}
      className={cn(
        CHAT_ACTION_BTN,
        vote === "up" && "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
      )}
    >
      <ThumbsUp className="size-3.5" />
    </button>
    <button
      type="button"
      aria-label="改进回复"
      aria-pressed={vote === "down"}
      onClick={() => onVote("down")}
      className={cn(
        CHAT_ACTION_BTN,
        vote === "down" && "bg-rose-500/12 text-rose-700 dark:text-rose-300",
      )}
    >
      <ThumbsDown className="size-3.5" />
    </button>
  </>
);

const useCopyTimer = (text: string, onCopy: () => void) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  const handleCopy = () => {
    navigator.clipboard?.writeText(text).catch(() => {});
    onCopy();
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCopied(false);
    }, 1200);
  };
  return { copied, handleCopy };
};

export interface MessageActionsProps {
  text: string;
  variantIdx: number;
  variantCount: number;
  vote: "up" | "down" | null;
  onPrevVariant: () => void;
  onNextVariant: () => void;
  onRegenerate: () => void;
  onCopy: () => void;
  onVote: (v: "up" | "down") => void;
}

export const MessageActions = (p: MessageActionsProps) => {
  const { copied, handleCopy } = useCopyTimer(p.text, p.onCopy);
  return (
    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-solid border-border/60 pt-2">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          aria-label={copied ? "已复制回复" : "复制回复"}
          onClick={handleCopy}
          className={CHAT_ACTION_BTN}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
        <button
          type="button"
          aria-label="重新生成"
          onClick={p.onRegenerate}
          className={CHAT_ACTION_BTN}
        >
          <RefreshCw className="size-3.5" />
        </button>
        <VoteButtons vote={p.vote} onVote={p.onVote} />
      </div>
      <VariantPager
        idx={p.variantIdx}
        count={p.variantCount}
        onPrev={p.onPrevVariant}
        onNext={p.onNextVariant}
      />
    </div>
  );
};

export const AssistantMetaHeader = ({
  msg,
  showTimestamps,
}: {
  msg: AiChatMessage;
  showTimestamps: boolean;
}) => (
  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold tracking-tight text-foreground">
        {msg.model ?? "助手"}
      </span>
      {msg.streaming && (
        <span className="inline-flex items-center gap-1 rounded-full bg-signal/12 px-2 py-0.5 font-mono text-[10px] font-medium text-signal">
          <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-signal" />
          生成中
        </span>
      )}
    </div>
    <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground tabular-nums">
      {msg.meta && <span>{msg.meta}</span>}
      {showTimestamps && msg.timestamp && <span>{msg.timestamp}</span>}
    </div>
  </div>
);

export const FollowUpBar = ({ items, onPick }: { items: string[]; onPick: (p: string) => void }) =>
  items.length > 0 ? (
    <div className="flex flex-wrap items-center gap-1.5 border-t border-solid border-border/70 pt-3">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-solid border-border/85 bg-background px-3 py-1 font-sans text-xs font-medium text-foreground transition-colors hover:border-signal/40 hover:bg-secondary/80 outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-secondary/50"
        >
          <span>{item}</span>
          <ArrowUpRight aria-hidden="true" className="size-3 text-muted-foreground" />
        </button>
      ))}
    </div>
  ) : null;

export const UserBubble = ({
  content,
  timestamp,
  showTimestamps,
}: {
  content: string;
  timestamp?: string;
  showTimestamps: boolean;
}) => (
  <div className="flex flex-col items-end gap-1">
    <div className="max-w-[82%] rounded-2xl rounded-br-sm border border-solid border-border/65 bg-secondary/85 px-4 py-2.5 text-[13.5px] leading-relaxed text-foreground">
      {content}
    </div>
    {showTimestamps && timestamp && (
      <span className="pr-1 font-mono text-[10px] text-muted-foreground tabular-nums">
        {timestamp}
      </span>
    )}
  </div>
);
