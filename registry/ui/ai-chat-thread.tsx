// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiChatThread：C 端 AI 对话消息流，支持用户/助手气泡、多版本回复分支切换、复制、反馈评分与快捷追问。
 */

import { cn } from "@/lib/utils";
import {
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

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** 助手消息可选多版本分支内容 */
  variants?: string[];
  model?: string;
  timestamp?: string;
}

export interface AiChatThreadProps {
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
const DEFAULT_MESSAGES: AiChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "周末想去京都待两天，帮我安排一条不赶路、偏咖啡馆和建筑散步的路线？",
    timestamp: "09:41",
  },
  {
    id: "m2",
    role: "assistant",
    model: "Claude Sonnet",
    timestamp: "09:41",
    content:
      "第一天可以从南禅寺一带步行到哲学之道，上午逛完蓝瓶京都店后去冈崎公园看京都市京瓷美术馆；傍晚沿鸭川散步到木屋町吃晚餐，全程平缓好走。",
    variants: [
      "第一天可以从南禅寺一带步行到哲学之道，上午逛完蓝瓶京都店后去冈崎公园看京都市京瓷美术馆；傍晚沿鸭川散步到木屋町吃晚餐，全程平缓好走。",
      "如果你偏爱小众空间，建议把上午留给大山崎山庄美术馆与安藤忠雄地下展厅，下午回到乌丸御池周边慢慢探几家烘焙咖啡馆。",
    ],
  },
];

const DEFAULT_FOLLOWUPS = ["加上第二天行程", "推荐 3 家手冲咖啡馆"];

const ACTION_BTN =
  "inline-flex size-6.5 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
    <div className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground tabular-nums">
      <button type="button" aria-label="上一版本回复" onClick={onPrev} className={ACTION_BTN}>
        <ChevronLeft className="size-3.5" />
      </button>
      <span>
        {idx + 1} / {count}
      </span>
      <button type="button" aria-label="下一版本回复" onClick={onNext} className={ACTION_BTN}>
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
      className={cn(ACTION_BTN, vote === "up" && "bg-secondary text-foreground")}
    >
      <ThumbsUp className="size-3.5" />
    </button>
    <button
      type="button"
      aria-label="改进回复"
      aria-pressed={vote === "down"}
      onClick={() => onVote("down")}
      className={cn(
        ACTION_BTN,
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

const MessageActions = (p: {
  text: string;
  variantIdx: number;
  variantCount: number;
  vote: "up" | "down" | null;
  onPrevVariant: () => void;
  onNextVariant: () => void;
  onRegenerate: () => void;
  onCopy: () => void;
  onVote: (v: "up" | "down") => void;
}) => {
  const { copied, handleCopy } = useCopyTimer(p.text, p.onCopy);
  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-solid border-border/60 pt-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={copied ? "已复制回复" : "复制回复"}
          onClick={handleCopy}
          className={ACTION_BTN}
        >
          {copied ? <Check className="size-3.5 text-signal" /> : <Copy className="size-3.5" />}
        </button>
        <button type="button" aria-label="重新生成" onClick={p.onRegenerate} className={ACTION_BTN}>
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

const AssistantBubble = ({
  msg,
  variantIdx,
  vote,
  onSetVariant,
  onCopy,
  onVote,
}: {
  msg: AiChatMessage;
  variantIdx: number;
  vote: "up" | "down" | null;
  onSetVariant: (next: number) => void;
  onCopy: (text: string) => void;
  onVote: (v: "up" | "down") => void;
}) => {
  const variants = msg.variants?.length ? msg.variants : [msg.content];
  const idx = ((variantIdx % variants.length) + variants.length) % variants.length;
  const activeText = variants[idx] ?? msg.content;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Sparkles aria-hidden="true" className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-foreground">{msg.model ?? "助手"}</span>
          {msg.timestamp && (
            <span className="font-mono text-[11px] text-muted-foreground">{msg.timestamp}</span>
          )}
        </div>
        <p className="m-0 text-[13.5px] leading-relaxed text-foreground/90">{activeText}</p>
        <MessageActions
          text={activeText}
          variantIdx={idx}
          variantCount={variants.length}
          vote={vote}
          onPrevVariant={() => onSetVariant(idx - 1)}
          onNextVariant={() => onSetVariant(idx + 1)}
          onRegenerate={() => onSetVariant(idx + 1)}
          onCopy={() => onCopy(activeText)}
          onVote={onVote}
        />
      </div>
    </div>
  );
};

const FollowUpBar = ({ items, onPick }: { items: string[]; onPick: (p: string) => void }) =>
  items.length > 0 ? (
    <div className="flex flex-wrap items-center gap-1.5 border-t border-solid border-border/70 pt-3">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className="cursor-pointer rounded-full border border-solid border-border bg-background px-3 py-1 font-sans text-xs font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-secondary/60"
        >
          {item}
        </button>
      ))}
    </div>
  ) : null;

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

const UserBubble = ({ content }: { content: string }) => (
  <div className="flex justify-end">
    <div className="max-w-[82%] rounded-[20px] rounded-br-md bg-secondary px-4 py-2.5 text-[13.5px] leading-relaxed text-foreground">
      {content}
    </div>
  </div>
);

export const AiChatThread = ({
  initialMessages = DEFAULT_MESSAGES,
  followUps = DEFAULT_FOLLOWUPS,
  onCopy,
  onFeedback,
  onFollowUp,
  className,
}: AiChatThreadProps) => {
  const [messages, setMessages] = useState<AiChatMessage[]>(initialMessages);
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  const seqRef = useRef(0);
  const askFollowUp = (prompt: string) => {
    seqRef.current += 1;
    setMessages((prev) => [...prev, ...createFollowUpTurn(prompt, seqRef.current)]);
    onFollowUp?.(prompt);
  };

  return (
    <div
      data-slot="ai-chat-thread"
      className={cn(
        "flex w-full max-w-xl flex-col gap-3.5 rounded-[22px] border border-solid border-border bg-card p-5 text-card-foreground shadow-xs",
        className,
      )}
    >
      <div aria-live="polite" className="flex flex-col gap-3">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserBubble key={msg.id} content={msg.content} />
          ) : (
            <AssistantBubble
              key={msg.id}
              msg={msg}
              variantIdx={variants[msg.id] ?? 0}
              vote={votes[msg.id] ?? null}
              onSetVariant={(next) => setVariants((prev) => ({ ...prev, [msg.id]: next }))}
              onCopy={(text) => onCopy?.(text)}
              onVote={(v) => (
                setVotes((prev) => ({ ...prev, [msg.id]: v })),
                onFeedback?.(msg.id, v)
              )}
            />
          ),
        )}
      </div>
      <FollowUpBar items={followUps} onPick={askFollowUp} />
    </div>
  );
};
