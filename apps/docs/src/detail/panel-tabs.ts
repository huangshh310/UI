/**
 * 详情页各处页签共用的样式类。
 */

/** 页签列表：胶囊形的分段控件 */
export const TAB_LIST_CLASSES = "inline-flex gap-0.5 rounded-full border border-border p-1";

export const TAB_CLASSES =
  "cursor-pointer rounded-full px-4 py-1.5 text-sm text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:bg-accent aria-selected:text-foreground";

/** 显示源码的面板：可用键盘聚焦以便滚动 */
export const CODE_PANEL_CLASSES =
  "outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring";
