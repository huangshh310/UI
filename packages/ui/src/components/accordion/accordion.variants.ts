/**
 * Accordion 的样式定义：支持 default / card / separated 三种精密发丝容器与统一焦点环。
 */
import { cva } from "class-variance-authority";

export const accordionRootVariants = cva("flex w-full flex-col", {
  variants: {
    variant: {
      default:
        "divide-y divide-border/80 border-y border-solid border-border/80 dark:divide-white/10 dark:border-white/12",
      card: "divide-y divide-border/80 overflow-hidden rounded-2xl border border-solid border-border/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:divide-white/10 dark:border-white/12",
      separated: "gap-2.5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionItemVariants = cva("transition-colors duration-(--ui-duration-fast)", {
  variants: {
    variant: {
      default: "",
      card: "data-open:bg-secondary/25 dark:data-open:bg-white/[0.02]",
      separated:
        "overflow-hidden rounded-xl border border-solid border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/20 data-open:border-foreground/25 dark:border-white/12 dark:hover:border-white/20 dark:data-open:border-white/25",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionTriggerVariants = cva(
  "group flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent text-left font-sans text-sm font-medium text-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:text-foreground/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "px-1 py-3.5",
        card: "px-5 py-3.5 hover:bg-secondary/35 dark:hover:bg-white/[0.03]",
        separated: "px-4 py-3.5 hover:bg-secondary/35 dark:hover:bg-white/[0.03]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const accordionBodyVariants = cva("text-xs leading-relaxed text-muted-foreground", {
  variants: {
    variant: {
      default: "px-1 pb-4",
      card: "px-5 pb-4",
      separated: "px-4 pb-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
