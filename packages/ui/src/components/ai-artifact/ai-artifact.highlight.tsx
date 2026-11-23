"use client";

/**
 * AiArtifact 零依赖轻量词法高亮器，支持 TSX/TS 与 CSS，并保证浅色/深色与曜石模式 WCAG AA 对比度。
 */
import type { ReactNode } from "react";

type HighlightKind = "comment" | "string" | "tag" | "keyword" | "attr" | "number" | "punct";

const HIGHLIGHT_LIGHT_CLASS: Record<HighlightKind, string> = {
  comment: "italic text-zinc-600 dark:text-zinc-400",
  string: "text-emerald-700 dark:text-emerald-300",
  tag: "text-sky-700 dark:text-sky-300",
  keyword: "font-medium text-violet-700 dark:text-violet-300",
  attr: "text-amber-800 dark:text-amber-300",
  number: "text-rose-700 dark:text-rose-300",
  punct: "text-zinc-600 dark:text-zinc-400",
};

const HIGHLIGHT_OBSIDIAN_CLASS: Record<HighlightKind, string> = {
  comment: "italic text-zinc-400",
  string: "text-emerald-300",
  tag: "text-sky-300",
  keyword: "font-medium text-violet-300",
  attr: "text-amber-300",
  number: "text-rose-300",
  punct: "text-zinc-400",
};

const HIGHLIGHT_KINDS: HighlightKind[] = [
  "comment",
  "string",
  "tag",
  "keyword",
  "attr",
  "number",
  "punct",
];

const HIGHLIGHT_REGEX =
  /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(--[a-zA-Z0-9-]+|<\/?[A-Za-z][A-Za-z0-9.-]*|\b[A-Z][A-Za-z0-9]*\b)|\b(export|import|from|default|const|let|var|function|return|type|interface|if|else|true|false|null|undefined|async|await|new)\b|(\b[a-z][a-zA-Z0-9-]*)(?=\s*[=:])|(\b\d+(?:\.\d+)?(?:px|rem|em|%|ms|s|K|M)?\b)|(\/>|[{}()[\];,])/g;

const resolveMatchKind = (match: RegExpExecArray): HighlightKind => {
  for (let i = 0; i < HIGHLIGHT_KINDS.length; i += 1) {
    if (match[i + 1] !== undefined) return HIGHLIGHT_KINDS[i] ?? "punct";
  }
  return "punct";
};

export const highlightCodeLine = (line: string, obsidian: boolean): ReactNode => {
  if (!line) return " ";
  const palette = obsidian ? HIGHLIGHT_OBSIDIAN_CLASS : HIGHLIGHT_LIGHT_CLASS;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  HIGHLIGHT_REGEX.lastIndex = 0;

  let match = HIGHLIGHT_REGEX.exec(line);
  while (match !== null) {
    if (match.index > cursor) {
      nodes.push(line.slice(cursor, match.index));
    }
    const kind = resolveMatchKind(match);
    nodes.push(
      <span key={match.index} className={palette[kind]}>
        {match[0]}
      </span>,
    );
    cursor = match.index + match[0].length;
    match = HIGHLIGHT_REGEX.exec(line);
  }

  if (cursor < line.length) {
    nodes.push(line.slice(cursor));
  }
  return nodes;
};
