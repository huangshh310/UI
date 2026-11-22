/**
 * Registry 生成脚本用到的路径与常量。
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** 组件源码所在目录：每个子目录是一个组件 */
export const COMPONENTS_DIR = join(ROOT, "packages/ui/src/components");

/** 生成的、可被 shadcn CLI 直接安装的单文件源码 */
export const REGISTRY_UI_DIR = join(ROOT, "registry/ui");

export const REGISTRY_JSON = join(ROOT, "registry.json");

export const THEMES_DIR = join(ROOT, "packages/tokens/src/themes");

export const MOTION_CSS = join(ROOT, "packages/tokens/src/scales/motion.css");

export const REGISTRY_NAME = "matt-ui";

export const HOMEPAGE = "https://github.com/huangshh310/UI";

/** 工作区内的包名到使用者项目中别名路径的映射 */
export const IMPORT_REWRITES = { "@matt-ui/utils": "@/lib/utils" };

/**
 * 标准 shadcn 主题里没有、需要随组件一起带过去的语义色。
 * 其余颜色（primary、accent 等）沿用使用者自己的主题。
 */
export const EXTRA_COLOR_TOKENS = ["signal", "signal-foreground", "destructive-foreground"];

/** 生成文件顶部的提示 */
export const GENERATED_BANNER =
  "// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。\n";
