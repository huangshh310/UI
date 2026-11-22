export interface SegmentedControlItem {
  value: string;
  label: string;
  badge?: string;
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
  /** 控件无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
