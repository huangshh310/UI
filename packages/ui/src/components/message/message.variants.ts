/**
 * Message 的样式定义：极简无框助手正文、发丝质感用户胶囊、统一单层焦点环与异常横幅。
 */
import { cva } from "class-variance-authority";

export const MESSAGE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const MESSAGE_PAGER_BTN = `inline-flex size-6 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 ${MESSAGE_FOCUS_RING}`;

export const messageContentVariants = cva("font-sans", {
  variants: {
    from: {
      user: "max-w-[84%] border border-solid border-border/70 bg-secondary/90 text-secondary-foreground shadow-xs dark:border-white/10 dark:bg-white/9",
      assistant: "w-full text-foreground",
      system:
        "rounded-full border border-solid border-border/80 bg-secondary/50 px-3 py-1 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/6",
    },
    variant: {
      default: "",
      compact: "",
      flat: "",
    },
  },
  compoundVariants: [
    {
      from: "user",
      variant: "default",
      class: "rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed",
    },
    {
      from: "user",
      variant: "compact",
      class: "rounded-xl rounded-br-sm px-3 py-2 text-xs leading-relaxed",
    },
    {
      from: "user",
      variant: "flat",
      class:
        "max-w-full rounded-xl bg-secondary/65 px-3.5 py-2.5 text-sm leading-relaxed dark:bg-white/7",
    },
    { from: "assistant", variant: "default", class: "text-sm leading-7" },
    { from: "assistant", variant: "compact", class: "text-xs leading-6" },
    { from: "assistant", variant: "flat", class: "text-sm leading-7" },
  ],
  defaultVariants: {
    from: "assistant",
    variant: "default",
  },
});

export const messageActionVariants = cva(
  `inline-flex h-7 min-w-7 cursor-pointer items-center justify-center gap-1 rounded-lg border border-solid border-transparent bg-transparent px-1.5 font-sans text-xs transition-colors duration-(--ui-duration-fast) ${MESSAGE_FOCUS_RING}`,
  {
    variants: {
      tone: {
        default: "text-muted-foreground hover:bg-accent/80 hover:text-foreground",
        destructive: "text-muted-foreground hover:bg-destructive/12 hover:text-destructive",
      },
      active: {
        true: "border-border/70 bg-secondary/90 text-foreground hover:bg-secondary dark:border-white/10 dark:bg-white/12",
        false: "",
      },
    },
    defaultVariants: {
      tone: "default",
      active: false,
    },
  },
);
