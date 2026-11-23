import type { ReactNode } from "react";

export type SegmentedControlVariant = "default" | "glass" | "signal";

export type SegmentedControlSize = "sm" | "md" | "lg";

export interface SegmentedControlItem {
  value: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** 选项列表 */
  items: SegmentedControlItem[];
  /** 受控当前值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 切换回调 */
  onValueChange?: (value: string) => void;
  /** 视觉风格：默认凹槽 / 磨砂玻璃 / 信号蓝高亮 */
  variant?: SegmentedControlVariant;
  /** 尺寸规格 */
  size?: SegmentedControlSize;
  /** 是否撑满容器宽度均分各分段 */
  fullWidth?: boolean;
  /** 控件无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
