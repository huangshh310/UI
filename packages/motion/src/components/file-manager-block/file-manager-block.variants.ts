/**
 * FileManagerBlock 的静态样式查找表与默认示例文件列表（不依赖 cva）。
 */
import type { FileManagerBlockVariant, ManagedFileEntry } from "./file-manager-block.types.js";

export const DEFAULT_MANAGED_FILES: ManagedFileEntry[] = [
  {
    id: "1",
    name: "design-tokens.css",
    folder: "Token 主题",
    sizeLabel: "18 KB",
    updatedAt: "2 分钟前",
  },
  {
    id: "2",
    name: "registry.json",
    folder: "Registry 清单",
    sizeLabel: "42 KB",
    updatedAt: "15 分钟前",
  },
  {
    id: "3",
    name: "component-roadmap.md",
    folder: "架构文档",
    sizeLabel: "11 KB",
    updatedAt: "1 小时前",
  },
];

export const FILE_MANAGER_CONTAINER_STYLES: Record<FileManagerBlockVariant, string> = {
  default: "border-border/80 bg-card shadow-xs dark:border-white/10",
  elevated:
    "border-border/80 bg-card shadow-lg dark:border-white/12 dark:shadow-[0_18px_40px_rgba(0,0,0,0.42)]",
  minimal: "border-border/75 bg-secondary/25 shadow-none dark:border-white/10 dark:bg-card/80",
};

export const FOLDER_CARD_BASE =
  "flex cursor-pointer items-center gap-3 rounded-2xl border border-solid text-left transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid";

export const FOLDER_CARD_STATE = {
  active: "border-foreground/30 bg-card shadow-xs dark:border-white/25 dark:bg-white/[0.06]",
  idle: "border-border/80 bg-secondary/40 hover:border-foreground/20 hover:bg-secondary/65 dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-white/20",
} as const;
