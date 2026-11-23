/**
 * ResizablePanels 的样式定义：发丝分栏容器与 pill / line / dots 三种精密分隔手柄。
 */
import { cva } from "class-variance-authority";

export const resizableRootVariants = cva("flex h-56 w-full overflow-hidden", {
  variants: {
    variant: {
      card: "rounded-2xl border border-solid border-border/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/12",
      flush: "rounded-none border-0 bg-transparent",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    variant: "card",
    orientation: "horizontal",
  },
});

export const resizableHandleVariants = cva(
  "group relative flex shrink-0 items-center justify-center bg-border/85 transition-colors duration-(--ui-duration-fast) outline-none hover:bg-signal/65 focus-visible:bg-signal data-[dragging]:bg-signal dark:bg-white/12 dark:hover:bg-signal/75",
  {
    variants: {
      orientation: {
        horizontal: "w-px cursor-col-resize px-1 bg-clip-content",
        vertical: "h-px cursor-row-resize py-1 bg-clip-content",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export const resizablePillGripVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-solid border-border/80 bg-card text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-[transform,background-color,border-color,color] duration-(--ui-duration-fast) group-hover:scale-110 group-hover:border-signal/60 group-hover:bg-signal group-hover:text-signal-foreground group-focus-visible:border-signal group-focus-visible:bg-signal group-focus-visible:text-signal-foreground group-data-[dragging]:scale-110 group-data-[dragging]:border-signal group-data-[dragging]:bg-signal group-data-[dragging]:text-signal-foreground dark:border-white/15",
  {
    variants: {
      orientation: {
        horizontal: "h-8 w-3.5",
        vertical: "h-3.5 w-8",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export const resizableLineGripVariants = cva(
  "pointer-events-none rounded-full bg-transparent transition-[background-color,transform] duration-(--ui-duration-fast) group-hover:bg-signal group-focus-visible:bg-signal group-data-[dragging]:bg-signal",
  {
    variants: {
      orientation: {
        horizontal: "h-full w-0.5",
        vertical: "h-0.5 w-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export const resizableDotsGripVariants = cva(
  "pointer-events-none flex items-center justify-center gap-0.5 rounded-full bg-card/90 px-1 py-1 text-muted-foreground ring-1 ring-border/75 transition-colors duration-(--ui-duration-fast) group-hover:text-signal group-hover:ring-signal/50 group-focus-visible:text-signal group-focus-visible:ring-signal group-data-[dragging]:text-signal dark:ring-white/15",
  {
    variants: {
      orientation: {
        horizontal: "flex-col py-1.5",
        vertical: "flex-row px-1.5",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);
