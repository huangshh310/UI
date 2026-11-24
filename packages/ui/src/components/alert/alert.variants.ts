import { cva } from "class-variance-authority";

export const alertVariants = cva(
  "relative flex items-start gap-3 border border-solid px-4 py-3.5 text-sm transition-colors duration-(--ui-duration-fast)",
  {
    variants: {
      appearance: {
        soft: "rounded-xl shadow-xs",
        accent: "rounded-xl border-border/90 border-l-[3px] bg-card text-foreground shadow-xs",
        solid: "rounded-xl shadow-sm [&_[data-slot=alert-icon]]:text-current",
        banner: "rounded-none border-x-0 border-y py-3 shadow-none",
      },
      variant: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        destructive: "",
      },
    },
    compoundVariants: [
      // soft 与 banner 共用低饱和语义底色
      {
        appearance: ["soft", "banner"],
        variant: "neutral",
        class:
          "border-border bg-card text-foreground [&_[data-slot=alert-icon]]:text-muted-foreground",
      },
      {
        appearance: ["soft", "banner"],
        variant: "info",
        class:
          "border-transparent bg-signal/8 text-foreground [&_[data-slot=alert-icon]]:text-info dark:bg-signal/16",
      },
      {
        appearance: ["soft", "banner"],
        variant: "success",
        class:
          "border-transparent bg-emerald-500/10 text-foreground [&_[data-slot=alert-icon]]:text-emerald-700 dark:bg-emerald-500/14 dark:[&_[data-slot=alert-icon]]:text-emerald-400",
      },
      {
        appearance: ["soft", "banner"],
        variant: "warning",
        class:
          "border-transparent bg-amber-500/12 text-foreground [&_[data-slot=alert-icon]]:text-amber-700 dark:bg-amber-500/15 dark:[&_[data-slot=alert-icon]]:text-amber-400",
      },
      {
        appearance: ["soft", "banner"],
        variant: "destructive",
        class:
          "border-transparent bg-destructive/8 text-foreground [&_[data-slot=alert-icon]]:text-destructive dark:bg-destructive/14",
      },
      // accent：干净卡片底配 3px 左侧语义强调条
      {
        appearance: "accent",
        variant: "neutral",
        class: "border-l-foreground/45 [&_[data-slot=alert-icon]]:text-foreground/75",
      },
      {
        appearance: "accent",
        variant: "info",
        class: "border-l-signal [&_[data-slot=alert-icon]]:text-info",
      },
      {
        appearance: "accent",
        variant: "success",
        class:
          "border-l-emerald-600 dark:border-l-emerald-400 [&_[data-slot=alert-icon]]:text-emerald-700 dark:[&_[data-slot=alert-icon]]:text-emerald-400",
      },
      {
        appearance: "accent",
        variant: "warning",
        class:
          "border-l-amber-500 dark:border-l-amber-400 [&_[data-slot=alert-icon]]:text-amber-700 dark:[&_[data-slot=alert-icon]]:text-amber-400",
      },
      {
        appearance: "accent",
        variant: "destructive",
        class: "border-l-destructive [&_[data-slot=alert-icon]]:text-destructive",
      },
      // solid：实色高强调，双主题满足 WCAG AA 对比度
      {
        appearance: "solid",
        variant: "neutral",
        class: "border-primary bg-primary text-primary-foreground",
      },
      {
        appearance: "solid",
        variant: "info",
        class: "border-signal bg-signal text-signal-foreground",
      },
      {
        appearance: "solid",
        variant: "success",
        class:
          "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-800 dark:bg-emerald-800 dark:text-emerald-50",
      },
      {
        appearance: "solid",
        variant: "warning",
        class: "border-amber-400 bg-amber-400 text-amber-950",
      },
      {
        appearance: "solid",
        variant: "destructive",
        class:
          "border-red-700 bg-red-700 text-white dark:border-red-800 dark:bg-red-800 dark:text-red-50",
      },
    ],
    defaultVariants: {
      appearance: "soft",
      variant: "info",
    },
  },
);
