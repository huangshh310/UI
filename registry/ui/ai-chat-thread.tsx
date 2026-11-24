// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiChatThread：轻盈现代的 AI 对话消息流，支持用户/助手消息、流式生成态、多版本分支切换、复制、反馈评分与快捷追问。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const chatThreadVariants = cva("flex w-full flex-col text-card-foreground", {
  variants: {
    variant: {
      card: "gap-5 rounded-xl border border-solid border-border bg-card p-5 shadow-xs dark:border-white/10",
      seamless: "gap-5 bg-transparent p-0",
      compact:
        "gap-3.5 rounded-xl border border-solid border-border bg-card p-3.5 shadow-xs dark:border-white/10",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const CHAT_ACTION_BTN =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-solid border-transparent bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const CHAT_DEFAULT_MESSAGES: AiChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "周末想去京都待两天，帮我安排一条不赶路、偏咖啡馆和建筑散步的路线？",
    timestamp: "09:41",
  },
  {
    id: "m2",
    role: "assistant",
    model: "Matt Pro",
    timestamp: "09:41",
    meta: "1.2s · 164 tok",
    content:
      "第一天可以从南禅寺一带步行到哲学之道，上午逛完蓝瓶京都店后去冈崎公园看京都市京瓷美术馆；傍晚沿鸭川散步到木屋町吃晚餐，全程平缓好走。",
    variants: [
      "第一天可以从南禅寺一带步行到哲学之道，上午逛完蓝瓶京都店后去冈崎公园看京都市京瓷美术馆；傍晚沿鸭川散步到木屋町吃晚餐，全程平缓好走。",
      "如果你偏爱小众空间，建议把上午留给大山崎山庄美术馆与安藤忠雄地下展厅，下午回到乌丸御池周边慢慢探几家烘焙咖啡馆。",
    ],
  },
];

export const CHAT_DEFAULT_FOLLOWUPS = ["加上第二天行程", "推荐 3 家手冲咖啡馆"];
export type AiChatThreadVariant = "card" | "seamless" | "compact";

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** 助手消息可选多版本分支内容 */
  variants?: string[];
  model?: string;
  timestamp?: string;
  /** 可选回复耗时或 Token 元信息（如 "1.1s · 280 tok"） */
  meta?: string;
  /** 是否处于流式输出中 */
  streaming?: boolean;
}

export interface AiChatThreadProps {
  /** 容器视觉变体：标准卡片（card）、无框画布（seamless）或紧凑侧栏（compact） */
  variant?: AiChatThreadVariant;
  /** 是否显示消息时间戳 */
  showTimestamps?: boolean;
  /** 初始对话消息流 */
  initialMessages?: AiChatMessage[];
  /** 底部快捷追问建议词 */
  followUps?: string[];
  /** 复制消息回调 */
  onCopy?: (content: string) => void;
  /** 点赞或点踩反馈回调 */
  onFeedback?: (messageId: string, vote: "up" | "down") => void;
  /** 点击追问建议回调 */
  onFollowUp?: (prompt: string) => void;
  /** 自定义类名 */
  className?: string;
}
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
    <div className="inline-flex items-center gap-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
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
        vote === "up" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
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
        vote === "down" && "bg-rose-500/10 text-rose-700 dark:text-rose-300",
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

interface MessageActionsProps {
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

const MessageActions = (p: MessageActionsProps) => {
  const { copied, handleCopy } = useCopyTimer(p.text, p.onCopy);
  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
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

const AssistantMetaHeader = ({
  msg,
  showTimestamps,
}: {
  msg: AiChatMessage;
  showTimestamps: boolean;
}) => (
  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
    <div className="flex items-center gap-1.5">
      <Sparkles aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="text-xs font-medium tracking-tight text-foreground">
        {msg.model ?? "助手"}
      </span>
      {msg.streaming && (
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
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

const FollowUpBar = ({ items, onPick }: { items: string[]; onPick: (p: string) => void }) =>
  items.length > 0 ? (
    <div className="flex flex-wrap items-center gap-1.5 border-t border-solid border-border/75 pt-3 dark:border-white/8">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-solid border-border/75 bg-transparent px-2.5 font-sans text-xs text-muted-foreground transition-colors hover:border-border hover:bg-muted/60 hover:text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/8 dark:hover:bg-white/[0.04]"
        >
          <span>{item}</span>
          <ArrowUpRight aria-hidden="true" className="size-3 opacity-70" />
        </button>
      ))}
    </div>
  ) : null;

const UserBubble = ({
  content,
  timestamp,
  showTimestamps,
}: {
  content: string;
  timestamp?: string;
  showTimestamps: boolean;
}) => (
  <div className="flex flex-col items-end gap-1">
    <div className="max-w-[82%] rounded-xl bg-secondary/80 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-foreground">
      {content}
    </div>
    {showTimestamps && timestamp && (
      <span className="pr-1 font-mono text-[11px] text-muted-foreground tabular-nums">
        {timestamp}
      </span>
    )}
  </div>
);
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
    <div className="flex flex-col">
      <AssistantMetaHeader msg={p.msg} showTimestamps={p.showTimestamps} />
      <p className="m-0 text-[13.5px] leading-[1.7] text-foreground/92">
        {activeText}
        {p.msg.streaming && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-foreground/75 align-baseline"
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
  );
};

const createFollowUpTurn = (prompt: string, seq: number): AiChatMessage[] => [
  { id: `u-${seq}`, role: "user", content: prompt, timestamp: "刚刚" },
  {
    id: `a-${seq}`,
    role: "assistant",
    model: "Matt Pro",
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
      <div aria-live="polite" className="flex flex-col gap-4">
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
