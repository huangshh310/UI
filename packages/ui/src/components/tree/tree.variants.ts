/**
 * Tree 的样式定义：极简发丝边框、参考线与紧凑/舒适两档密度。
 */
import { cva } from "class-variance-authority";

export const treeRootVariants = cva("flex w-full flex-col gap-0.5 outline-none", {
  variants: {
    variant: {
      card: "rounded-2xl border border-solid border-border/80 bg-card p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/12",
      ghost: "rounded-xl bg-transparent p-1",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const treeRowVariants = cva(
  "group flex cursor-pointer items-center gap-1.5 rounded-lg px-2 font-sans text-foreground transition-colors duration-(--ui-duration-fast) outline-none select-none hover:bg-accent/70 focus-visible:ring-2 focus-visible:ring-ring data-[selected]:bg-signal/10 data-[selected]:font-medium data-[selected]:text-foreground data-[selected]:ring-1 data-[selected]:ring-signal/25 data-[disabled]:pointer-events-none data-[disabled]:opacity-45 dark:data-[selected]:bg-signal/18 dark:data-[selected]:ring-signal/35",
  {
    variants: {
      density: {
        compact: "h-7 text-xs",
        comfortable: "h-8 text-[13px]",
      },
    },
    defaultVariants: {
      density: "comfortable",
    },
  },
);

export const treeGroupVariants = cva("ml-3.5 pl-2", {
  variants: {
    showGuides: {
      true: "border-l border-solid border-border/75 dark:border-white/12",
      false: "",
    },
  },
  defaultVariants: {
    showGuides: true,
  },
});
