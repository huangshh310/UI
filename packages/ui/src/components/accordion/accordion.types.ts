import type { ReactNode } from "react";

export type AccordionVariant = "divided" | "boxed";

export interface AccordionItem {
  value: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  /** 折叠面板条目 */
  items: AccordionItem[];
  /** 是否允许同时展开多项 */
  multiple?: boolean;
  /** 受控展开项值数组 */
  value?: string[];
  /** 初始展开项值数组 */
  defaultValue?: string[];
  /** 展开项变化回调 */
  onValueChange?: (value: string[]) => void;
  /** 外观变体：发丝分隔或卡片盒装 */
  variant?: AccordionVariant;
  /** 自定义容器类名 */
  className?: string;
}
