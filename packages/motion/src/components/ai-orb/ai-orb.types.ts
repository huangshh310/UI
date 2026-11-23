export type AiOrbState = "idle" | "thinking" | "listening" | "speaking";
export type AiOrbVariant = "aurora" | "lattice" | "ring";
export type AiOrbSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AiOrbTone = "auto" | "signal" | "emerald" | "amber" | "mono";

export interface AiOrbProps {
  /** 智能体当前状态 */
  state?: AiOrbState;
  /** 视觉形态：流光球体（aurora）、3x3 像素点阵（lattice）或轨道光环（ring） */
  variant?: AiOrbVariant;
  /** 尺寸规格 */
  size?: AiOrbSize;
  /** 色彩基调：auto 随状态自动映射，也可指定固定语义色调 */
  tone?: AiOrbTone;
  /** 是否包裹在触感状态胶囊中 */
  pill?: boolean;
  /** 状态文案（默认按 state 自动匹配） */
  label?: string;
  /** 胶囊模式下的右侧元信息徽标（如模型名或耗时） */
  badge?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}
