/**
 * TokenInput 样式变体定义：内联上下文胶囊与可编辑富提示词外壳。
 */
import { cva } from "class-variance-authority";
import type { ContextTokenTone } from "./token-input.types.js";

export const tokenShellVariants = cva(
  "flex w-full flex-col rounded-2xl border border-solid transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset data-[disabled]:cursor-not-allowed data-[disabled]:opacity-55",
  {
    variants: {
      variant: {
        default: "border-input bg-card shadow-2xs",
        subtle: "border-border/75 bg-muted/35",
      },
      invalid: {
        true: "border-destructive focus-within:border-destructive focus-within:ring-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      invalid: false,
    },
  },
);

export const TOKEN_EDITOR_CLASS =
  "min-h-11 w-full px-3.5 py-2.5 font-sans text-sm leading-7 text-foreground outline-none whitespace-pre-wrap break-words before:pointer-events-none before:text-muted-foreground/70 data-[empty]:before:content-[attr(aria-placeholder)]";

export const TOKEN_CHIP_BASE_CLASS =
  "mx-0.5 inline-flex items-center gap-1 rounded-md border border-solid px-1.5 py-0.5 align-baseline font-mono text-xs leading-none font-medium transition-colors select-none data-[selected]:ring-2 data-[selected]:ring-ring data-[pending]:opacity-65";

export const TOKEN_TONE_CLASS: Record<ContextTokenTone, string> = {
  default: "border-border bg-secondary/80 text-foreground dark:bg-secondary/60",
  signal: "border-signal/30 bg-signal/12 text-foreground dark:border-signal/40 dark:bg-signal/20",
  success:
    "border-emerald-600/20 bg-emerald-500/12 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/16 dark:text-emerald-300",
  warning:
    "border-amber-600/25 bg-amber-500/14 text-amber-900 dark:border-amber-400/25 dark:bg-amber-500/16 dark:text-amber-200",
};

export const TOKEN_POPUP_CLASS =
  "z-(--ui-z-popover) min-w-52 max-w-xs overflow-hidden rounded-xl border border-solid border-border bg-popover p-1 text-popover-foreground shadow-md outline-none";

export const TOKEN_POPUP_ITEM_CLASS =
  "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 font-sans text-xs text-popover-foreground outline-none select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-45";
