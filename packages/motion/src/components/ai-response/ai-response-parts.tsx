"use client";

/**
 * AiResponse 内部视觉子部件：状态光珠、工具折叠抽屉、参考来源折叠列表与操作按钮栏。
 */
import { cn } from "@matt-ui/utils";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Loader2,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { copyTextToClipboard, hostOf, isExternalHref, safeHref } from "./ai-response-safe.js";
import type { AiResponseSource, AiResponseStatus, AiResponseTool } from "./ai-response.types.js";

const RESPONSE_SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.8 } as const;
const ACTION_BTN_CLASS =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

export const ResponseStatusDot = ({ status }: { status: AiResponseStatus }) => {
  const active = status === "generating" || status === "streaming";
  if (status === "error") {
    return <AlertCircle aria-hidden="true" className="size-3.5 text-destructive" />;
  }
  return (
    <span className="relative flex size-2.5 items-center justify-center">
      {active && (
        <span className="absolute inset-0 animate-ping rounded-full bg-signal/45 motion-reduce:hidden" />
      )}
      <span
        className={cn("relative size-2 rounded-full", active ? "bg-signal" : "bg-foreground/75")}
      />
    </span>
  );
};

export const ResponseGeneratingSkeleton = ({ label }: { label: string }) => (
  <div className="space-y-2.5 py-1" aria-busy="true">
    <div className="h-3 w-3/4 animate-pulse rounded-full bg-secondary" />
    <div className="h-3 w-1/2 animate-pulse rounded-full bg-secondary" />
    <p className="m-0 pt-1 text-xs text-muted-foreground">{label}</p>
  </div>
);

const ToolStatusGlyph = ({ status }: { status: AiResponseTool["status"] }) => {
  if (status === "running")
    return <Loader2 className="size-3.5 shrink-0 animate-spin text-foreground" />;
  if (status === "error") return <AlertCircle className="size-3.5 shrink-0 text-destructive" />;
  return <Check className="size-3.5 shrink-0 text-foreground" />;
};

const ToolListRow = ({ tool }: { tool: AiResponseTool }) => (
  <li className="flex items-center justify-between gap-3 rounded-xl border border-solid border-border/75 bg-secondary/35 px-3 py-2 text-xs">
    <div className="flex min-w-0 items-center gap-2">
      <ToolStatusGlyph status={tool.status} />
      <span className="truncate font-mono text-[12px] text-foreground">{tool.name}</span>
      {tool.detail && <span className="truncate text-muted-foreground">· {tool.detail}</span>}
    </div>
    {tool.duration && (
      <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
        {tool.duration}
      </span>
    )}
  </li>
);

export const ResponseToolsPanel = ({
  tools,
  className,
}: {
  tools: AiResponseTool[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  if (tools.length === 0) return null;

  return (
    <div className={cn("mt-3", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-solid border-border/80 bg-secondary/50 px-2.5 py-1 font-sans text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Wrench aria-hidden="true" className="size-3" />
        <span className="tabular-nums">已调用 {tools.length} 项工具</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3 transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={reduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0 } : RESPONSE_SPRING}
            className="m-0 mt-2 list-none space-y-1.5 overflow-hidden p-0"
          >
            {tools.map((tool) => (
              <ToolListRow key={tool.id} tool={tool} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const SourceCardRow = ({
  source,
  cleaned,
  index,
}: {
  source: AiResponseSource;
  cleaned: string;
  index: number;
}) => {
  const external = isExternalHref(cleaned);
  return (
    <li>
      <a
        href={cleaned}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group flex flex-col gap-1 rounded-xl border border-solid border-border/75 bg-secondary/35 p-2.5 text-left no-underline transition-colors hover:border-foreground/20 hover:bg-secondary/60 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-foreground">
            <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[10px] text-muted-foreground">
              {index + 1}
            </span>
            <span className="truncate">{source.title}</span>
          </span>
          <ExternalLink
            aria-hidden="true"
            className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </div>
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {hostOf(cleaned)}
        </span>
      </a>
    </li>
  );
};

export const ResponseSourcesPanel = ({
  sources,
  className,
}: {
  sources: AiResponseSource[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const validSources = sources
    .map((src) => ({ source: src, cleaned: safeHref(src.url) }))
    .filter((item): item is { source: AiResponseSource; cleaned: string } => Boolean(item.cleaned));

  if (validSources.length === 0) return null;

  return (
    <div className={cn("mt-3 border-t border-solid border-border/70 pt-3", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-xs font-medium text-muted-foreground transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="tabular-nums">参考来源（{validSources.length}）</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ol
            initial={reduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0 } : RESPONSE_SPRING}
            className="m-0 mt-2.5 grid list-none gap-2 overflow-hidden p-0 sm:grid-cols-2"
          >
            {validSources.map((item, index) => (
              <SourceCardRow
                key={item.source.id}
                source={item.source}
                cleaned={item.cleaned}
                index={index}
              />
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeedbackButtons = ({
  vote,
  onVote,
}: {
  vote: "up" | "down" | null;
  onVote: (next: "up" | "down") => void;
}) => (
  <>
    <button
      type="button"
      onClick={() => onVote("up")}
      aria-label="有帮助"
      aria-pressed={vote === "up"}
      className={cn(ACTION_BTN_CLASS, vote === "up" && "bg-secondary text-foreground")}
    >
      <ThumbsUp className="size-3.5" />
    </button>
    <button
      type="button"
      onClick={() => onVote("down")}
      aria-label="需改进"
      aria-pressed={vote === "down"}
      className={cn(ACTION_BTN_CLASS, vote === "down" && "bg-secondary text-foreground")}
    >
      <ThumbsDown className="size-3.5" />
    </button>
  </>
);

export const ResponseActionBar = ({
  content,
  onRegenerate,
  onFeedback,
  onCopy,
  className,
}: {
  content: string;
  onRegenerate?: () => void;
  onFeedback?: (type: "up" | "down") => void;
  onCopy?: (content: string) => void;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(content);
    if (!ok) return;
    setCopied(true);
    onCopy?.(content);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleVote = (next: "up" | "down") => {
    setVote(next);
    onFeedback?.(next);
  };

  return (
    <div className={cn("mt-3 flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="复制回复内容"
        className={ACTION_BTN_CLASS}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          aria-label="重新生成"
          className={ACTION_BTN_CLASS}
        >
          <RotateCcw className="size-3.5" />
        </button>
      )}
      {onFeedback && <FeedbackButtons vote={vote} onVote={handleVote} />}
    </div>
  );
};
