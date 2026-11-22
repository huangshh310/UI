import type { HTMLAttributes } from "react";

export type SpotlightTone = "signal" | "neutral";

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 高光色调：钴蓝信号色或中性光晕 */
  tone?: SpotlightTone;
  /** 是否同时启用悬停微光边框 */
  glowBorder?: boolean;
}
