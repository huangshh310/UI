/**
 * AiLoadingState 的类型定义。
 */
import type { ComponentProps } from "react";

/** 3×3 像素矩阵加载器的 4 种经典运动编排（对标 BeautifulUI 01 Loading State） */
export type AiLoadingPattern = "drive" | "dots" | "orbit" | "surfer";

/** 展示形态：inline 无框内联、pill 发丝圆胶囊 */
export type AiLoadingVariant = "inline" | "pill";

/** 尺寸阶梯 */
export type AiLoadingSize = "sm" | "md" | "lg";

export interface AiLoadingStateProps extends Omit<ComponentProps<"output">, "children"> {
  /** 像素矩阵编排模式，默认 "drive" */
  pattern?: AiLoadingPattern;
  /** 外观变体，默认 "inline" */
  variant?: AiLoadingVariant;
  /** 尺寸大小，默认 "md" */
  size?: AiLoadingSize;
  /** 状态动词文案，默认 "思考中" */
  label?: string;
  /** 是否展示实时耗时计时器，默认 true */
  showElapsed?: boolean;
  /** 受控耗时秒数；省略时自动从 0.0s 实时递增 */
  elapsedSeconds?: number;
  /** 暂停动画与计时，默认 false */
  paused?: boolean;
}
