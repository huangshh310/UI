/**
 * Sheet 的样式定义：悬浮圆角磨砂抽屉与传统贴边抽屉的四方向变体。
 */
import { cva } from "class-variance-authority";

export const sheetBackdropVariants = cva(
  "fixed inset-0 z-50 transition-opacity duration-(--ui-duration-normal) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
  {
    variants: {
      backdrop: {
        blur: "bg-black/25 backdrop-blur-[6px] dark:bg-black/65",
        dim: "bg-black/40 dark:bg-black/72",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      backdrop: "blur",
    },
  },
);

export const sheetPanelVariants = cva(
  [
    "fixed z-50 flex flex-col overflow-hidden border-solid border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl outline-none",
    "dark:border-white/10 dark:bg-popover/95",
    "transition-[opacity,transform] duration-(--ui-duration-normal) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    "data-starting-style:opacity-0 data-ending-style:opacity-0",
  ],
  {
    variants: {
      side: {
        right: "",
        left: "",
        top: "",
        bottom: "",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
      inset: {
        true: "rounded-2xl border shadow-[0_24px_64px_-14px_rgba(0,0,0,0.18),0_4px_16px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_28px_72px_-14px_rgba(0,0,0,0.78)]",
        false:
          "shadow-[0_16px_48px_-12px_rgba(0,0,0,0.16)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.72)]",
      },
    },
    compoundVariants: [
      {
        side: "right",
        inset: true,
        class:
          "inset-y-3 right-3 h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] sm:inset-y-4 sm:right-4 sm:h-[calc(100dvh-2rem)] data-starting-style:translate-x-[calc(100%+2rem)] data-ending-style:translate-x-[calc(100%+2rem)]",
      },
      {
        side: "left",
        inset: true,
        class:
          "inset-y-3 left-3 h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] sm:inset-y-4 sm:left-4 sm:h-[calc(100dvh-2rem)] data-starting-style:-translate-x-[calc(100%+2rem)] data-ending-style:-translate-x-[calc(100%+2rem)]",
      },
      {
        side: "top",
        inset: true,
        class:
          "inset-x-3 top-3 mx-auto w-[calc(100vw-1.5rem)] sm:inset-x-4 sm:top-4 sm:w-[calc(100vw-2rem)] data-starting-style:-translate-y-[calc(100%+2rem)] data-ending-style:-translate-y-[calc(100%+2rem)]",
      },
      {
        side: "bottom",
        inset: true,
        class:
          "inset-x-3 bottom-3 mx-auto w-[calc(100vw-1.5rem)] sm:inset-x-4 sm:bottom-4 sm:w-[calc(100vw-2rem)] data-starting-style:translate-y-[calc(100%+2rem)] data-ending-style:translate-y-[calc(100%+2rem)]",
      },
      {
        side: "right",
        inset: false,
        class:
          "inset-y-0 right-0 h-full w-full border-l data-starting-style:translate-x-full data-ending-style:translate-x-full",
      },
      {
        side: "left",
        inset: false,
        class:
          "inset-y-0 left-0 h-full w-full border-r data-starting-style:-translate-x-full data-ending-style:-translate-x-full",
      },
      {
        side: "top",
        inset: false,
        class:
          "inset-x-0 top-0 w-full border-b data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
      },
      {
        side: "bottom",
        inset: false,
        class:
          "inset-x-0 bottom-0 w-full rounded-t-2xl border-t data-starting-style:translate-y-full data-ending-style:translate-y-full",
      },
      { side: "right", size: "sm", class: "sm:max-w-sm" },
      { side: "right", size: "md", class: "sm:max-w-md" },
      { side: "right", size: "lg", class: "sm:max-w-xl" },
      { side: "right", size: "xl", class: "sm:max-w-2xl" },
      { side: "left", size: "sm", class: "sm:max-w-sm" },
      { side: "left", size: "md", class: "sm:max-w-md" },
      { side: "left", size: "lg", class: "sm:max-w-xl" },
      { side: "left", size: "xl", class: "sm:max-w-2xl" },
      { side: "top", size: "sm", class: "max-h-64" },
      { side: "top", size: "md", class: "max-h-96" },
      { side: "top", size: "lg", class: "max-h-[75dvh]" },
      { side: "top", size: "xl", class: "max-h-[85dvh]" },
      { side: "bottom", size: "sm", class: "max-h-64" },
      { side: "bottom", size: "md", class: "max-h-96" },
      { side: "bottom", size: "lg", class: "max-h-[75dvh]" },
      { side: "bottom", size: "xl", class: "max-h-[85dvh]" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
      inset: true,
    },
  },
);
