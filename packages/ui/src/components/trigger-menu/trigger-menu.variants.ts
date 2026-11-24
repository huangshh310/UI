/**
 * TriggerMenu 样式变体定义：仅使用 --ui-* 设计 Token 静态类名。
 */
import { cva } from "class-variance-authority";

export const triggerFieldVariants = cva(
  "w-full rounded-xl border border-solid border-input bg-background px-3 py-2 font-sans text-sm text-foreground shadow-2xs transition-[border-color,box-shadow] duration-(--ui-duration-fast) outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      multiline: {
        true: "min-h-20 resize-y leading-relaxed",
        false: "h-9",
      },
    },
    defaultVariants: {
      multiline: true,
    },
  },
);

export const TRIGGER_POPUP_CLASS =
  "z-(--ui-z-popover) min-w-56 max-w-xs overflow-hidden rounded-xl border border-solid border-border bg-popover p-1 text-popover-foreground shadow-md outline-none transition-[opacity,transform] duration-(--ui-duration-fast) data-[starting-style]:scale-98 data-[starting-style]:opacity-0 data-[ending-style]:scale-98 data-[ending-style]:opacity-0";

export const TRIGGER_LIST_CLASS = "flex max-h-60 flex-col gap-0.5 overflow-y-auto outline-none";

export const TRIGGER_ITEM_CLASS =
  "flex cursor-pointer items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 font-sans text-xs text-popover-foreground transition-colors outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-45";

export const TRIGGER_EMPTY_CLASS =
  "px-3 py-4 text-center font-sans text-xs text-muted-foreground empty:hidden";

export const TRIGGER_GROUP_HEADER_CLASS =
  "px-2.5 pt-1.5 pb-1 font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase";
