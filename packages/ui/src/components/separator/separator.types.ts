export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorLabelAlign = "center" | "left" | "right";
export type SeparatorVariant = "solid" | "dashed" | "gradient";

export interface SeparatorProps {
  /** 分隔方向 */
  orientation?: SeparatorOrientation;
  /** 仅水平模式下生效：嵌入的辅助标签文案 */
  label?: string;
  /** 标签水平对齐方式（仅传入 label 时生效） */
  labelAlign?: SeparatorLabelAlign;
  /** 线条视觉样式：实线 / 虚线 / 渐变消隐 */
  variant?: SeparatorVariant;
  /** 自定义类名 */
  className?: string;
}
