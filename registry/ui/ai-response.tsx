// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiResponse：流式 AI 回复容器，内置零 innerHTML 的安全 Markdown 渲染、生成状态头、工具调用折叠摘要、参考来源与反馈操作栏。
 */

import { cn } from "@/lib/utils";
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
import { createContext, type ReactNode, useContext, useState } from "react";

export type AiResponseStatus = "idle" | "generating" | "streaming" | "complete" | "error";

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
  /** 显示在顶部的模型或助手名称 */
  model?: string;
  /** 生成过程中的状态提示文案 */
  statusLabel?: string;
  /** 本次回复用到的工具列表 */
  tools?: AiResponseTool[];
  /** 本次回复引用的参考来源 */
  sources?: AiResponseSource[];
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
const INLINE_RE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*\n]+\*)/g;

const HEADING_CLASSES = [
  "mt-5 mb-2 text-base font-semibold tracking-tight text-foreground first:mt-0",
  "mt-4 mb-1.5 text-[15px] font-semibold tracking-tight text-foreground first:mt-0",
  "mt-3.5 mb-1 text-sm font-semibold text-foreground first:mt-0",
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
          className="rounded-md bg-secondary/80 px-1.5 py-0.5 font-mono text-[12px] text-foreground"
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
    <div className="my-3 overflow-hidden rounded-xl border border-solid border-border/80 bg-secondary/40">
      <div className="flex items-center justify-between border-b border-solid border-border/70 px-3.5 py-2">
        <span className="font-mono text-[11px] text-muted-foreground">{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="复制代码块"
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-1.5 py-0.5 font-sans text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <pre className="m-0 overflow-x-auto p-3.5 font-mono text-[12px] leading-relaxed text-foreground">
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
  <div className="my-3 overflow-x-auto rounded-xl border border-solid border-border/80">
    <table className="w-full border-collapse text-left text-xs">
      <thead>
        <tr className="border-b border-solid border-border/80 bg-secondary/40">
          {headers.map((h, hi) => (
            <th key={hi} className="px-3 py-2 font-medium text-foreground">
              {renderInline(h, `th-${index}-${hi}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="border-b border-solid border-border/60 last:border-b-0">
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
    className="ml-1 inline-block h-[1.05em] w-[2px] animate-pulse bg-foreground align-[-0.15em]"
  />
);

const renderBlock = (block: MarkdownBlock, index: number, showCaret: boolean): ReactNode => {
  const caret = showCaret ? <StreamingCaret /> : null;
  if (block.type === "code") {
    return <MarkdownCodeBlock key={index} lang={block.lang} code={block.code} />;
  }
  if (block.type === "hr") {
    return <hr key={index} className="my-4 border-0 border-t border-solid border-border/80" />;
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
    return (
      <blockquote
        key={index}
        className="my-3 border-l-2 border-solid border-border pl-3.5 text-[13px] leading-relaxed text-muted-foreground"
      >
        {renderInline(block.text, `q-${index}`)}
        {caret}
      </blockquote>
    );
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
const RESPONSE_SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.8 } as const;
const ACTION_BTN_CLASS =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

const ResponseStatusDot = ({ status }: { status: AiResponseStatus }) => {
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

const ResponseGeneratingSkeleton = ({ label }: { label: string }) => (
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

const ResponseToolsPanel = ({
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

const ResponseSourcesPanel = ({
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
  statusLabel?: string;
  tools: AiResponseTool[];
  sources: AiResponseSource[];
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

export const AiResponseHeader = ({ model, statusLabel, className }: AiResponseHeaderProps) => {
  const ctx = useAiResponse();
  const label = statusLabel ?? ctx.statusLabel ?? defaultStatusLabel(ctx.status);

  return (
    <div className={cn("mb-3 flex items-center justify-between gap-2 select-none", className)}>
      <div className="flex items-center gap-2">
        <ResponseStatusDot status={ctx.status} />
        <span className="text-xs font-medium tracking-tight text-foreground">
          {model ?? ctx.model}
        </span>
      </div>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
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
          "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-solid border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-xs text-destructive",
          className,
        )}
      >
        <span>{errorMessage ?? "回复生成失败，请稍后重试。"}</span>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="cursor-pointer rounded-full border border-solid border-destructive/30 bg-transparent px-2.5 py-1 font-sans text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
  const { tools } = useAiResponse();
  return <ResponseToolsPanel tools={tools} className={className} />;
};

export const AiResponseSources = ({ className }: AiResponseSourcesProps) => {
  const { sources } = useAiResponse();
  return <ResponseSourcesPanel sources={sources} className={className} />;
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

export const AiResponse = ({
  content,
  status = "complete",
  model = "Assistant",
  statusLabel,
  tools = [],
  sources = [],
  errorMessage,
  onRegenerate,
  onFeedback,
  onCopy,
  className,
  children,
}: AiResponseProps) => (
  <ResponseCtx.Provider
    value={{
      content,
      status,
      model,
      statusLabel,
      tools,
      sources,
      errorMessage,
      onRegenerate,
      onFeedback,
      onCopy,
    }}
  >
    <article
      data-slot="ai-response"
      data-status={status}
      className={cn(
        "w-full max-w-2xl rounded-[22px] border border-solid border-border bg-card p-5 font-sans text-card-foreground shadow-xs",
        className,
      )}
    >
      {children ?? (
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

export { safeHref };
