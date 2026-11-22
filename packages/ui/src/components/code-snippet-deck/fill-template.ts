/**
 * 把参数值代入代码模板：{{name}} 换成 values[name]，没有对应值的占位符保持原样。
 */
export const fillTemplate = (code: string, values: Record<string, string>): string =>
  code.replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) => values[name] ?? placeholder);
