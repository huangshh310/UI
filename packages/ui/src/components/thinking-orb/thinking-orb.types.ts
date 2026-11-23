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

export interface ThinkingOrbProps {
  /** 智能体当前认知状态预设，默认 "working" */
  state?: ThinkingOrbState;
  /** 球体直径（像素），默认 64 */
  size?: number;
  /** 动效速率倍率，默认 1 */
  speed?: number;
  /** 强制指定明暗极性（true 为深底亮粒，false 为浅底墨粒）；省略时自动跟随页面主题 */
  dark?: boolean;
  /** 暂停当前轨道动画（保留粒子当前坐标） */
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}
