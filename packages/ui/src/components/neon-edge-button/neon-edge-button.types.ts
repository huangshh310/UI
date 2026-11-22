/**
 * NeonEdgeButton 的类型定义。
 */
import type { ComponentProps } from "react";

export interface NeonEdgeButtonProps extends ComponentProps<"button"> {
  /** 边缘光绕行速度的倍数，默认 1（约 3 秒一圈） */
  speed?: number;
  /** 是否带一圈静态的微光，默认开启 */
  glow?: boolean;
}
