/**
 * 读取示例的源码并做语法高亮。只在服务端（构建时）运行。
 *
 * 展示的源码直接读自正在运行的示例文件，保证「看到的代码」与「看到的效果」是同一份。
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { codeToHtml } from "shiki";

const DEMOS_DIR = join(process.cwd(), "src/demos");

/** 示例文件顶部面向维护者的说明注释，展示给使用者时去掉 */
const HEADER_COMMENT = /\/\*\*[\s\S]*?\*\/\n/;

/**
 * 返回某个示例高亮后的 HTML。
 *
 * @param file 相对于 src/demos 的文件路径
 * @returns 带浅色与深色两套配色变量的 HTML，由样式表按当前主题选择
 */
export const highlightSpecimen = async (file: string): Promise<string> => {
  const raw = await readFile(join(DEMOS_DIR, file), "utf8");
  const code = raw.replace(HEADER_COMMENT, "").replace(/^\n+/, "").trimEnd();

  return codeToHtml(code, {
    lang: "tsx",
    themes: { light: "min-light", dark: "min-dark" },
    // 不内联默认颜色，两套配色都以 CSS 变量输出
    defaultColor: false,
  });
};
