/**
 * AuthBlock 的样式变体与共享展示配置。
 */
import { cva } from "class-variance-authority";

export const authCardVariants = cva(
  "w-full border border-solid transition-shadow duration-(--ui-duration-fast)",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-card shadow-sm dark:border-white/10",
        elevated:
          "border-border/80 bg-card shadow-lg dark:border-white/12 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
        subtle: "border-border/70 bg-secondary/35 shadow-none dark:border-white/10 dark:bg-card/80",
      },
      compact: {
        true: "max-w-[360px]",
        false: "max-w-[400px]",
      },
    },
    defaultVariants: {
      variant: "default",
      compact: false,
    },
  },
);

export const authSplitFrameVariants = cva(
  "grid w-full max-w-4xl grid-cols-1 gap-4 rounded-[24px] border border-solid md:grid-cols-2",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-card shadow-sm dark:border-white/10",
        elevated:
          "border-border/80 bg-card shadow-lg dark:border-white/12 dark:shadow-[0_20px_48px_rgba(0,0,0,0.45)]",
        subtle: "border-border/70 bg-secondary/30 shadow-none dark:border-white/10 dark:bg-card/80",
      },
      compact: {
        true: "p-2.5",
        false: "p-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      compact: false,
    },
  },
);

export const authShowcaseVariants = cva(
  "flex flex-col justify-between gap-7 rounded-[18px] border border-solid border-border/80 bg-secondary/45 dark:border-white/10 dark:bg-white/[0.03]",
  {
    variants: {
      compact: {
        true: "p-5",
        false: "p-7",
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const AUTH_SHOWCASE_METRICS = [
  { value: "99.98%", label: "边缘 Registry 可用率" },
  { value: "WCAG AA", label: "双主题对比度门禁" },
] as const;
