/**
 * ModelSelector 的样式定义：触发器变体、毛玻璃浮层与统一单层焦点环。
 */
import { cva } from "class-variance-authority";

export const MODEL_SELECTOR_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const MODEL_SELECTOR_POPUP_CLASSES =
  "w-80 origin-(--transform-origin) overflow-hidden rounded-2xl border border-solid border-border/80 bg-popover/96 text-popover-foreground shadow-[0_18px_48px_-12px_rgba(0,0,0,0.16),0_3px_10px_-2px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-[transform,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out) outline-none data-ending-style:-translate-y-1 data-ending-style:scale-97 data-ending-style:opacity-0 data-starting-style:-translate-y-1 data-starting-style:scale-97 data-starting-style:opacity-0 dark:border-white/10 dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.78)]";

export const modelSelectorTriggerVariants = cva(
  `group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-solid font-sans font-medium text-foreground select-none transition-[background-color,border-color,box-shadow] duration-(--ui-duration-fast) data-popup-open:border-ring/70 data-popup-open:bg-accent disabled:pointer-events-none disabled:opacity-50 ${MODEL_SELECTOR_FOCUS_RING}`,
  {
    variants: {
      variant: {
        pill: "border-border/80 bg-card/90 shadow-xs hover:border-foreground/22 hover:bg-card dark:border-white/10 dark:bg-card/80 dark:hover:border-white/22",
        ghost:
          "border-transparent bg-transparent hover:bg-accent/70 data-popup-open:border-border/70 dark:hover:bg-white/8",
        glass:
          "border-border/75 bg-popover/85 shadow-xs backdrop-blur-xl hover:border-foreground/22 dark:border-white/12 dark:bg-popover/78",
      },
      size: {
        sm: "h-7 px-2 text-[11px]",
        md: "h-8 px-2.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "pill",
      size: "md",
    },
  },
);
