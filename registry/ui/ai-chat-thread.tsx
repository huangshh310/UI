// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiChatThread：对标 HextaUI Chat Thread 的极简 AI 对话消息流，
 * 支持模型切换分隔线、可折叠思考轨迹、联网搜索摘要、行内来源微胶囊、对比表、多版本分支切换与悬浮追问输入条。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Globe,
  Lightbulb,
  Mic,
  Plus,
  RefreshCw,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

export const chatThreadVariants = cva("relative flex w-full flex-col text-card-foreground", {
  variants: {
    variant: {
      card: "gap-5 rounded-2xl border border-solid border-border bg-card p-5 shadow-xs dark:border-white/10",
      seamless: "gap-5 bg-transparent p-0",
      compact:
        "gap-3.5 rounded-2xl border border-solid border-border bg-card p-4 shadow-xs dark:border-white/10",
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
    divider: "已切换至 Nova 3 Max",
    content: "搜索框应该用防抖（debounce）还是节流（throttle）？",
    timestamp: "09:41",
  },
  {
    id: "m2",
    role: "assistant",
    model: "Nova 3 Max · High",
    timestamp: "09:41",
    meta: "1.4s · 164 tok",
    thinking: {
      duration: "3s",
      defaultOpen: true,
      steps: [
        {
          title: "对比两者触发时机",
          detail: "两者都能控制搜索请求频率，但触发节点截然不同。",
        },
        {
          title: "确认搜索框的核心诉求",
          detail: "用户停止输入后的最终关键词才是真正需要查询的值。",
        },
      ],
    },
    webSearch: {
      query: "debounce vs throttle search input",
      resultsCount: 3,
      duration: "1.4s",
    },
    content:
      "搜索场景优先使用防抖（debounce）。用户连续键入时只在停顿后发起一次查询；而节流（throttle）按固定周期触发，更适合滚动监听与窗口缩放。同时保持输入框本身即时响应，仅延迟背后的网络请求。",
    citations: [
      { monogram: "M", label: "MDN" },
      { monogram: "C", label: "CSS-Tricks" },
      { monogram: "W", label: "web.dev" },
    ],
    table: {
      headers: ["", "Debounce", "Throttle"],
      rows: [
        ["触发方式", "停顿后执行一次", "活跃期间每 n ms 执行"],
        ["输入 “react” 请求数", "1", "2–3"],
        ["最佳场景", "搜索、自动保存、校验", "滚动、缩放、拖拽"],
      ],
    },
    variants: [
      "搜索场景优先使用防抖（debounce）。用户连续键入时只在停顿后发起一次查询；而节流（throttle）按固定周期触发，更适合滚动监听与窗口缩放。同时保持输入框本身即时响应，仅延迟背后的网络请求。",
      "若希望输入体验更丝滑，推荐 250ms 防抖配合 AbortController 取消过期请求，既省流量又避免乱序回包覆盖最新结果。",
    ],
  },
];

export const CHAT_DEFAULT_FOLLOWUPS = ["加上第二天行程", "如何取消进行中的请求？"];
export type AiChatThreadVariant = "card" | "seamless" | "compact";

export interface AiChatThinkingStep {
  title: string;
  detail: string;
}

export interface AiChatThinking {
  duration: string;
  defaultOpen?: boolean;
  steps: AiChatThinkingStep[];
}

export interface AiChatWebSearch {
  query: string;
  resultsCount: number;
  duration: string;
}

export interface AiChatCitation {
  monogram: string;
  label: string;
  href?: string;
}

export interface AiChatTable {
  headers: string[];
  rows: string[][];
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** 消息上方居中水平分隔提示（如 "已切换至 Nova 3 Max" / "今天"） */
  divider?: string;
  /** 可折叠思考轨迹（对标 HextaUI Thought for 3s 竖向时间轴） */
  thinking?: AiChatThinking;
  /** 联网搜索摘要行 */
  webSearch?: AiChatWebSearch;
  /** 行内来源徽标胶囊（如 M MDN / C CSS-Tricks） */
  citations?: AiChatCitation[];
  /** 内嵌结构化对比表格 */
  table?: AiChatTable;
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
  /** 是否显示 HextaUI 风格的底部悬浮追问输入条，默认 true */
  showComposer?: boolean;
  /** 底部输入条占位提示，默认 "继续追问…" */
  composerPlaceholder?: string;
  /** 底栏展示的当前模型名称，默认 "Nova 3" */
  modelName?: string;
  /** 底栏展示的思考深度标签，默认 "Medium" */
  effortLabel?: string;
  /** 底栏环形上下文窗口占用百分比（0–100），默认 7 */
  contextUsage?: number;
  /** 是否在右侧边缘显示对话轮次 Checkpoints 导航刻度，默认 true */
  showCheckpoints?: boolean;
  /** 复制消息回调 */
  onCopy?: (content: string) => void;
  /** 点赞或点踩反馈回调 */
  onFeedback?: (messageId: string, vote: "up" | "down") => void;
  /** 点击追问建议或提交输入框回调 */
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
const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

/** 对标 HextaUI 的 14px 天空蓝渐变迷你思考球 */
const MiniSkyOrb = () => (
  <span
    aria-hidden="true"
    className="inline-block size-3.5 shrink-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]"
    style={{
      background: "radial-gradient(circle at 35% 28%, #e0f2fe 0%, #60a5fa 48%, #2563eb 100%)",
    }}
  />
);

const ChatDivider = ({ label }: { label: string }) => (
  <div className="my-1 flex items-center gap-3 text-[11px] text-muted-foreground">
    <span aria-hidden="true" className="h-px flex-1 bg-border/80 dark:bg-white/[0.08]" />
    <span className="shrink-0">{label}</span>
    <span aria-hidden="true" className="h-px flex-1 bg-border/80 dark:bg-white/[0.08]" />
  </div>
);

const ChatThinkingTrace = ({ thinking }: { thinking: AiChatThinking }) => {
  const [open, setOpen] = useState(thinking.defaultOpen ?? false);
  return (
    <div data-slot="ai-chat-thinking" className="mb-3 flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-solid border-transparent py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
          FOCUS_RING,
        )}
      >
        <MiniSkyOrb />
        <span>已思考 {thinking.duration}</span>
        {open ? (
          <ChevronUp aria-hidden="true" className="size-3.5" />
        ) : (
          <ChevronDown aria-hidden="true" className="size-3.5" />
        )}
      </button>

      {open && (
        <div className="mt-2 ml-1.5 flex flex-col gap-3 border-l border-solid border-border/85 pl-4 dark:border-white/10">
          {thinking.steps.map((step) => (
            <div key={step.title} className="relative flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Lightbulb aria-hidden="true" className="size-3.5 shrink-0 opacity-75" />
                <span>{step.title}</span>
              </div>
              <p className="m-0 pl-5 text-xs leading-relaxed text-foreground/85">{step.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ChatWebSearchRow = ({ search }: { search: AiChatWebSearch }) => (
  <div
    data-slot="ai-chat-web-search"
    className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"
  >
    <span className="inline-flex items-center gap-2">
      <Globe aria-hidden="true" className="size-3.5 shrink-0 opacity-80" />
      <span>
        已联网检索 <span className="text-foreground/80">“{search.query}”</span>
      </span>
    </span>
    <span className="font-mono text-[11px] tabular-nums">
      {search.resultsCount} 条结果 · {search.duration}
    </span>
  </div>
);

const ChatCitationsRow = ({ citations }: { citations: AiChatCitation[] }) => (
  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
    {citations.map((item) => {
      const inner = (
        <>
          <span
            aria-hidden="true"
            className="inline-flex size-4 items-center justify-center rounded-full bg-background font-mono text-[9.5px] font-semibold text-foreground/75 dark:bg-white/10"
          >
            {item.monogram}
          </span>
          <span>{item.label}</span>
        </>
      );
      const cls =
        "inline-flex h-6 items-center gap-1.5 rounded-full border border-solid border-border/80 bg-muted/75 pr-2.5 pl-1 text-[11px] font-medium text-foreground/80 transition-colors hover:bg-muted dark:border-white/10 dark:bg-white/[0.06]";
      return item.href ? (
        <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <span key={item.label} className={cls}>
          {inner}
        </span>
      );
    })}
  </div>
);

const ChatComparisonTable = ({ table }: { table: AiChatTable }) => (
  <div className="mt-3 overflow-hidden rounded-xl border border-solid border-border bg-card dark:border-white/10">
    <table className="w-full border-collapse text-left text-xs">
      <thead>
        <tr className="border-b border-solid border-border bg-muted/45 dark:border-white/10 dark:bg-white/[0.03]">
          {table.headers.map((header, idx) => (
            <th key={idx} scope="col" className="px-3.5 py-2 font-medium text-foreground">
              {header || <span className="sr-only">对比项</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, rIdx) => (
          <tr
            key={rIdx}
            className="border-b border-solid border-border/70 last:border-b-0 dark:border-white/[0.07]"
          >
            {row.map((cell, cIdx) => (
              <td
                key={cIdx}
                className={cn(
                  "px-3.5 py-2.5",
                  cIdx === 0 ? "font-medium text-foreground/85" : "text-foreground/80",
                )}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ChatCheckpointsRail = ({ count, activeIndex }: { count: number; activeIndex: number }) => {
  if (count <= 0) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 flex-col items-end gap-1.5 sm:flex"
    >
      {Array.from({ length: count }, (_, idx) => {
        const active = idx === activeIndex;
        return (
          <span
            key={idx}
            className={cn(
              "h-[2px] rounded-full transition-all",
              active ? "w-3.5 bg-foreground" : "w-2 bg-foreground/20 dark:bg-white/20",
            )}
          />
        );
      })}
    </div>
  );
};

const ComposerFooterBar = ({
  modelName,
  effortLabel,
  contextUsage,
}: {
  modelName: string;
  effortLabel: string;
  contextUsage: number;
}) => {
  const pct = Math.min(100, Math.max(0, contextUsage));
  const dash = 2 * Math.PI * 5.5;
  const offset = dash * (1 - pct / 100);
  return (
    <div className="flex items-center justify-end gap-2 px-1 text-[11px] text-muted-foreground">
      <span className="font-medium text-foreground/80">{modelName}</span>
      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10.5px] font-medium text-foreground/80 dark:bg-white/[0.07]">
        {effortLabel}
      </span>
      <span title={`上下文已占用 ${pct}%`} className="inline-flex">
        <span className="sr-only">上下文已占用 {pct}%</span>
        <svg aria-hidden="true" viewBox="0 0 14 14" className="size-3.5 -rotate-90">
          <circle
            cx="7"
            cy="7"
            r="5.5"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="1.5"
          />
          <circle
            cx="7"
            cy="7"
            r="5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray={dash}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
};

const ComposerSubmitButton = ({
  streaming,
  disabled,
}: {
  streaming: boolean;
  disabled: boolean;
}) => (
  <button
    type="submit"
    disabled={disabled}
    aria-label={streaming ? "停止生成" : "发送追问"}
    className={cn(
      "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-transparent bg-foreground text-background transition-opacity disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
      FOCUS_RING,
    )}
  >
    {streaming ? (
      <Square aria-hidden="true" className="size-2.5 fill-current" />
    ) : (
      <ArrowUp aria-hidden="true" className="size-3.5" />
    )}
  </button>
);

interface ComposerProps {
  placeholder: string;
  streaming: boolean;
  modelName: string;
  effortLabel: string;
  contextUsage: number;
  onSubmit: (value: string) => void;
}

const ChatFollowUpComposer = (p: ComposerProps) => {
  const [draft, setDraft] = useState("");
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    p.onSubmit(trimmed);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-2 pt-1">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-solid border-border bg-card py-1.5 pr-1.5 pl-3 shadow-xs transition-colors focus-within:border-foreground/25 dark:border-white/12 dark:bg-white/[0.03]"
      >
        <span
          aria-hidden="true"
          className="inline-flex size-6 shrink-0 items-center justify-center text-muted-foreground"
        >
          <Plus className="size-3.5" />
        </span>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={p.placeholder}
          aria-label={p.placeholder}
          className="h-7 min-w-0 flex-1 border-0 bg-transparent font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none"
        />
        <span
          aria-hidden="true"
          className="inline-flex size-7 shrink-0 items-center justify-center text-muted-foreground"
        >
          <Mic className="size-3.5" />
        </span>
        <ComposerSubmitButton streaming={p.streaming} disabled={!p.streaming && !draft.trim()} />
      </form>
      <ComposerFooterBar
        modelName={p.modelName}
        effortLabel={p.effortLabel}
        contextUsage={p.contextUsage}
      />
    </div>
  );
};
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
