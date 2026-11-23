"use client";

/**
 * AiResponse 轻量安全 Markdown 渲染器：零 innerHTML，天然兼容未闭合流式输出。
 */
import { Check, Copy } from "lucide-react";
import { type ReactNode, useState } from "react";
import { type MarkdownBlock, parseMarkdownBlocks } from "./ai-response-parser.js";
import { copyTextToClipboard, isExternalHref, safeHref } from "./ai-response-safe.js";
import { AI_RESPONSE_FOCUS_RING } from "./ai-response.variants.js";

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
    <div className="my-3.5 overflow-hidden rounded-lg border border-solid border-border bg-muted/30 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-solid border-border/80 bg-muted/70 px-3.5 py-1.5 dark:border-white/10 dark:bg-white/[0.05]">
        <span className="font-mono text-[11px] text-muted-foreground">{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="复制代码块"
          className={`inline-flex cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent bg-transparent px-1.5 py-0.5 font-sans text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${AI_RESPONSE_FOCUS_RING}`}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span>{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <pre className="m-0 overflow-x-auto px-3.5 py-3 font-mono text-[12.5px] leading-relaxed text-foreground">
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

export const MarkdownStreamView = ({
  content,
  streaming,
}: {
  content: string;
  streaming: boolean;
}) => {
  const blocks = parseMarkdownBlocks(content);
  return (
    <div data-slot="ai-response-markdown">
      {blocks.map((block, index) =>
        renderBlock(block, index, streaming && index === blocks.length - 1),
      )}
    </div>
  );
};
