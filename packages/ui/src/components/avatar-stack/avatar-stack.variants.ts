/**
 * AvatarStack 的样式定义：多档尺寸、背景融合描边环、叠放间距与在线状态指示点。
 */
import { cva } from "class-variance-authority";

export const avatarStackGroupVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
    },
    spacing: {
      tight: "",
      normal: "",
      loose: "",
    },
  },
  compoundVariants: [
    { size: "xs", spacing: "tight", class: "-space-x-2" },
    { size: "xs", spacing: "normal", class: "-space-x-1.5" },
    { size: "xs", spacing: "loose", class: "-space-x-0.5" },
    { size: "sm", spacing: "tight", class: "-space-x-2.5" },
    { size: "sm", spacing: "normal", class: "-space-x-2" },
    { size: "sm", spacing: "loose", class: "-space-x-1" },
    { size: "md", spacing: "tight", class: "-space-x-3.5" },
    { size: "md", spacing: "normal", class: "-space-x-2.5" },
    { size: "md", spacing: "loose", class: "-space-x-1.5" },
    { size: "lg", spacing: "tight", class: "-space-x-4" },
    { size: "lg", spacing: "normal", class: "-space-x-3" },
    { size: "lg", spacing: "loose", class: "-space-x-1.5" },
  ],
  defaultVariants: {
    size: "md",
    spacing: "normal",
  },
});

export const avatarStackItemVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 p-0 shadow-[0_1px_3px_rgba(0,0,0,0.08)] outline-none transition-[transform,box-shadow] duration-(--ui-duration-fast) ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-[11px]",
        md: "size-10 text-xs",
        lg: "size-12 text-sm",
      },
      ring: {
        card: "bg-card ring-2 ring-card",
        background: "bg-background ring-2 ring-background",
        none: "bg-card ring-0",
      },
      interactive: {
        true: "hover:z-20 hover:-translate-y-1 hover:scale-108 hover:shadow-[0_6px_14px_-4px_rgba(0,0,0,0.18)]",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      ring: "card",
      interactive: true,
    },
  },
);

export const avatarStackStatusVariants = cva("absolute z-10 rounded-full", {
  variants: {
    status: {
      online: "bg-emerald-500",
      busy: "bg-rose-500",
      away: "bg-amber-500",
      offline: "bg-muted-foreground/60",
    },
    size: {
      xs: "right-0 bottom-0 size-1.5 ring-[1.5px]",
      sm: "right-0 bottom-0 size-2 ring-2",
      md: "right-0.5 bottom-0.5 size-2.5 ring-2",
      lg: "right-0.5 bottom-0.5 size-3 ring-2",
    },
    ring: {
      card: "ring-card",
      background: "ring-background",
      none: "ring-card",
    },
  },
  defaultVariants: {
    status: "online",
    size: "md",
    ring: "card",
  },
});
