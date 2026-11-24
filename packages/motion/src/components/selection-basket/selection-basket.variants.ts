/**
 * SelectionBasket 的样式映射（纯类型化 Tailwind 查表，不引入 cva）。
 */
import type {
  SelectionBasketAction,
  SelectionBasketPosition,
  SelectionBasketSize,
  SelectionBasketVariant,
} from "./selection-basket.types.js";

export const BASKET_DOCK_VARIANT: Record<SelectionBasketVariant, string> = {
  default:
    "border-border bg-popover/96 text-popover-foreground backdrop-blur-xl shadow-[0_18px_48px_-12px_rgba(0,0,0,0.14),0_3px_10px_-2px_rgba(0,0,0,0.05)] dark:bg-popover/95 dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.72)]",
  inverted:
    "border-foreground bg-foreground text-background shadow-[0_20px_54px_-12px_rgba(0,0,0,0.3)] dark:border-white/15 dark:bg-foreground dark:text-background dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.72)]",
  glass:
    "border-border bg-popover/92 text-popover-foreground backdrop-blur-2xl shadow-[0_18px_48px_-12px_rgba(0,0,0,0.12)] dark:bg-popover/90 dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.68)]",
};

export const BASKET_DOCK_SIZE: Record<SelectionBasketSize, string> = {
  sm: "gap-3 rounded-xl px-3 py-1.5",
  md: "gap-3.5 rounded-2xl px-3.5 py-2",
};

export const BASKET_POSITION_CLASS: Record<SelectionBasketPosition, string> = {
  bottom: "fixed bottom-6 left-1/2 z-40 -translate-x-1/2",
  top: "fixed top-6 left-1/2 z-40 -translate-x-1/2",
};

type ActionTone = NonNullable<SelectionBasketAction["tone"]>;

export const BASKET_ACTION_TONE: Record<ActionTone, string> = {
  default:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
  signal: "border-transparent bg-signal text-signal-foreground hover:bg-signal/92",
  destructive:
    "border-transparent bg-destructive/12 text-destructive hover:bg-destructive/18 dark:bg-destructive/18 dark:text-red-300",
};

export const BASKET_INVERTED_ACTION_TONE: Record<ActionTone, string> = {
  default:
    "border-transparent bg-white/12 text-background hover:bg-white/20 dark:bg-black/8 dark:text-background dark:hover:bg-black/14",
  signal: "border-transparent bg-signal text-signal-foreground hover:bg-signal/92",
  destructive:
    "border-transparent bg-red-500/22 text-red-200 hover:bg-red-500/32 dark:bg-red-600/14 dark:text-red-900 dark:hover:bg-red-600/20",
};
