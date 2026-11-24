/**
 * SelectionActions 的样式定义（对标 BeautifulUI 20 Selection Actions 极简单色悬浮胶囊）。
 */
import { cva } from "class-variance-authority";

export const SELECTION_ACTIONS_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const selectionActionsBarVariants = cva(
  "inline-flex max-w-full items-center gap-1 rounded-full border border-solid border-border bg-card/95 py-1 pr-1.5 pl-3.5 text-xs text-foreground shadow-[0_10px_30px_-12px_rgba(15,23,42,0.22),0_1px_2px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-white/12 dark:bg-card/95 dark:shadow-[0_14px_34px_-10px_rgba(0,0,0,0.72)]",
);

export const selectionActionsButtonVariants = cva(
  "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-transparent px-2.5 font-sans text-xs font-medium text-foreground/85 transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45 dark:hover:bg-white/[0.08]",
);
