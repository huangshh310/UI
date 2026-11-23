/**
 * NumberInput 的样式定义：发丝边框与单一焦点环，支持 default / filled / stepper 三种形态与三档尺寸。
 */
import { cva } from "class-variance-authority";

export const numberGroupVariants = cva(
  "inline-flex w-full items-center overflow-hidden rounded-xl border border-solid transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input/50 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22",
        filled:
          "border-transparent bg-secondary/75 hover:bg-secondary focus-within:bg-background dark:bg-white/[0.07] dark:hover:bg-white/[0.11] dark:focus-within:bg-card",
        stepper:
          "border-input/50 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22",
      },
      size: {
        sm: "h-8 rounded-lg",
        md: "h-9.5 rounded-xl",
        lg: "h-11 rounded-xl",
      },
      invalid: {
        true: "border-destructive hover:border-destructive focus-within:border-destructive focus-within:ring-destructive dark:border-destructive dark:hover:border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      invalid: false,
    },
  },
);

export const numberStepButtonVariants = cva(
  "inline-flex h-full shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      size: {
        sm: "w-7.5",
        md: "w-9",
        lg: "w-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const numberInputFieldVariants = cva(
  "h-full min-w-0 flex-1 border-0 bg-transparent font-mono font-medium text-foreground tabular-nums outline-none",
  {
    variants: {
      variant: {
        default: "px-2 text-center",
        filled: "px-2 text-center",
        stepper: "px-3 text-left",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const NUMBER_STACKED_STEP_BTN =
  "flex flex-1 cursor-pointer items-center justify-center border-0 bg-transparent px-2 text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-40";
