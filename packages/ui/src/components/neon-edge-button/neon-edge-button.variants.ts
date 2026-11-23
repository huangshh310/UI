/**
 * NeonEdgeButton 的样式定义：外框容器、内层表面、尺寸、圆角与边缘光色调。
 */
import { cva } from "class-variance-authority";

const SHELL_BASE = [
  "group relative isolate m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none overflow-hidden border-0 bg-border/80 p-px",
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none",
  "transition-[transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.98] motion-reduce:active:scale-100",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
].join(" ");

export const neonEdgeShellVariants = cva(SHELL_BASE, {
  variants: {
    radius: {
      pill: "rounded-full",
      default: "rounded-xl",
    },
    tone: {
      signal: "",
      emerald: "",
      amber: "",
      violet: "",
    },
    glow: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      tone: "signal",
      glow: true,
      class:
        "shadow-[0_4px_16px_-4px_color-mix(in_oklab,var(--ui-signal)_34%,transparent)] hover:shadow-[0_6px_22px_-4px_color-mix(in_oklab,var(--ui-signal)_46%,transparent)] dark:shadow-[0_0_24px_-6px_var(--ui-signal)]",
    },
    {
      tone: "emerald",
      glow: true,
      class:
        "shadow-[0_4px_16px_-4px_rgba(16,185,129,0.34)] hover:shadow-[0_6px_22px_-4px_rgba(16,185,129,0.46)] dark:shadow-[0_0_24px_-6px_rgba(16,185,129,0.85)]",
    },
    {
      tone: "amber",
      glow: true,
      class:
        "shadow-[0_4px_16px_-4px_rgba(245,158,11,0.34)] hover:shadow-[0_6px_22px_-4px_rgba(245,158,11,0.46)] dark:shadow-[0_0_24px_-6px_rgba(245,158,11,0.85)]",
    },
    {
      tone: "violet",
      glow: true,
      class:
        "shadow-[0_4px_16px_-4px_rgba(139,92,246,0.34)] hover:shadow-[0_6px_22px_-4px_rgba(139,92,246,0.46)] dark:shadow-[0_0_24px_-6px_rgba(139,92,246,0.85)]",
    },
  ],
  defaultVariants: {
    radius: "pill",
    tone: "signal",
    glow: true,
  },
});

export const neonEdgeInnerVariants = cva(
  "inline-flex w-full items-center justify-center gap-2 transition-colors duration-(--ui-duration-fast) [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground group-hover:bg-primary/92",
        surface: "bg-card text-foreground group-hover:bg-accent/70 dark:bg-card",
        signal: "bg-signal text-signal-foreground group-hover:bg-signal/92",
      },
      size: {
        sm: "h-8 px-3.5 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-11 px-6 text-[15px]",
      },
      radius: {
        pill: "rounded-full",
        default: "rounded-[calc(var(--ui-radius-xl)-1px)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      radius: "pill",
    },
  },
);

/** 边缘旋转光束的色调类名 */
export const NEON_BEAM_CLASSES = {
  signal: "to-signal",
  emerald: "to-emerald-500",
  amber: "to-amber-500",
  violet: "to-violet-500",
} as const;
