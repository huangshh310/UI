/**
 * 新组件脚手架：为一个新组件创建源码、测试、Registry 元数据、展示站示例与文档数据的起始文件。
 *
 * 用法：pnpm component:new <kebab-case 名称>，例如 pnpm component:new magnetic-button
 * 已存在同名组件时直接报错，不会覆盖任何文件。
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { COMPONENTS_DIR, ROOT } from "./registry/constants.mjs";

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
  console.error("请提供 kebab-case 的组件名，例如：pnpm component:new magnetic-button");
  process.exit(1);
}

/** magnetic-button -> MagneticButton */
const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, char) => char.toUpperCase());
const docConst = `${name.replace(/-/g, "_").toUpperCase()}_DOC`;
const componentDir = join(COMPONENTS_DIR, name);
if (existsSync(componentDir)) {
  console.error(`组件 ${name} 已存在：${componentDir}`);
  process.exit(1);
}

/** 要创建的文件：相对仓库根目录的路径，以及内容 */
const FILES = {
  [`packages/ui/src/components/${name}/${name}.types.ts`]: `/**
 * ${pascal} 的类型定义。
 */
import type { ComponentProps } from "react";

export interface ${pascal}Props extends ComponentProps<"div"> {}
`,
  [`packages/ui/src/components/${name}/${name}.tsx`]: `/**
 * ${pascal}：TODO 用一句话说明这个组件做什么。
 */
import { cn } from "@matt-ui/utils";
import type { ${pascal}Props } from "./${name}.types.js";

export const ${pascal} = ({ className, ...props }: ${pascal}Props) => (
  <div data-slot="${name}" className={cn(className)} {...props} />
);
`,
  [`packages/ui/src/components/${name}/${name}.test.tsx`]: `/**
 * ${pascal} 的行为规约。先在这里写下第一条会失败的断言，再去实现组件。
 * 只覆盖组件自己做出的行为决定；样式与真实浏览器行为由展示站的端到端测试覆盖。
 */
import { describe, it } from "vitest";

describe("${pascal}", () => {
  it.todo("TODO 写下第一条行为");
});
`,
  [`packages/ui/src/components/${name}/index.ts`]: `/**
 * ${pascal} 组件目录的出口。
 */
export { ${pascal} } from "./${name}.js";
export type { ${pascal}Props } from "./${name}.types.js";
`,
  [`packages/ui/src/components/${name}/${name}.meta.json`]: `${JSON.stringify(
    { name, title: pascal, description: "TODO one-sentence description.", categories: ["buttons"] },
    null,
    2,
  )}
`,
  [`apps/docs/src/demos/${name}/basic.tsx`]: `/**
 * 示例：${pascal} 的基本用法。
 */
import { ${pascal} } from "@matt-ui/ui";

export const ${pascal}Basic = () => <${pascal}>${pascal}</${pascal}>;
`,
  [`apps/docs/src/registry/${name}.doc.ts`]: `/**
 * ${pascal} 的文档数据：示例清单、API 表格、可访问性说明。
 */
import { ${pascal}Basic } from "@/demos/${name}/basic";
import type { ComponentDoc } from "./registry.types";

export const ${docConst}: ComponentDoc = {
  slug: "${name}",
  name: "${pascal}",
  description: "TODO 用一句话说明这个组件做什么。",
  category: "buttons",
  registryName: "${name}",
  dependencies: ["clsx", "tailwind-merge"],
  usage: \`import { ${pascal} } from "@/components/ui/${name}";

export function Demo() {
  return <${pascal} />;
}\`,
  createdAt: "${new Date().toISOString().slice(0, 10)}",
  specimens: [
    {
      slug: "${name}-basic",
      name: "基本用法",
      description: "TODO 说明这个示例展示了什么。",
      file: "${name}/basic.tsx",
      Demo: ${pascal}Basic,
    },
  ],
  api: [],
  accessibility: [],
};
`,
};

for (const [path, content] of Object.entries(FILES)) {
  mkdirSync(dirname(join(ROOT, path)), { recursive: true });
  writeFileSync(join(ROOT, path), content);
  console.log(`已创建 ${path}`);
}

console.log(`
接下来：
  1. 在 packages/ui/src/index.ts 中导出 ${pascal}。
  2. 在 apps/docs/src/registry/registry.ts 的 COMPONENTS 中登记 ${docConst}。
  3. 先写测试，再实现组件；完成后运行 pnpm registry:generate。`);
