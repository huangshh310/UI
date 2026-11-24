"use client";

/**
 * AiChatThread 复刻 HextaUI Chat Thread 的富媒体子部件：
 * 模型分隔线、天空蓝微球思考折叠轨、联网检索摘要、行内来源微胶囊、圆角对比表、右侧刻度轨与悬浮追问输入条。
 */
import { cn } from "@matt-ui/utils";
import { ArrowUp, ChevronDown, ChevronUp, Globe, Lightbulb, Mic, Plus, Square } from "lucide-react";
import { useState, type FormEvent } from "react";
import type {
  AiChatCitation,
  AiChatTable,
  AiChatThinking,
  AiChatWebSearch,
} from "./ai-chat-thread.types.js";

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

export const ChatDivider = ({ label }: { label: string }) => (
  <div className="my-1 flex items-center gap-3 text-[11px] text-muted-foreground">
    <span aria-hidden="true" className="h-px flex-1 bg-border/80 dark:bg-white/[0.08]" />
    <span className="shrink-0">{label}</span>
    <span aria-hidden="true" className="h-px flex-1 bg-border/80 dark:bg-white/[0.08]" />
  </div>
);

export const ChatThinkingTrace = ({ thinking }: { thinking: AiChatThinking }) => {
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

export const ChatWebSearchRow = ({ search }: { search: AiChatWebSearch }) => (
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

export const ChatCitationsRow = ({ citations }: { citations: AiChatCitation[] }) => (
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

export const ChatComparisonTable = ({ table }: { table: AiChatTable }) => (
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

export const ChatCheckpointsRail = ({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) => {
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

export const ChatFollowUpComposer = (p: ComposerProps) => {
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
