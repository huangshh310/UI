export type AnimatedTextMode = "reveal" | "cycle" | "shimmer";

export interface AnimatedTextProps {
  /** 要展示的文本；cycle 模式下可传 phrases 数组 */
  text?: string;
  /** cycle 模式下轮播的短语列表 */
  phrases?: string[];
  /** 动效模式：逐段显现 / 词句轮播 / 流光思考 */
  mode?: AnimatedTextMode;
  /** cycle 轮播间隔（毫秒） */
  intervalMs?: number;
  /** 自定义类名 */
  className?: string;
}
