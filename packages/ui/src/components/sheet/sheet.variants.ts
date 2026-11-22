import { cva } from "class-variance-authority";

export const sheetPanelVariants = cva(
  [
    "fixed z-50 flex flex-col overflow-hidden border-solid border-border bg-popover text-popover-foreground outline-none",
    "transition-[opacity,transform] duration-(--ui-duration-normal) ease-(--ui-ease-out) motion-reduce:transition-none",
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
      },
      inset: {
        true: "rounded-2xl border shadow-xl",
        false: "shadow-lg",
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
      { side: "left", size: "sm", class: "sm:max-w-sm" },
      { side: "left", size: "md", class: "sm:max-w-md" },
      { side: "left", size: "lg", class: "sm:max-w-xl" },
      { side: "top", size: "sm", class: "max-h-64" },
      { side: "top", size: "md", class: "max-h-96" },
      { side: "top", size: "lg", class: "max-h-[75dvh]" },
      { side: "bottom", size: "sm", class: "max-h-64" },
      { side: "bottom", size: "md", class: "max-h-96" },
      { side: "bottom", size: "lg", class: "max-h-[75dvh]" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
      inset: true,
    },
  },
);
