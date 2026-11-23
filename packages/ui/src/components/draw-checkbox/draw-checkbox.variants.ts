/**
 * DrawCheckbox 的样式定义：复选框外观（形状/尺寸/语义色）与 C 端容器变体（行内/卡片/胶囊/列表行）。
 */
import { cva } from "class-variance-authority";

const BOX_BASE = [
  "group/cb relative inline-flex shrink-0 cursor-pointer items-center justify-center",
  "border border-solid border-foreground/22 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-card",
  "transition-[transform,background-color,border-color,box-shadow] duration-(--ui-duration-fast) ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  "hover:border-foreground/38 active:scale-[0.88] motion-reduce:active:scale-100",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "data-invalid:border-destructive data-disabled:pointer-events-none data-disabled:opacity-50",
].join(" ");

export const drawCheckboxBoxVariants = cva(BOX_BASE, {
  variants: {
    size: {
      sm: "size-4",
      md: "size-[18px]",
      lg: "size-[22px]",
    },
    shape: {
      rounded: "rounded-[6px]",
      circle: "rounded-full",
      square: "rounded-[3px]",
    },
    tone: {
      primary:
        "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground",
      signal:
        "data-checked:border-signal data-checked:bg-signal data-checked:text-signal-foreground data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] data-indeterminate:border-signal data-indeterminate:bg-signal data-indeterminate:text-signal-foreground",
      destructive:
        "data-checked:border-destructive data-checked:bg-destructive data-checked:text-destructive-foreground data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] data-indeterminate:border-destructive data-indeterminate:bg-destructive data-indeterminate:text-destructive-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "rounded",
    tone: "primary",
  },
});

export const drawCheckboxGlyphVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "size-2.5",
      md: "size-3",
      lg: "size-3.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const ITEM_BASE = [
  "group/item cursor-pointer font-sans select-none",
  "data-disabled:cursor-not-allowed data-disabled:opacity-55",
].join(" ");

export const drawCheckboxItemVariants = cva(ITEM_BASE, {
  variants: {
    variant: {
      default: "inline-flex gap-3",
      card: [
        "flex w-full gap-3.5 rounded-2xl border border-solid border-border bg-card p-4",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[border-color,background-color,box-shadow,transform] duration-(--ui-duration-fast)",
        "hover:border-foreground/22 hover:shadow-xs active:scale-[0.99] motion-reduce:active:scale-100",
        "data-invalid:border-destructive",
      ].join(" "),
      pill: [
        "inline-flex items-center gap-2 rounded-full border border-solid border-border bg-card px-3.5 py-2",
        "shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-[border-color,background-color,transform] duration-(--ui-duration-fast)",
        "hover:border-foreground/22 hover:bg-secondary/50 active:scale-[0.97] motion-reduce:active:scale-100",
        "data-invalid:border-destructive",
      ].join(" "),
      tile: [
        "flex w-full gap-3 rounded-xl px-3 py-2.5",
        "transition-colors duration-(--ui-duration-fast) hover:bg-secondary/65 has-[[data-checked]]:bg-secondary/45",
      ].join(" "),
    },
    tone: {
      primary: "",
      signal: "",
      destructive: "",
    },
    align: {
      start: "items-start",
      center: "items-center",
    },
  },
  compoundVariants: [
    {
      variant: "card",
      tone: "primary",
      class:
        "has-[[data-checked]]:border-primary has-[[data-checked]]:bg-secondary/35 has-[[data-checked]]:ring-1 has-[[data-checked]]:ring-primary has-[[data-checked]]:ring-inset",
    },
    {
      variant: "card",
      tone: "signal",
      class:
        "has-[[data-checked]]:border-signal has-[[data-checked]]:bg-signal/[0.04] has-[[data-checked]]:ring-1 has-[[data-checked]]:ring-signal has-[[data-checked]]:ring-inset",
    },
    {
      variant: "card",
      tone: "destructive",
      class:
        "has-[[data-checked]]:border-destructive has-[[data-checked]]:bg-destructive/[0.04] has-[[data-checked]]:ring-1 has-[[data-checked]]:ring-destructive has-[[data-checked]]:ring-inset",
    },
    {
      variant: "pill",
      tone: "primary",
      class: "has-[[data-checked]]:border-primary has-[[data-checked]]:bg-secondary/75",
    },
    {
      variant: "pill",
      tone: "signal",
      class: "has-[[data-checked]]:border-signal has-[[data-checked]]:bg-signal/[0.08]",
    },
    {
      variant: "pill",
      tone: "destructive",
      class: "has-[[data-checked]]:border-destructive has-[[data-checked]]:bg-destructive/[0.08]",
    },
  ],
  defaultVariants: {
    variant: "default",
    tone: "primary",
    align: "center",
  },
});

export const drawCheckboxTitleVariants = cva(
  [
    "font-medium text-foreground transition-colors duration-(--ui-duration-fast)",
    "group-data-strikethrough/item:group-has-[[data-checked]]/item:text-muted-foreground",
    "group-data-strikethrough/item:group-has-[[data-checked]]/item:line-through",
    "group-data-strikethrough/item:group-has-[[data-checked]]/item:decoration-muted-foreground/60",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-xs leading-snug",
        md: "text-[13px] leading-snug",
        lg: "text-sm leading-snug",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
