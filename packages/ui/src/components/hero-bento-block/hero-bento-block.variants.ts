/**
 * HeroBentoBlock 的样式变体与默认背书成员配置。
 */
import { cva } from "class-variance-authority";

export const HERO_TEAMS = [
  { id: "1", name: "林知远", role: "前端架构", initials: "林", status: "online" as const },
  { id: "2", name: "周宁", role: "设计系统", initials: "周", status: "online" as const },
  { id: "3", name: "陈屿", role: "交互设计", initials: "陈" },
  { id: "4", name: "许澄", role: "质量工程", initials: "许" },
];

export const heroFrameVariants = cva(
  "@container relative flex w-full flex-col overflow-hidden rounded-[26px] border border-solid",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-card shadow-xs dark:border-white/10",
        spotlight:
          "border-border/80 bg-card shadow-md dark:border-white/12 dark:shadow-[0_20px_48px_rgba(0,0,0,0.42)]",
        minimal:
          "border-border/75 bg-secondary/25 shadow-none dark:border-white/10 dark:bg-card/80",
      },
      compact: {
        true: "gap-5 p-5 sm:p-6",
        false: "gap-7 p-6 sm:p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      compact: false,
    },
  },
);

export const heroHeaderVariants = cva("relative z-10 flex flex-col gap-4", {
  variants: {
    align: {
      start: "items-start text-left",
      center: "items-center text-center",
    },
  },
  defaultVariants: {
    align: "start",
  },
});

export const heroActionsVariants = cva("flex flex-wrap items-center gap-3 pt-1", {
  variants: {
    align: {
      start: "justify-start",
      center: "justify-center",
    },
  },
  defaultVariants: {
    align: "start",
  },
});
