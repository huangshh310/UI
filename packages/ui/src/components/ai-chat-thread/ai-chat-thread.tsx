"use client";

/**
 * AiChatThread：C 端 AI 对话消息流，支持用户/助手气泡、多版本回复分支切换、复制、反馈评分与快捷追问。
 */
import { cn } from "@matt-ui/utils";
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
import { Badge } from "../badge/index.js";
import type { AiChatMessage, AiChatThreadProps } from "./ai-chat-thread.types.js";

const DEFAULT_MESSAGES: AiChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "如何让 React 组件库既有高端 C 端光影质感，又保持 WCAG AA 无障碍对比度？",
    timestamp: "09:41",
  },
  {
    id: "m2",
    role: "assistant",
    model: "Matt Pro · 200K",
    timestamp: "09:41",
    content:
      "建议采用「柔润瓷白底色 + 陶瓷纯白悬浮卡 + 顶部 1px 镜面内高光」三层表面阶梯，并将主信号色控制在 OKLCH L=0.535，即可兼得通透光影与 >= 5:1 的文字对比度。",
    variants: [
      "建议采用「柔润瓷白底色 + 陶瓷纯白悬浮卡 + 顶部 1px 镜面内高光」三层表面阶梯，并将主信号色控制在 OKLCH L=0.535，即可兼得通透光影与 >= 5:1 的文字对比度。",
      "核心配方分两步：先用多层扩散环境影替代生硬灰框，再为 AI 状态球、进度条与徽章加入低饱和度多频光晕，所有正文对比度仍由自动化 axe 门禁锁定。",
    ],
  },
];

const DEFAULT_FOLLOWUPS = ["生成双主题阴影 Token", "补充语音交互组件"];

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
      className={cn(ACTION_BTN, vote === "up" && "bg-signal/12 text-signal")}
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
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-signal to-indigo-600 text-signal-foreground shadow-sm">
        <Sparkles aria-hidden="true" className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-solid border-border/85 bg-secondary/35 p-3.5">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <Badge variant="outline" shape="tag">
            {msg.model ?? "Matt AI"}
          </Badge>
          {msg.timestamp && (
            <span className="font-mono text-[10px] text-muted-foreground">{msg.timestamp}</span>
          )}
        </div>
        <p className="m-0 text-xs leading-relaxed text-foreground">{activeText}</p>
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
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      <span className="text-[11px] font-medium text-muted-foreground">继续追问：</span>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className="cursor-pointer rounded-full border border-solid border-border/85 bg-secondary/45 px-2.5 py-1 font-sans text-[11px] font-medium text-foreground transition-colors hover:border-signal/40 hover:bg-signal/8 hover:text-signal outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
    model: "Matt Pro · 200K",
    timestamp: "刚刚",
    content: `已收到「${prompt}」，正在基于 @matt-ui/tokens 与 Base UI 无障碍规范为你生成完整方案。`,
  },
];

const UserBubble = ({ content }: { content: string }) => (
  <div className="flex justify-end">
    <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-signal px-3.5 py-2.5 text-xs leading-relaxed text-signal-foreground shadow-sm">
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
        "flex w-full max-w-xl flex-col gap-3 rounded-[22px] border border-solid border-border/90 bg-card p-4 text-card-foreground shadow-md",
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
