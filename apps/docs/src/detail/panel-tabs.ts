/**
 * 详情页各处页签共用的样式类。
 */

/** 页签列表：带细边框的分段药丸控件 */
export const TAB_LIST_CLASSES =
  "inline-flex items-center gap-0.5 rounded-full border border-border/75 bg-secondary/65 p-1";

export const TAB_CLASSES =
  "cursor-pointer rounded-full px-3.5 py-1 text-xs font-medium text-muted-foreground outline-none transition-all duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:bg-card aria-selected:text-foreground aria-selected:shadow-xs";

/** 显示源码的面板：可用键盘聚焦以便滚动 */
export const CODE_PANEL_CLASSES =
  "bg-(--site-stage)/55 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring";
