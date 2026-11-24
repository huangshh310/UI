/**
 * AnimatedFileUpload 的样式查表定义（零 cva 依赖，使用完整字面量 Tailwind 类名）。
 */
import type { AnimatedFileUploadVariant } from "./animated-file-upload.types.js";

export const DROPZONE_BASE =
  "group relative flex w-full cursor-pointer border font-sans transition-[border-color,background-color,box-shadow,transform] duration-(--ui-duration-fast) outline-none active:scale-[0.995] focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-dragging:border-signal data-dragging:bg-signal/6 disabled:pointer-events-none disabled:opacity-50";

export const DROPZONE_VARIANT_CLASSES: Record<AnimatedFileUploadVariant, string> = {
  default:
    "border-dashed border-input bg-card/85 hover:border-foreground/25 hover:bg-card dark:hover:border-white/25",
  filled:
    "border-solid border-transparent bg-secondary/70 hover:bg-secondary dark:bg-white/7 dark:hover:bg-white/11",
  minimal:
    "border-solid border-border/85 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 dark:border-white/12 dark:hover:border-white/22",
};

export const DROPZONE_LAYOUT_CLASSES = {
  regular: "min-h-[168px] flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center",
  compact:
    "min-h-14 flex-row items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left",
};

export const DROPZONE_INVALID_CLASSES =
  "border-destructive hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive dark:border-destructive dark:hover:border-destructive";

export const DROPZONE_ICON_CLASSES =
  "inline-flex shrink-0 items-center justify-center rounded-xl border border-solid border-border/80 bg-background text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-(--ui-duration-fast) group-hover:text-foreground dark:border-white/12 dark:bg-card";
