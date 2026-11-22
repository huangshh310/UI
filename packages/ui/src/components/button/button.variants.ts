/**
 * Button 的样式定义：基础样式、变体与尺寸。
 *
 * 样式表不包含 Tailwind 的 Preflight，所以基础样式里显式声明了盒模型、边框、字体等，
 * 不依赖浏览器默认样式已被重置。颜色、圆角、时长全部取自 Design Token。
 */
import { cva } from "class-variance-authority";

/** 所有变体共用的基础样式 */
const BASE_CLASSES = [
  // 布局与盒模型
  "m-0 box-border inline-flex shrink-0 items-center justify-center gap-2",
  "appearance-none rounded-lg border border-solid border-transparent",
  // 文字
  "font-sans font-medium whitespace-nowrap no-underline select-none",
  // 交互：按下时下沉一像素，给出触感反馈
  "cursor-pointer transition-colors duration-(--ui-duration-fast) ease-out active:translate-y-px",
  // 焦点环只在键盘聚焦时出现
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "focus-visible:outline-solid",
  // 禁用
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  // 加载中：不响应指针，悬停与按下的视觉反馈也随之消失
  "data-loading:pointer-events-none",
  // 内部图标的统一尺寸
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
].join(" ");

export const buttonVariants = cva(BASE_CLASSES, {
  variants: {
    variant: {
      // 主要操作：墨色实底配顶部微高光
      primary:
        "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.12)] hover:bg-primary/90",
      // 次要操作：浅底配触感阴影
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-accent",
      // 描边：发丝边线加顶部内高光与微唇边，悬停提亮
      outline:
        "border-border bg-background text-foreground shadow-sm hover:border-foreground/20 hover:bg-accent dark:bg-card",
      // 幽灵：平时无底色，悬停才出现
      ghost: "bg-transparent text-foreground hover:bg-accent",
      // 破坏性操作
      destructive:
        "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(0,0,0,0.12)] hover:bg-destructive/90",
      // 链接外观：下划线在悬停时加粗
      link: "bg-transparent text-foreground underline decoration-1 underline-offset-4 hover:decoration-2",
      // 信号：全页面最需要被看到的那一个操作，带顶部高光与克制钴蓝柔晕
      signal:
        "bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.12),0_6px_16px_-6px_color-mix(in_oklab,var(--ui-signal)_45%,transparent)] hover:bg-signal/92",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-11 px-6 text-base",
      // 只含图标的方形按钮
      icon: "size-9 p-0",
    },
  },
  compoundVariants: [
    // 链接外观不占据按钮的高度与内边距，随文字流排布
    { variant: "link", class: "h-auto rounded-none px-0 active:translate-y-0" },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
