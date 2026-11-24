/**
 * CommandMenu 的样式定义：磨砂命令面板、多键帽芯片与高亮选项行。
 */
import { cva } from "class-variance-authority";

export const commandMenuTriggerVariants = cva([
  "inline-flex h-9 w-full max-w-xs cursor-pointer items-center justify-between gap-3 rounded-xl border border-solid border-border/85 bg-background px-3 font-sans text-sm text-muted-foreground outline-none",
  "shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,background-color,color,box-shadow] duration-(--ui-duration-fast)",
  "hover:border-foreground/22 hover:bg-card hover:text-foreground",
  "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  "dark:border-white/12 dark:bg-card/90 dark:hover:border-white/22 dark:hover:bg-card",
]);

export const commandMenuDialogVariants = cva(
  [
    "fixed top-[15vh] left-1/2 z-50 m-0 w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden",
    "rounded-2xl border border-solid border-border/80 bg-popover/96 p-0 text-popover-foreground backdrop-blur-xl outline-none",
    "shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18),0_4px_16px_-4px_rgba(0,0,0,0.06)]",
    "dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_28px_72px_-12px_rgba(0,0,0,0.78)]",
  ],
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const commandMenuItemVariants = cva([
  "group/cmd flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none select-none",
  "transition-colors duration-(--ui-duration-instant)",
  "data-[highlighted]:bg-accent/90 data-[highlighted]:text-accent-foreground dark:data-[highlighted]:bg-white/10",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
  "[&_mark]:rounded [&_mark]:bg-signal/15 [&_mark]:px-0.5 [&_mark]:font-medium [&_mark]:text-foreground [&_mark]:dark:bg-signal/25 [&_mark]:dark:text-info",
]);

export const commandMenuKbdVariants = cva(
  "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-solid border-border/85 bg-secondary/75 px-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:border-white/12 dark:bg-white/7 dark:shadow-[0_1px_0_rgba(0,0,0,0.35)]",
);
