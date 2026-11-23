import type { CSSProperties } from "react";

/** ThinkingOrb 支持的 9 种智能体认知状态 */
export type ThinkingOrbState =
  | "working"
  | "searching"
  | "solving"
  | "listening"
  | "connecting"
  | "weaving"
  | "composing"
  | "breathing"
  | "shaping";

/** ThinkingOrb 外观变体：极简无框、毛玻璃表圈、环境光晕 */
export type ThinkingOrbVariant = "minimal" | "framed" | "halo";

/** 认知状态文字标签相对球体的位置 */
export type ThinkingOrbLabelPlacement = "bottom" | "right";

export interface ThinkingOrbProps {
  /** 智能体当前认知状态预设，默认 "working" */
  state?: ThinkingOrbState;
  /** 外观风格：minimal 无框纯粒子、framed 玻璃表圈、halo 柔光氛围环，默认 "minimal" */
  variant?: ThinkingOrbVariant;
  /** 球体直径（像素），默认 64 */
  size?: number;
  /** 动效速率倍率，默认 1 */
  speed?: number;
  /** 强制指定明暗极性（true 为深底亮粒，false 为浅底墨粒）；省略时自动跟随页面主题 */
  dark?: boolean;
  /** 暂停当前轨道动画（保留粒子当前坐标） */
  paused?: boolean;
  /** 是否显示当前认知状态说明胶囊，默认 false */
  showLabel?: boolean;
  /** 自定义状态展示文案；传入时会自动展示状态说明 */
  label?: string;
  /** 状态说明的排布方位，默认 "bottom" */
  labelPlacement?: ThinkingOrbLabelPlacement;
  /** 是否启用轻微悬浮反馈（适合语音/助手触发器），默认 false */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}
