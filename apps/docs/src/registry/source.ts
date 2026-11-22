/**
 * 读取并高亮要展示的源码。只在服务端（构建时）运行。
 *
 * 示例的源码直接读自正在运行的示例文件，组件的源码读自生成的 Registry 文件，
 * 保证「看到的代码」与「实际安装到的代码」是同一份。
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { codeToHtml } from "shiki";

const DEMOS_DIR = join(process.cwd(), "src/demos");

/** 仓库根目录下由脚本生成的 Registry 源文件 */
const REGISTRY_UI_DIR = join(process.cwd(), "../../registry/ui");

/** 文件顶部面向维护者的说明注释，展示给使用者时去掉 */
const HEADER_COMMENT = /\/\*\*[\s\S]*?\*\/\n/;

/** 生成文件第一行的「请勿手工修改」提示 */
const GENERATED_BANNER = /^\/\/ 本文件由[^\n]*\n/;

/** 把一段 TSX 源码高亮为 HTML，带浅色与深色两套配色变量，由样式表按当前主题选择 */
export const highlightCode = (code: string): Promise<string> =>
  codeToHtml(code.trim(), {
    lang: "tsx",
    themes: { light: "min-light", dark: "min-dark" },
    // 不内联默认颜色，两套配色都以 CSS 变量输出
    defaultColor: false,
  });

/**
 * 某个示例高亮后的源码。
 *
 * 示例在本站内从 @matt-ui/ui 引入组件；展示时换成通过 shadcn 安装后的路径，
 * 这是使用者复制代码时真正需要的写法。除这一行外与运行的代码完全一致。
 *
 * @param file 相对于 src/demos 的文件路径
 * @param registryName 组件在 Registry 中的名称
 */
export const highlightSpecimen = async (file: string, registryName: string): Promise<string> => {
  const raw = await readFile(join(DEMOS_DIR, file), "utf8");
  const code = raw
    .replace(HEADER_COMMENT, "")
    .replace('from "@matt-ui/ui"', `from "@/components/ui/${registryName}"`);
  return highlightCode(code);
};

/** 组件本身的完整源码，即使用者通过 shadcn CLI 安装到的那个文件 */
export const highlightComponentSource = async (registryName: string): Promise<string> => {
  const raw = await readFile(join(REGISTRY_UI_DIR, `${registryName}.tsx`), "utf8");
  return highlightCode(raw.replace(GENERATED_BANNER, ""));
};
