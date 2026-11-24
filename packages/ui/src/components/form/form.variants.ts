/**
 * Form 模块化表单系统的样式定义：极简发丝边框、清晰单焦点环与柔和明暗层次。
 */
import { cva } from "class-variance-authority";

export const formVariants = cva("flex w-full max-w-md flex-col font-sans", {
  variants: {
    variant: {
      default: "",
      card: "rounded-2xl border border-solid border-border/85 bg-card p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]",
      subtle:
        "rounded-2xl border border-solid border-border/65 bg-secondary/35 p-5 dark:border-white/8 dark:bg-white/[0.03]",
    },
    density: {
      default: "gap-4",
      compact: "gap-3",
      relaxed: "gap-5",
    },
  },
  defaultVariants: {
    variant: "default",
    density: "default",
  },
});

export const formFieldVariants = cva("w-full", {
  variants: {
    layout: {
      vertical: "flex flex-col gap-1.5",
      horizontal:
        "grid grid-cols-1 gap-1.5 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-start sm:gap-x-4 sm:gap-y-1.5 [&>[data-slot=form-label]]:sm:pt-2 [&>[data-slot=form-description]]:sm:col-start-2 [&>[data-slot=form-error]]:sm:col-start-2",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
});

export const formControlVariants = cva(
  "w-full min-w-0 appearance-none border border-solid font-sans text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-invalid:border-destructive data-invalid:hover:border-destructive data-invalid:focus-visible:border-destructive data-invalid:focus-visible:ring-destructive dark:data-invalid:border-destructive dark:data-invalid:hover:border-destructive data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input bg-card shadow-2xs hover:border-foreground/22 dark:hover:border-white/22",
        filled:
          "border-transparent bg-secondary/75 hover:bg-secondary focus-visible:bg-card dark:bg-white/7 dark:hover:bg-white/11",
        ghost:
          "border-transparent bg-transparent shadow-none hover:bg-accent/55 focus-visible:bg-card",
      },
      size: {
        sm: "h-8.5 px-3 text-xs",
        md: "h-9.5 px-3.5 text-sm",
        lg: "h-11 px-4 text-sm",
      },
      radius: {
        md: "rounded-lg",
        lg: "rounded-xl",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md",
    },
  },
);

export const formTextareaSizeVariants = cva("h-auto resize-y leading-relaxed", {
  variants: {
    size: {
      sm: "min-h-14 px-3 py-1.5 text-xs",
      md: "min-h-18 px-3.5 py-2 text-sm",
      lg: "min-h-24 px-4 py-2.5 text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const formRadioGroupVariants = cva("w-full", {
  variants: {
    orientation: {
      vertical: "flex flex-col gap-2",
      horizontal: "grid grid-cols-1 gap-2 sm:grid-cols-2",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export const formRadioItemVariants = cva(
  "group flex cursor-pointer items-start gap-3 border border-solid font-sans select-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        card: "rounded-xl border-input bg-card p-3.5 shadow-2xs hover:border-foreground/22 hover:bg-accent/35 has-data-checked:border-signal/60 has-data-checked:bg-signal/8 has-data-checked:shadow-none dark:hover:border-white/22 dark:has-data-checked:border-signal/65",
        compact:
          "rounded-lg border-input bg-card px-3 py-2.5 shadow-2xs hover:border-foreground/22 hover:bg-accent/35 has-data-checked:border-signal/60 has-data-checked:bg-signal/8 has-data-checked:shadow-none dark:hover:border-white/22 dark:has-data-checked:border-signal/65",
        minimal:
          "rounded-lg border-transparent bg-transparent px-2 py-1.5 shadow-none hover:bg-accent/45 has-data-checked:bg-accent/55",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  },
);

export const formActionsVariants = cva("flex flex-wrap items-center gap-2.5 pt-1", {
  variants: {
    align: {
      start: "justify-start",
      end: "justify-end",
      between: "justify-between",
    },
  },
  defaultVariants: {
    align: "between",
  },
});
