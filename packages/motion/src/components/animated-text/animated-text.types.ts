/** 排版动效模式：逐段显现 / 短语轮播 / 流光思考 */
export type AnimatedTextMode = "reveal" | "cycle" | "shimmer";

/** 入场与切换编排风格 */
export type AnimatedTextVariant = "fade-up" | "blur-in" | "slide" | "wave";

/** 语义文字色调 */
export type AnimatedTextTone = "default" | "muted" | "signal" | "emerald";

/** 排版字号档位 */
export type AnimatedTextSize = "sm" | "md" | "lg" | "xl";

export interface AnimatedTextProps {
  /** 要展示的文本；cycle 模式下可传 phrases 数组 */
  text?: string;
  /** cycle 模式下轮播的短语列表 */
  phrases?: string[];
  /** 动效模式：逐段显现 / 词句轮播 / 流光思考，默认 reveal */
  mode?: AnimatedTextMode;
  /** reveal 与 cycle 模式的动效编排风格，默认 fade-up */
  variant?: AnimatedTextVariant;
  /** 语义色调；shimmer 默认 muted，其余默认 default */
  tone?: AnimatedTextTone;
  /** 可选排版字号档位；不传时继承父级字号 */
  size?: AnimatedTextSize;
  /** cycle 轮播间隔（毫秒），默认 2400 */
  intervalMs?: number;
  /** reveal 逐段错峰间隔（毫秒），默认 32 */
  staggerMs?: number;
  /** 自定义类名 */
  className?: string;
}
