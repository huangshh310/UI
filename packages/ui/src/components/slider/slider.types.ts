export type SliderValue = number | [number, number];

export interface SliderMark {
  value: number;
  label: string;
}

export interface SliderProps {
  /** 受控值：单数值或 [起, 止] 区间数组 */
  value?: SliderValue;
  /** 非受控初始值 */
  defaultValue?: SliderValue;
  /** 值变化回调 */
  onValueChange?: (value: SliderValue) => void;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步进 */
  step?: number;
  /** 字段标签 */
  label?: string;
  /** 是否在右上角展示当前值 */
  showValue?: boolean;
  /** 自定义数值格式化 */
  formatValue?: (val: number) => string;
  /** 底部刻度标记 */
  marks?: SliderMark[];
  /** 禁用态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
