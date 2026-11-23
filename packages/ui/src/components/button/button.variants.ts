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
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap no-underline select-none",
  // 交互：C 端丝滑微缩放按压触感
  "cursor-pointer transition-[background-color,border-color,color,transform,box-shadow] duration-(--ui-duration-fast) ease-out active:scale-[0.98] motion-reduce:active:scale-100",
  // 焦点环只在键盘聚焦时出现
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "focus-visible:outline-solid",
  // 禁用
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
  // 加载中：不响应指针，悬停与按下的视觉反馈也随之消失
  "data-loading:pointer-events-none",
  // 内部图标的统一尺寸
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
].join(" ");

export const buttonVariants = cva(BASE_CLASSES, {
  variants: {
    variant: {
      // 主要操作：高对比纯黑/纯白实底，极轻接地微影
      primary: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
      // 次要操作：柔和纯中性浅灰
      secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
      // 描边：纯白/黑曜石底配 1px 丝滑发丝线
      outline:
        "border-border bg-card text-foreground shadow-xs hover:border-foreground/20 hover:bg-accent",
      // 幽灵：静置态无底色，悬停切入弱反馈面
      ghost: "bg-transparent text-foreground hover:bg-accent",
      // 破坏性操作
      destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
      // 链接外观：下划线在悬停时加粗
      link: "bg-transparent text-foreground underline decoration-border decoration-1 underline-offset-4 hover:decoration-foreground",
      // 信号：克制纯粹的 BoardUI 品牌蓝，带极微顶边高光
      signal:
        "bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(0,0,0,0.08)] hover:bg-signal/92",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-9.5 px-4 text-sm",
      lg: "h-11 rounded-xl px-6 text-[15px]",
      // 只含图标的方形按钮
      icon: "size-9.5 p-0",
    },
  },
  compoundVariants: [
    // 链接外观不占据按钮的高度与内边距，随文字流排布
    { variant: "link", class: "h-auto rounded-none px-0 active:scale-100" },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
