/**
 * FolderTabCard 的外框材质、激活指示条与弹簧参数映射（不依赖 class-variance-authority）。
 */
import type { FolderTabCardVariant } from "./folder-tab-card.types.js";

export const FOLDER_TAB_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.75,
};

export const FOLDER_CONTENT_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.72,
};

export const FOLDER_SHELL_BASE =
  "w-full max-w-md overflow-hidden rounded-[24px] border border-solid p-1.5";

export const FOLDER_SHELL_VARIANTS: Record<FolderTabCardVariant, string> = {
  default: "border-border/85 bg-secondary/90 shadow-sm dark:bg-secondary/75",
  elevated:
    "border-border/80 bg-muted shadow-md dark:border-foreground/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_30px_-12px_rgba(0,0,0,0.48)]",
  tinted: "border-signal/22 bg-signal/[0.06] shadow-sm dark:border-signal/28 dark:bg-signal/[0.11]",
};

export const FOLDER_PANEL_VARIANTS: Record<FolderTabCardVariant, string> = {
  default: "border-border/80 bg-card shadow-xs",
  elevated: "border-border/75 bg-card shadow-sm dark:border-foreground/[0.08]",
  tinted: "border-signal/18 bg-card shadow-xs dark:border-signal/24",
};

export const FOLDER_INDICATOR_VARIANTS: Record<FolderTabCardVariant, string> = {
  default: "bg-foreground/75",
  elevated: "bg-foreground/85",
  tinted: "bg-signal dark:bg-info",
};

export const FOLDER_BADGE_ACTIVE: Record<FolderTabCardVariant, string> = {
  default: "bg-secondary text-foreground",
  elevated: "bg-secondary text-foreground",
  tinted: "bg-signal/12 text-info dark:bg-signal/24",
};

export const FOLDER_BADGE_INACTIVE = "bg-card/80 text-muted-foreground dark:bg-card/60";

export const FOLDER_TAB_BUTTON_BASE =
  "relative inline-flex cursor-pointer items-center gap-1.5 rounded-t-[14px] border-0 bg-transparent px-3.5 py-2 font-sans text-xs font-medium tracking-[-0.01em] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5 [&_svg]:shrink-0";
