/**
 * OriginDropdown 的样式定义：锚点缩放磨砂面板、丝滑项胶囊悬停态与精细键帽。
 */
import { cva } from "class-variance-authority";

export const originDropdownTriggerVariants = cva(
  [
    "group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-solid font-sans font-medium outline-none",
    "transition-[background-color,border-color,color,box-shadow] duration-(--ui-duration-fast)",
    "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  ],
  {
    variants: {
      variant: {
        default:
          "border-border/85 bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/22 hover:bg-card dark:border-white/12 dark:bg-card/90 dark:hover:border-white/22 dark:hover:bg-card",
        subtle:
          "border-transparent bg-secondary/75 text-foreground hover:bg-secondary dark:bg-white/8 dark:hover:bg-white/12",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-accent/80 dark:hover:bg-white/10",
      },
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-9.5 px-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const originDropdownPopupVariants = cva(
  [
    "z-50 origin-(--transform-origin) overflow-hidden rounded-xl border border-solid border-border/80 bg-popover/96 p-1 text-popover-foreground backdrop-blur-xl outline-none",
    "shadow-[0_14px_36px_-8px_rgba(0,0,0,0.14),0_2px_8px_-2px_rgba(0,0,0,0.05)]",
    "dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.72)]",
    "transition-[opacity,transform] duration-(--ui-duration-fast) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    "data-starting-style:scale-[0.95] data-starting-style:opacity-0 data-ending-style:scale-[0.96] data-ending-style:opacity-0",
  ],
  {
    variants: {
      size: {
        sm: "min-w-44",
        md: "min-w-54",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const originDropdownItemVariants = cva(
  [
    "group/item flex cursor-pointer items-center justify-between gap-3 rounded-lg outline-none select-none",
    "transition-colors duration-(--ui-duration-instant) data-disabled:pointer-events-none data-disabled:opacity-45",
  ],
  {
    variants: {
      tone: {
        default:
          "text-foreground data-highlighted:bg-accent/85 data-highlighted:text-accent-foreground dark:data-highlighted:bg-white/10",
        signal: "text-info data-highlighted:bg-signal/12 dark:data-highlighted:bg-signal/20",
        destructive:
          "text-destructive data-highlighted:bg-destructive/10 dark:data-highlighted:bg-destructive/18",
      },
      size: {
        sm: "px-2 py-1.5 text-xs",
        md: "px-2.5 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "md",
    },
  },
);
