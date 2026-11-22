import type { ReactElement, ReactNode } from "react";

export interface PeekCardMetric {
  label: string;
  value: string;
}

export interface PeekCardIdentity {
  initials: string;
  name: string;
  meta?: string;
}

export interface PeekCardProps {
  /** 自定义触发元素；省略时使用 triggerLabel + href 渲染语义链接 */
  trigger?: ReactElement;
  /** 默认触发链接文案 */
  triggerLabel?: string;
  /** 默认触发链接地址 */
  href?: string;
  /** 卡片主标题 */
  title: string;
  /** 卡片副标题 */
  subtitle?: string;
  /** 右上角核心数值或徽章 */
  value?: string;
  /** 嵌入身份信息块 */
  identity?: PeekCardIdentity;
  /** 键值对元信息 */
  metrics?: PeekCardMetric[];
  /** 底部左侧辅助信息 */
  footerLeft?: string;
  /** 底部右侧状态文案 */
  status?: string;
  /** 自定义扩展内容 */
  children?: ReactNode;
  /** 弹出方向 */
  side?: "top" | "bottom" | "left" | "right";
  /** 对齐方式 */
  align?: "start" | "center" | "end";
  /** 悬停触发延迟（毫秒） */
  delay?: number;
  /** 受控显示状态 */
  open?: boolean;
  /** 状态回调 */
  onOpenChange?: (open: boolean) => void;
  /** 面板自定义类名 */
  className?: string;
}
