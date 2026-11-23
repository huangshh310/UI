/**
 * AiResponse Markdown 块级解析器：支持流式未闭合代码块、标题、引用、列表、表格与分隔线。
 */

export type MarkdownBlock =
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

export const parseMarkdownBlocks = (content: string): MarkdownBlock[] => {
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
