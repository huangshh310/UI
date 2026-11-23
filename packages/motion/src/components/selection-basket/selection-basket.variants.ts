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
    "border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl shadow-[0_18px_48px_-12px_rgba(0,0,0,0.16),0_3px_10px_-2px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.78)]",
  inverted:
    "border-foreground bg-foreground text-background shadow-[0_20px_54px_-12px_rgba(0,0,0,0.34)] dark:border-white/20 dark:bg-foreground dark:text-background dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.78)]",
  glass:
    "border-border/75 bg-popover/82 text-popover-foreground backdrop-blur-2xl shadow-[0_18px_48px_-12px_rgba(0,0,0,0.14)] dark:border-white/14 dark:bg-popover/78 dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.72)]",
};

export const BASKET_DOCK_SIZE: Record<SelectionBasketSize, string> = {
  sm: "gap-2.5 rounded-xl px-3 py-1.5",
  md: "gap-3 rounded-2xl px-3.5 py-2",
};

export const BASKET_POSITION_CLASS: Record<SelectionBasketPosition, string> = {
  bottom: "fixed bottom-6 left-1/2 z-40 -translate-x-1/2",
  top: "fixed top-6 left-1/2 z-40 -translate-x-1/2",
};

type ActionTone = NonNullable<SelectionBasketAction["tone"]>;

export const BASKET_ACTION_TONE: Record<ActionTone, string> = {
  default:
    "border-border/85 bg-background text-foreground hover:border-foreground/22 hover:bg-accent/80 dark:border-white/12 dark:bg-card dark:hover:border-white/22 dark:hover:bg-white/10",
  signal: "border-signal bg-signal text-signal-foreground hover:opacity-92",
  destructive:
    "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/18 dark:border-destructive/35 dark:bg-destructive/16",
};

export const BASKET_INVERTED_ACTION_TONE: Record<ActionTone, string> = {
  default:
    "border-white/18 bg-white/10 text-background hover:bg-white/18 dark:border-black/15 dark:bg-black/6 dark:text-background dark:hover:bg-black/12",
  signal: "border-signal bg-signal text-signal-foreground hover:opacity-92",
  destructive:
    "border-red-400/35 bg-red-500/20 text-red-200 hover:bg-red-500/30 dark:border-red-600/30 dark:bg-red-600/10 dark:text-red-700 dark:hover:bg-red-600/18",
};
