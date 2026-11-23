/**
 * 把参数值代入代码模板：{{name}} 换成 values[name]，没有对应值的占位符保持原样。
 * 同时提供分词函数，用于在不改变纯文本的前提下高亮代码中的动态参数。
 */
export interface CodeSegment {
  type: "text" | "param";
  text: string;
  name?: string;
}

const PLACEHOLDER = /\{\{(\w+)\}\}/g;

export const fillTemplate = (code: string, values: Record<string, string>): string =>
  code.replace(PLACEHOLDER, (placeholder, name: string) => values[name] ?? placeholder);

export const tokenizeTemplate = (code: string, values: Record<string, string>): CodeSegment[] => {
  const segments: CodeSegment[] = [];
  let cursor = 0;

  for (const match of code.matchAll(PLACEHOLDER)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      segments.push({ type: "text", text: code.slice(cursor, start) });
    }
    const name = match[1] ?? "";
    segments.push({
      type: "param",
      name,
      text: values[name] ?? match[0],
    });
    cursor = start + match[0].length;
  }

  if (cursor < code.length) {
    segments.push({ type: "text", text: code.slice(cursor) });
  }

  return segments;
};
