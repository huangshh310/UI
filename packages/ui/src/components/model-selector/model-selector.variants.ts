/**
 * ModelSelector 的样式定义：极简触发器变体、利落浮层表面与统一单层焦点环。
 */
import { cva } from "class-variance-authority";

export const MODEL_SELECTOR_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const MODEL_SELECTOR_POPUP_CLASSES =
  "w-80 origin-(--transform-origin) overflow-hidden rounded-xl border border-solid border-border bg-popover/98 text-popover-foreground shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-[transform,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out) outline-none data-ending-style:-translate-y-1 data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:-translate-y-1 data-starting-style:scale-[0.97] data-starting-style:opacity-0 dark:border-white/10 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]";

export const modelSelectorTriggerVariants = cva(
  `group inline-flex cursor-pointer items-center gap-1.5 border border-solid font-sans font-medium text-foreground select-none transition-[background-color,border-color] duration-(--ui-duration-fast) data-popup-open:border-foreground/20 data-popup-open:bg-accent/60 disabled:pointer-events-none disabled:opacity-50 ${MODEL_SELECTOR_FOCUS_RING}`,
  {
    variants: {
      variant: {
        pill: "rounded-full border-border bg-card shadow-xs hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:hover:border-white/20",
        ghost:
          "rounded-lg border-transparent bg-transparent hover:bg-accent/60 data-popup-open:border-border dark:hover:bg-white/8",
        glass:
          "rounded-full border-border bg-popover/90 shadow-xs backdrop-blur-xl hover:border-foreground/20 dark:border-white/10 dark:bg-popover/80",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "pill",
      size: "md",
    },
  },
);
