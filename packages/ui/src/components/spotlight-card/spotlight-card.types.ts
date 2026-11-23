import type { HTMLAttributes } from "react";

/** 径向高光与微光边框色调 */
export type SpotlightTone = "signal" | "neutral" | "emerald" | "violet";

/** 卡片材质与层级变体 */
export type SpotlightCardVariant = "default" | "elevated" | "glass" | "dark";

/** 卡片内边距档位 */
export type SpotlightCardPadding = "none" | "sm" | "md" | "lg";

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 卡片表面材质：默认发丝边框 / 抬升阴影 / 磨砂玻璃 / 深邃黑曜石 */
  variant?: SpotlightCardVariant;
  /** 高光色调：中性光晕 / 钴蓝信号 / 翡翠绿 / 紫罗兰 */
  tone?: SpotlightTone;
  /** 内边距档位，默认 md */
  padding?: SpotlightCardPadding;
  /** 是否启用指针跟随 1px 镜面微光边框，默认 true */
  glowBorder?: boolean;
  /** 径向高光扩散半径（px），默认 260 */
  spotlightSize?: number;
}
