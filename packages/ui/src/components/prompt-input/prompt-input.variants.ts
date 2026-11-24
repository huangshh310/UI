/**
 * PromptInput 的样式定义：极简发丝质感外壳、毛玻璃斜杠指令浮层与单焦点环。
 */
import { cva } from "class-variance-authority";

export const PROMPT_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const promptShellVariants = cva(
  "flex flex-col border border-solid text-card-foreground transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset",
  {
    variants: {
      variant: {
        default:
          "border-input bg-card shadow-xs hover:border-foreground/20 dark:hover:border-white/20",
        filled:
          "border-transparent bg-secondary/80 hover:bg-secondary focus-within:bg-card dark:bg-secondary dark:hover:bg-accent",
        elevated: "border-border bg-card shadow-md hover:border-input",
      },
      size: {
        sm: "p-2",
        md: "p-2.5",
        lg: "p-3",
      },
      radius: {
        lg: "rounded-2xl",
        xl: "rounded-3xl",
      },
      invalid: {
        true: "border-destructive hover:border-destructive focus-within:border-destructive focus-within:ring-destructive dark:border-destructive dark:hover:border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "xl",
      invalid: false,
    },
  },
);

export const promptTextareaVariants = cva(
  "max-h-[196px] w-full resize-none appearance-none border-0 bg-transparent font-sans leading-6 text-foreground outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "min-h-[36px] px-2 py-1.5 text-xs",
        md: "min-h-[42px] px-2.5 py-2 text-sm",
        lg: "min-h-[48px] px-3 py-2.5 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
