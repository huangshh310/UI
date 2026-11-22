/**
 * 生成 shadcn Registry：
 *   - registry/ui/<name>.tsx  每个组件一个可独立使用的源文件
 *   - registry.json           仓库根目录的清单，shadcn CLI 通过它安装组件
 *
 * 组件的实现只写在 packages/ui 里，这里的产物全部由它生成。
 * 用法：pnpm registry:generate
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  COMPONENTS_DIR,
  GENERATED_BANNER,
  HOMEPAGE,
  REGISTRY_ADDRESS,
  REGISTRY_JSON,
  REGISTRY_NAME,
  REGISTRY_UI_DIR,
  ROOT,
} from "./registry/constants.mjs";
import { flattenComponent } from "./registry/flatten.mjs";
import { motionCss, themeCssVars } from "./registry/theme.mjs";

/** 模块说明符对应的 npm 包名：去掉子路径，例如 @base-ui/react/menu -> @base-ui/react */
const packageName = (specifier) =>
  specifier
    .split("/")
    .slice(0, specifier.startsWith("@") ? 2 : 1)
    .join("/");

/** 合并后的源码引用的模块中，哪些是需要使用者安装的 npm 包 */
const npmDependencies = (modules) => [
  ...new Set(
    modules
      .filter((name) => !name.startsWith("@/"))
      .map(packageName)
      .filter((name) => !["react", "react-dom"].includes(name)),
  ),
];

/** 为一个组件生成源文件，并返回它的 Registry 条目 */
const buildItem = (name) => {
  const dir = join(COMPONENTS_DIR, name);
  const meta = JSON.parse(readFileSync(join(dir, `${name}.meta.json`), "utf8"));
  const { source, modules, siblings } = flattenComponent(dir, name);
  writeFileSync(join(REGISTRY_UI_DIR, `${name}.tsx`), GENERATED_BANNER + source);

  return {
    name: meta.name,
    type: "registry:ui",
    title: meta.title,
    description: meta.description,
    categories: meta.categories,
    dependencies: npmDependencies(modules),
    // utils 是 shadcn 内置条目，提供 @/lib/utils 中的 cn()；
    // 本仓库内的其他组件要用完整的 GitHub 地址声明
    registryDependencies: ["utils", ...siblings.map((sibling) => `${REGISTRY_ADDRESS}/${sibling}`)],
    files: [{ path: `registry/ui/${name}.tsx`, type: "registry:ui", target: `@ui/${name}.tsx` }],
    cssVars: themeCssVars(),
    css: motionCss(),
  };
};

/** 带有元数据文件的组件目录才会进入 Registry */
const componentNames = () =>
  readdirSync(COMPONENTS_DIR).filter((name) =>
    existsSync(join(COMPONENTS_DIR, name, `${name}.meta.json`)),
  );

rmSync(REGISTRY_UI_DIR, { recursive: true, force: true });
mkdirSync(REGISTRY_UI_DIR, { recursive: true });

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: REGISTRY_NAME,
  homepage: HOMEPAGE,
  items: componentNames().toSorted().map(buildItem),
};
writeFileSync(REGISTRY_JSON, `${JSON.stringify(registry, null, 2)}\n`);

console.log(
  `已生成 ${registry.items.length} 个条目：${registry.items.map(({ name }) => name).join(", ")}`,
);
console.log(`清单：${REGISTRY_JSON.replace(ROOT, ".")}`);
