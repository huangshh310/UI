/**
 * 从 Design Token 的 CSS 中取出需要随组件分发的变量。
 *
 * 通过 shadcn 安装的组件运行在使用者自己的主题里，但有两类变量标准 shadcn 主题没有：
 * 本项目独有的语义色，以及组件过渡用到的时长与缓动。这里把它们读出来写进 Registry 条目。
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { EXTRA_COLOR_TOKENS, MOTION_CSS, THEMES_DIR } from "./constants.mjs";

/** 读取一个 CSS 文件中所有的 --ui-* 声明 */
const declarations = (file) =>
  Object.fromEntries(
    [...readFileSync(file, "utf8").matchAll(/--ui-([\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );

/** 某个主题下需要额外分发的语义色 */
const extraColors = (theme) => {
  const all = declarations(join(THEMES_DIR, `${theme}.css`));
  return Object.fromEntries(EXTRA_COLOR_TOKENS.map((token) => [token, all[token]]));
};

/** Registry 条目的 cssVars：shadcn CLI 会把它们写进使用者的样式表，并注册为 Tailwind 颜色 */
export const themeCssVars = () => ({ light: extraColors("light"), dark: extraColors("dark") });

/**
 * Registry 条目的 css：时长与缓动变量。
 * 只取 :root 上的默认值；motion.css 中「减少动态效果」的覆盖值排在后面，这里取第一次出现的值。
 */
export const motionCss = () => {
  const source = readFileSync(MOTION_CSS, "utf8");
  const vars = {};
  for (const [, name, value] of source.matchAll(/(--ui-[\w-]+):\s*([^;]+);/g)) {
    vars[name] ??= value.trim();
  }
  return { "@layer base": { ":root": vars } };
};
