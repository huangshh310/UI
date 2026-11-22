export type AiOrbState = "idle" | "thinking" | "listening" | "speaking";
export type AiOrbVariant = "aurora" | "lattice";
export type AiOrbSize = "sm" | "md" | "lg";

export interface AiOrbProps {
  /** 智能体当前状态 */
  state?: AiOrbState;
  /** 视觉形态：流光球体（aurora）或 3x3 像素点阵（lattice，参考 aicss.dev） */
  variant?: AiOrbVariant;
  /** 尺寸规格 */
  size?: AiOrbSize;
  /** 是否包裹在触感状态胶囊中 */
  pill?: boolean;
  /** 状态文案（默认按 state 自动匹配） */
  label?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}
