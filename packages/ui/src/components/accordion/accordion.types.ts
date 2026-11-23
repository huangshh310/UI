import type { ReactNode } from "react";

export type AccordionVariant = "default" | "card" | "separated" | "divided" | "boxed";

export type AccordionIndicator = "chevron" | "plus";

export interface AccordionItem {
  value: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
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
  /** 外观变体：发丝分隔 / 盒装卡片 / 独立分卡（divided / boxed 为兼容别名） */
  variant?: AccordionVariant;
  /** 展开指示图标形态：箭头或加减号 */
  indicator?: AccordionIndicator;
  /** 自定义容器类名 */
  className?: string;
}
