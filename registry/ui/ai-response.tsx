// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiResponse：流式 AI 回复容器，内置零 innerHTML 的安全 Markdown 渲染、卡片/无框/毛玻璃变体、工具摘要、参考来源与反馈操作栏。
 */

import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, useContext, useState } from "react";

export const AI_RESPONSE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const AI_RESPONSE_COLLAPSE_TRANSITION = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const AI_RESPONSE_ACTION_BTN = `inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border border-solid border-transparent bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted hover:text-foreground dark:hover:bg-white/[0.08] ${AI_RESPONSE_FOCUS_RING}`;

export const AI_RESPONSE_TRIGGER_BTN = `inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-solid border-transparent bg-transparent px-2 py-1 font-sans text-xs font-medium text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted/70 hover:text-foreground dark:hover:bg-white/[0.06] ${AI_RESPONSE_FOCUS_RING}`;

export const AI_RESPONSE_SHELL_VARIANT: Record<AiResponseVariant, string> = {
  card: "rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10",
  ghost: "border-0 bg-transparent",
  glass:
    "rounded-xl border border-solid border-border bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/85",
};

export const AI_RESPONSE_SHELL_PADDING: Record<AiResponseSize, string> = {
  sm: "p-4",
  md: "p-5",
};
export type AiResponseStatus = "idle" | "generating" | "streaming" | "complete" | "error";

export type AiResponseVariant = "card" | "ghost" | "glass";

export type AiResponseSize = "sm" | "md";

export interface AiResponseSource {
  id: string;
  title: string;
  url: string;
  snippet?: string;
}

export interface AiResponseTool {
  id: string;
  name: string;
  status: "running" | "complete" | "error";
  duration?: string;
  detail?: string;
}

export interface AiResponseProps {
  /** 流式或完整 Markdown 回复内容 */
  content: string;
  /** 当前生成状态 */
  status?: AiResponseStatus;
  /** 外观变体：card 发丝卡片、ghost 无框流式画布、glass 毛玻璃卡片，默认 card */
  variant?: AiResponseVariant;
  /** 容器内边距密度，默认 md */
  size?: AiResponseSize;
  /** 显示在顶部的模型或助手名称 */
  model?: string;
  /** 可选模型等宽微徽章（如 "200K" / "深度推理"） */
  modelBadge?: string;
  /** 可选耗时或时间戳（如 "1.4s" / "14:25"） */
  timestamp?: string;
  /** 生成过程中的状态提示文案 */
  statusLabel?: string;
  /** 本次回复用到的工具列表 */
  tools?: AiResponseTool[];
  /** 是否默认展开工具调用明细，默认 false */
  defaultToolsOpen?: boolean;
  /** 本次回复引用的参考来源 */
  sources?: AiResponseSource[];
  /** 是否默认展开参考来源卡片，默认 false */
  defaultSourcesOpen?: boolean;
  /** 错误态时的报错文案 */
  errorMessage?: string;
  /** 触发重新生成 */
  onRegenerate?: () => void;
  /** 触发反馈（点赞 / 点踩） */
  onFeedback?: (type: "up" | "down") => void;
  /** 复制正文后的回调 */
  onCopy?: (content: string) => void;
  /** 自定义容器样式 */
  className?: string;
  /** 自定义子部件组合；留空时渲染标准完整版式 */
  children?: ReactNode;
}

export interface AiResponseHeaderProps {
  /** 覆盖模型名称 */
  model?: string;
  /** 覆盖模型等宽微徽章 */
  modelBadge?: string;
  /** 覆盖时间戳 */
  timestamp?: string;
  /** 自定义状态提示 */
  statusLabel?: string;
  className?: string;
}

export interface AiResponseContentProps {
  className?: string;
}

export interface AiResponseToolsSummaryProps {
  className?: string;
}

export interface AiResponseSourcesProps {
  className?: string;
}

export interface AiResponseActionsProps {
  className?: string;
}
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
      className={cn(
        AI_RESPONSE_ACTION_BTN,
        vote === "up" &&
          "border-border/70 bg-secondary text-foreground dark:border-white/10 dark:bg-white/12",
      )}
    >
      <ThumbsUp className="size-3.5" />
    </button>
    <button
      type="button"
      onClick={() => onVote("down")}
      aria-label="需改进"
      aria-pressed={vote === "down"}
      className={cn(
        AI_RESPONSE_ACTION_BTN,
        vote === "down" &&
          "border-border/70 bg-secondary text-foreground dark:border-white/10 dark:bg-white/12",
      )}
    >
      <ThumbsDown className="size-3.5" />
    </button>
  </>
);

const ResponseActionBar = ({
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
        className={AI_RESPONSE_ACTION_BTN}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          aria-label="重新生成"
          className={AI_RESPONSE_ACTION_BTN}
        >
          <RotateCcw className="size-3.5" />
        </button>
      )}
      {onFeedback && <FeedbackButtons vote={vote} onVote={handleVote} />}
    </div>
  );
};
const INLINE_RE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*\n]+\*)/g;

const HEADING_CLASSES = [
  "mt-6 mb-2.5 text-lg font-semibold tracking-tight text-foreground first:mt-0",
  "mt-5 mb-2 text-[15px] font-semibold tracking-tight text-foreground first:mt-0",
  "mt-4 mb-1.5 text-sm font-semibold tracking-tight text-foreground first:mt-0",
];

const renderLinkToken = (token: string, key: string): ReactNode => {
  const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (!match) return token;
  const label = match[1] ?? "";
  const cleaned = safeHref(match[2] ?? "");
  if (!cleaned) return <span key={key}>{label}</span>;
  const external = isExternalHref(cleaned);
  return (
    <a
      key={key}
      href={cleaned}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
    >
      {label}
    </a>
  );
};

const renderInline = (text: string, prefix: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let idx = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const start = match.index ?? 0;
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));
    const token = match[0];
    const key = `${prefix}-${idx++}`;
    if (token.startsWith("`")) {
      parts.push(
        <code
          key={key}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground dark:bg-white/[0.08]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      parts.push(
        <strong key={key} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("[")) {
      parts.push(renderLinkToken(token, key));
    } else {
      parts.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    lastIndex = start + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
};

const MarkdownCodeBlock = ({ lang, code }: { lang: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(code);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="my-3.5 overflow-hidden rounded-xl bg-muted/55">
      <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1">
        <span className="font-mono text-[11px] text-muted-foreground">{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="复制代码块"
          className={`inline-flex size-6 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${AI_RESPONSE_FOCUS_RING}`}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <pre
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="m-0 overflow-x-auto px-3.5 pt-1 pb-3 font-mono text-[12.5px] leading-relaxed text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

const MarkdownTableBlock = ({
  headers,
  rows,
  index,
}: {
  headers: string[];
  rows: string[][];
  index: number;
}) => (
  <div className="my-3.5 overflow-x-auto rounded-lg border border-solid border-border dark:border-white/10">
    <table className="w-full border-collapse text-left text-xs">
      <thead>
        <tr className="border-b border-solid border-border/80 bg-muted/60 dark:border-white/10 dark:bg-white/[0.05]">
          {headers.map((h, hi) => (
            <th key={hi} className="px-3 py-2 font-medium text-foreground">
              {renderInline(h, `th-${index}-${hi}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr
            key={ri}
            className="border-b border-solid border-border/60 last:border-b-0 dark:border-white/10"
          >
            {row.map((cell, ci) => (
              <td key={ci} className="px-3 py-2 text-muted-foreground">
                {renderInline(cell, `td-${index}-${ri}-${ci}`)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MarkdownListBlock = ({
  ordered,
  items,
  index,
  caret,
}: {
  ordered: boolean;
  items: string[];
  index: number;
  caret: ReactNode;
}) => {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <ListTag
      className={`my-2.5 space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 ${
        ordered ? "list-decimal" : "list-disc"
      }`}
    >
      {items.map((item, j) => (
        <li key={j}>
          {renderInline(item, `l-${index}-${j}`)}
          {j === items.length - 1 ? caret : null}
        </li>
      ))}
    </ListTag>
  );
};

const StreamingCaret = () => (
  <span
    aria-hidden="true"
    className="ml-0.5 inline-block h-[1em] w-[1.5px] animate-pulse rounded-full bg-signal align-[-0.12em] motion-reduce:animate-none"
  />
);

const MarkdownQuoteBlock = ({
  text,
  index,
  caret,
}: {
  text: string;
  index: number;
  caret: ReactNode;
}) => (
  <blockquote className="my-3 border-l-2 border-solid border-border pl-3.5 text-[13px] leading-relaxed text-muted-foreground dark:border-white/20">
    {renderInline(text, `q-${index}`)}
    {caret}
  </blockquote>
);

const renderBlock = (block: MarkdownBlock, index: number, showCaret: boolean): ReactNode => {
  const caret = showCaret ? <StreamingCaret /> : null;
  if (block.type === "code") {
    return <MarkdownCodeBlock key={index} lang={block.lang} code={block.code} />;
  }
  if (block.type === "hr") {
    return (
      <hr
        key={index}
        className="my-4 border-0 border-t border-solid border-border/80 dark:border-white/10"
      />
    );
  }
  if (block.type === "heading") {
    return (
      <p key={index} className={HEADING_CLASSES[block.level - 1] ?? HEADING_CLASSES[2]}>
        {renderInline(block.text, `h-${index}`)}
        {caret}
      </p>
    );
  }
  if (block.type === "quote") {
    return <MarkdownQuoteBlock key={index} text={block.text} index={index} caret={caret} />;
  }
  if (block.type === "list") {
    return (
      <MarkdownListBlock
        key={index}
        ordered={block.ordered}
        items={block.items}
        index={index}
        caret={caret}
      />
    );
  }
  if (block.type === "table") {
    return (
      <MarkdownTableBlock key={index} headers={block.headers} rows={block.rows} index={index} />
    );
  }
  return (
    <p key={index} className="my-2.5 text-sm leading-[1.7] text-foreground/90 first:mt-0 last:mb-0">
      {renderInline(block.text, `p-${index}`)}
      {caret}
    </p>
  );
};

const MarkdownStreamView = ({ content, streaming }: { content: string; streaming: boolean }) => {
  const blocks = parseMarkdownBlocks(content);
  return (
    <div data-slot="ai-response-markdown">
      {blocks.map((block, index) =>
        renderBlock(block, index, streaming && index === blocks.length - 1),
      )}
    </div>
  );
};
type MarkdownBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "quote"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" }
  | { type: "paragraph"; text: string };

const parseTableCells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

const isTableDivider = (line: string) => /^\|?[\s:-]+\|[\s|:-]*$/.test(line.trim());

const consumeCodeBlock = (lines: string[], start: number) => {
  const lang = lines[start]!.trim().slice(3).trim();
  const body: string[] = [];
  let i = start + 1;
  while (i < lines.length && !lines[i]!.trim().startsWith("```")) {
    body.push(lines[i]!);
    i++;
  }
  return {
    block: { type: "code", lang, code: body.join("\n") } as MarkdownBlock,
    next: i < lines.length ? i + 1 : i,
  };
};

const consumeList = (lines: string[], start: number, ordered: boolean) => {
  const pattern = ordered ? /^\d+\.\s+(.*)$/ : /^[-*]\s+(.*)$/;
  const items: string[] = [];
  let i = start;
  while (i < lines.length) {
    const match = lines[i]!.trim().match(pattern);
    if (!match) break;
    items.push(match[1] ?? "");
    i++;
  }
  return { block: { type: "list", ordered, items } as MarkdownBlock, next: i };
};

const consumeTable = (lines: string[], start: number) => {
  const headers = parseTableCells(lines[start]!);
  const rows: string[][] = [];
  let i = start + 2;
  while (i < lines.length && lines[i]!.includes("|") && lines[i]!.trim().length > 0) {
    rows.push(parseTableCells(lines[i]!));
    i++;
  }
  return { block: { type: "table", headers, rows } as MarkdownBlock, next: i };
};

const isBlockBoundary = (line: string, nextLine?: string) => {
  const t = line.trim();
  if (!t) return true;
  if (t.startsWith("```") || /^#{1,3}\s+/.test(t) || t.startsWith("> ")) return true;
  if (/^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t) || /^---+$/.test(t)) return true;
  return Boolean(t.includes("|") && nextLine && isTableDivider(nextLine));
};

const consumeParagraph = (lines: string[], start: number) => {
  const para: string[] = [lines[start]!];
  let i = start + 1;
  while (i < lines.length && !isBlockBoundary(lines[i]!, lines[i + 1])) {
    para.push(lines[i]!);
    i++;
  }
  return { block: { type: "paragraph", text: para.join(" ").trim() } as MarkdownBlock, next: i };
};

const parseBlockAt = (lines: string[], i: number): { block: MarkdownBlock; next: number } => {
  const trimmed = lines[i]!.trim();
  if (trimmed.startsWith("```")) return consumeCodeBlock(lines, i);
  if (/^---+$/.test(trimmed)) return { block: { type: "hr" }, next: i + 1 };
  const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
  if (heading) {
    return {
      block: { type: "heading", level: heading[1]!.length, text: heading[2]! },
      next: i + 1,
    };
  }
  if (trimmed.startsWith("> "))
    return { block: { type: "quote", text: trimmed.slice(2) }, next: i + 1 };
  if (/^[-*]\s+/.test(trimmed)) return consumeList(lines, i, false);
  if (/^\d+\.\s+/.test(trimmed)) return consumeList(lines, i, true);
  if (trimmed.includes("|") && lines[i + 1] && isTableDivider(lines[i + 1]!)) {
    return consumeTable(lines, i);
  }
  return consumeParagraph(lines, i);
};

const parseMarkdownBlocks = (content: string): MarkdownBlock[] => {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    if (!lines[i]!.trim()) {
      i++;
      continue;
    }
    const res = parseBlockAt(lines, i);
    blocks.push(res.block);
    i = res.next;
  }
  return blocks;
};
const ResponseStatusDot = ({ status }: { status: AiResponseStatus }) => {
  if (status === "error") {
    return <AlertCircle aria-hidden="true" className="size-3.5 shrink-0 text-destructive" />;
  }
  if (status === "generating" || status === "streaming") {
    return (
      <Loader2
        aria-hidden="true"
        className="size-3.5 shrink-0 animate-spin text-signal motion-reduce:animate-none"
      />
    );
  }
  return (
    <span aria-hidden="true" className="inline-flex size-3.5 shrink-0 items-center justify-center">
      <span className="size-1.5 rounded-full bg-muted-foreground/55 dark:bg-white/35" />
    </span>
  );
};

const ResponseGeneratingSkeleton = ({ label }: { label: string }) => (
  <div className="space-y-2.5 py-1" aria-busy="true">
    <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-muted dark:bg-white/10" />
    <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-muted dark:bg-white/10" />
    <p className="m-0 pt-1 text-xs text-muted-foreground">{label}</p>
  </div>
);

const ToolStatusGlyph = ({ status }: { status: AiResponseTool["status"] }) => {
  if (status === "running") {
    return (
      <Loader2 className="size-3.5 shrink-0 animate-spin text-signal motion-reduce:animate-none" />
    );
  }
  if (status === "error") return <AlertCircle className="size-3.5 shrink-0 text-destructive" />;
  return <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />;
};

const ToolListRow = ({ tool }: { tool: AiResponseTool }) => (
  <li
    className={cn(
      "flex items-center justify-between gap-3 rounded-lg border border-solid px-3 py-2 text-xs",
      tool.status === "error"
        ? "border-destructive/35 bg-destructive/[0.06] dark:border-destructive/50 dark:bg-destructive/12"
        : "border-border/80 bg-muted/35 dark:border-white/10 dark:bg-white/[0.03]",
    )}
  >
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

const ResponseToolsPanel = ({
  tools,
  defaultOpen = false,
  className,
}: {
  tools: AiResponseTool[];
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();
  if (tools.length === 0) return null;

  return (
    <div className={cn("mt-3", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn("-ml-2", AI_RESPONSE_TRIGGER_BTN)}
      >
        <Wrench aria-hidden="true" className="size-3.5 text-muted-foreground/80" />
        <span className="tabular-nums">已调用 {tools.length} 项工具</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 transition-transform duration-(--ui-duration-fast)",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0 } : AI_RESPONSE_COLLAPSE_TRANSITION}
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
        className={cn(
          "group flex flex-col gap-1 rounded-lg border border-solid border-border/80 bg-muted/30 p-2.5 text-left no-underline transition-colors hover:border-foreground/20 hover:bg-muted/60 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.06]",
          AI_RESPONSE_FOCUS_RING,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-foreground">
            <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-[10px] text-muted-foreground dark:bg-white/10">
              {index + 1}
            </span>
            <span className="truncate">{source.title}</span>
          </span>
          <ExternalLink
            aria-hidden="true"
            className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </div>
        {source.snippet && (
          <p className="m-0 line-clamp-1 text-[11px] text-muted-foreground">{source.snippet}</p>
        )}
        <span className="truncate font-mono text-[10px] text-muted-foreground">
          {hostOf(cleaned)}
        </span>
      </a>
    </li>
  );
};

const SourcesAnimatedList = ({
  open,
  reduced,
  items,
}: {
  open: boolean;
  reduced: boolean | null;
  items: { source: AiResponseSource; cleaned: string }[];
}) => (
  <AnimatePresence initial={false}>
    {open && (
      <motion.ol
        initial={reduced ? false : { opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
        transition={reduced ? { duration: 0 } : AI_RESPONSE_COLLAPSE_TRANSITION}
        className="m-0 mt-2 grid list-none gap-2 overflow-hidden p-0 sm:grid-cols-2"
      >
        {items.map((item, index) => (
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
);

const ResponseSourcesPanel = ({
  sources,
  defaultOpen = false,
  className,
}: {
  sources: AiResponseSource[];
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();
  const validSources = sources
    .map((src) => ({ source: src, cleaned: safeHref(src.url) }))
    .filter((item): item is { source: AiResponseSource; cleaned: string } => Boolean(item.cleaned));

  if (validSources.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-3 border-t border-solid border-border/75 pt-2.5 dark:border-white/10",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn("-ml-2", AI_RESPONSE_TRIGGER_BTN)}
      >
        <Link2 aria-hidden="true" className="size-3.5 text-muted-foreground/80" />
        <span className="tabular-nums">参考来源（{validSources.length}）</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 transition-transform duration-(--ui-duration-fast)",
            open && "rotate-180",
          )}
        />
      </button>
      <SourcesAnimatedList open={open} reduced={reduced} items={validSources} />
    </div>
  );
};
const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

const hasControlChars = (value: string) => {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 31 || code === 127) return true;
  }
  return false;
};

const isRelativeHref = (value: string) =>
  value.startsWith("#") ||
  (value.startsWith("/") && !value.startsWith("//")) ||
  value.startsWith("./") ||
  value.startsWith("../");

/** 校验并净化 Markdown 链接地址，仅允许 http/https/mailto、页内锚点与站内相对路径 */
const safeHref = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed || hasControlChars(trimmed)) return null;
  if (isRelativeHref(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return null;
    if (parsed.username || parsed.password) return null;
    return parsed.href;
  } catch {
    return null;
  }
};

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

const hostOf = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
};

const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 降级到临时文本域复制
    }
  }
  if (typeof document === "undefined") return false;
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
};
interface AiResponseContextValue {
  content: string;
  status: AiResponseStatus;
  model: string;
  modelBadge?: string;
  timestamp?: string;
  statusLabel?: string;
  tools: AiResponseTool[];
  defaultToolsOpen: boolean;
  sources: AiResponseSource[];
  defaultSourcesOpen: boolean;
  errorMessage?: string;
  onRegenerate?: () => void;
  onFeedback?: (type: "up" | "down") => void;
  onCopy?: (content: string) => void;
}

const ResponseCtx = createContext<AiResponseContextValue | null>(null);

export const useAiResponse = () => {
  const ctx = useContext(ResponseCtx);
  if (!ctx) throw new Error("AiResponse 子部件必须置于 <AiResponse> 内部使用");
  return ctx;
};

const defaultStatusLabel = (status: AiResponseStatus) => {
  if (status === "generating") return "正在构思回复…";
  if (status === "streaming") return "正在生成…";
  if (status === "error") return "生成中断";
  return "";
};

export const AiResponseHeader = ({
  model,
  modelBadge,
  timestamp,
  statusLabel,
  className,
}: AiResponseHeaderProps) => {
  const ctx = useAiResponse();
  const label = statusLabel ?? ctx.statusLabel ?? defaultStatusLabel(ctx.status);
  const badge = modelBadge ?? ctx.modelBadge;
  const time = timestamp ?? ctx.timestamp;

  return (
    <div className={cn("mb-3 flex items-center justify-between gap-2 select-none", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <ResponseStatusDot status={ctx.status} />
        <span className="truncate text-[13px] font-medium tracking-tight text-foreground">
          {model ?? ctx.model}
        </span>
        {badge && (
          <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground dark:bg-white/[0.07]">
            {badge}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
        {label && <span>{label}</span>}
        {time && <span className="font-mono text-[11px] tabular-nums">{time}</span>}
      </div>
    </div>
  );
};

export const AiResponseContent = ({ className }: AiResponseContentProps) => {
  const { content, status, statusLabel, errorMessage, onRegenerate } = useAiResponse();

  if (status === "error") {
    return (
      <div
        role="alert"
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-solid border-destructive/35 bg-destructive/[0.06] px-3.5 py-2.5 text-xs text-foreground dark:border-destructive/50 dark:bg-destructive/12",
          className,
        )}
      >
        <span className="text-destructive">{errorMessage ?? "回复生成失败，请稍后重试。"}</span>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className={cn(
              "h-7 cursor-pointer rounded-lg border border-solid border-destructive/40 bg-transparent px-2.5 font-sans text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 dark:border-destructive/60",
              AI_RESPONSE_FOCUS_RING,
            )}
          >
            重试
          </button>
        )}
      </div>
    );
  }

  if (status === "generating" && !content.trim()) {
    return <ResponseGeneratingSkeleton label={statusLabel ?? defaultStatusLabel("generating")} />;
  }

  return (
    <div className={className} aria-live="polite">
      <MarkdownStreamView content={content} streaming={status === "streaming"} />
    </div>
  );
};

export const AiResponseToolsSummary = ({ className }: AiResponseToolsSummaryProps) => {
  const { tools, defaultToolsOpen } = useAiResponse();
  return <ResponseToolsPanel tools={tools} defaultOpen={defaultToolsOpen} className={className} />;
};

export const AiResponseSources = ({ className }: AiResponseSourcesProps) => {
  const { sources, defaultSourcesOpen } = useAiResponse();
  return (
    <ResponseSourcesPanel
      sources={sources}
      defaultOpen={defaultSourcesOpen}
      className={className}
    />
  );
};

export const AiResponseActions = ({ className }: AiResponseActionsProps) => {
  const { content, status, onRegenerate, onFeedback, onCopy } = useAiResponse();
  if (status === "generating" || status === "streaming" || !content.trim()) return null;
  return (
    <ResponseActionBar
      content={content}
      onRegenerate={onRegenerate}
      onFeedback={onFeedback}
      onCopy={onCopy}
      className={className}
    />
  );
};

const buildResponseContext = (props: AiResponseProps): AiResponseContextValue => ({
  content: props.content,
  status: props.status ?? "complete",
  model: props.model ?? "Assistant",
  modelBadge: props.modelBadge,
  timestamp: props.timestamp,
  statusLabel: props.statusLabel,
  tools: props.tools ?? [],
  defaultToolsOpen: props.defaultToolsOpen ?? false,
  sources: props.sources ?? [],
  defaultSourcesOpen: props.defaultSourcesOpen ?? false,
  errorMessage: props.errorMessage,
  onRegenerate: props.onRegenerate,
  onFeedback: props.onFeedback,
  onCopy: props.onCopy,
});

export const AiResponse = (props: AiResponseProps) => {
  const variant = props.variant ?? "card";
  const size = props.size ?? "md";
  const ctxValue = buildResponseContext(props);

  return (
    <ResponseCtx.Provider value={ctxValue}>
      <article
        data-slot="ai-response"
        data-status={ctxValue.status}
        data-variant={variant}
        className={cn(
          "w-full font-sans text-card-foreground",
          AI_RESPONSE_SHELL_VARIANT[variant],
          variant !== "ghost" && AI_RESPONSE_SHELL_PADDING[size],
          props.className,
        )}
      >
        {props.children ?? (
          <>
            <AiResponseHeader />
            <AiResponseContent />
            <AiResponseToolsSummary />
            <AiResponseSources />
            <AiResponseActions />
          </>
        )}
      </article>
    </ResponseCtx.Provider>
  );
};

export { safeHref };
