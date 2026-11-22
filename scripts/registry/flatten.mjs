/**
 * 把一个组件目录里的多个源文件合并成一个可独立使用的文件。
 *
 * 组件在 packages/ui 中按职责拆成多个文件（类型、样式定义、内部部件、主文件），
 * 而 shadcn 的使用者期望每个组件是一个文件。合并时：
 *   - 去掉文件之间的相对导入；
 *   - 把工作区包的导入改写为使用者项目中的别名；
 *   - 合并来自同一模块的导入；
 *   - 内部部件不再导出。
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { IMPORT_REWRITES } from "./constants.mjs";

const IMPORT_PATTERN = /^import\s+(type\s+)?([\s\S]*?)\s+from\s+"([^"]+)";\n/gm;
const HEADER_COMMENT = /^\/\*\*[\s\S]*?\*\/\n/;
const USE_CLIENT = /^"use client";\n+/;

/** 从兄弟组件目录的出口导入，例如 ../button/index.js */
const SIBLING_COMPONENT = /^\.\.\/([a-z0-9-]+)\/index\.js$/;

/** 文件在合并结果中的先后：样式定义、类型、内部部件、主文件 */
const rank = (file, name) => {
  if (file === `${name}.variants.ts`) return 0;
  if (file === `${name}.types.ts`) return 1;
  if (file === `${name}.tsx`) return 3;
  return 2;
};

/** 组件目录中参与合并的源文件，按合并顺序排列 */
const sourceFiles = (dir, name) =>
  readdirSync(dir)
    .filter((file) => /\.tsx?$/.test(file) && !file.includes(".test.") && file !== "index.ts")
    .toSorted((a, b) => rank(a, name) - rank(b, name));

/** 把一条导入语句的具名部分拆成单个标识符，类型导入加上 type 前缀 */
const namedSpecifiers = (isType, clause) =>
  clause
    .replace(/^\{|\}$/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (isType && !item.startsWith("type ") ? `type ${item}` : item));

/**
 * 一条导入在合并后的文件里应当指向哪里。
 * 兄弟组件改为使用者项目中的组件路径；同目录内的相对导入返回 null，表示直接去掉。
 */
const resolveTarget = (specifier, siblings) => {
  const sibling = specifier.match(SIBLING_COMPONENT)?.[1];
  if (sibling) {
    siblings.add(sibling);
    return `@/components/ui/${sibling}`;
  }
  if (specifier.startsWith(".")) return null;
  return IMPORT_REWRITES[specifier] ?? specifier;
};

/** 取出一个文件的导入，返回去掉导入后的正文 */
const extractImports = (code, imports, siblings) =>
  code.replace(IMPORT_PATTERN, (statement, isType, clause, specifier) => {
    const target = resolveTarget(specifier, siblings);
    if (target === null) return "";
    const names = imports.get(target) ?? new Set();
    namedSpecifiers(Boolean(isType), clause).forEach((item) => names.add(item));
    imports.set(target, names);
    return "";
  });

const renderImports = (imports) =>
  [...imports.entries()]
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(
      ([specifier, names]) => `import { ${[...names].toSorted().join(", ")} } from "${specifier}";`,
    )
    .join("\n");

/**
 * @param name 组件名，也是它的目录名
 * @returns 合并后的源码、它用到的外部模块，以及它依赖的兄弟组件
 */
export const flattenComponent = (dir, name) => {
  const imports = new Map();
  const siblings = new Set();
  let useClient = false;
  let header = "";

  const bodies = sourceFiles(dir, name).map((file) => {
    let code = readFileSync(join(dir, file), "utf8");
    if (USE_CLIENT.test(code)) useClient = true;
    code = code.replace(USE_CLIENT, "");
    const isMain = file === `${name}.tsx`;
    if (isMain) header = code.match(HEADER_COMMENT)?.[0] ?? "";
    code = extractImports(code.replace(HEADER_COMMENT, ""), imports, siblings);
    // 内部部件只在本文件内使用，不对外导出
    return (rank(file, name) === 2 ? code.replace(/^export /gm, "") : code).trim();
  });

  const source = [useClient ? '"use client";\n' : "", header, renderImports(imports), "", ...bodies]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
  return { source: `${source.trim()}\n`, modules: [...imports.keys()], siblings: [...siblings] };
};
