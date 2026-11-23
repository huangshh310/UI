/**
 * NeonEdgeButton：一束信号色的光沿着边框绕行的按钮，文字始终是主角。
 *
 * 做法：按钮留出一像素内边距作为「边框」，背后放一层旋转的锥形渐变，
 * 内层用实底盖住中间，只露出边缘的那一圈光。
 * 光是纯装饰；用户要求减少动态效果时停止旋转。
 */
import { cn } from "@matt-ui/utils";
import type { NeonEdgeButtonProps } from "./neon-edge-button.types.js";
import {
  NEON_BEAM_CLASSES,
  neonEdgeInnerVariants,
  neonEdgeShellVariants,
} from "./neon-edge-button.variants.js";

/** 速度倍数为 1 时绕行一圈的秒数 */
const BASE_DURATION_S = 3;

export const NeonEdgeButton = ({
  variant = "primary",
  tone = "signal",
  size = "md",
  radius = "pill",
  speed = 1,
  glow = true,
  className,
  children,
  type = "button",
  ...props
}: NeonEdgeButtonProps) => (
  <button
    type={type}
    data-slot="neon-edge-button"
    data-variant={variant}
    data-tone={tone}
    data-size={size}
    data-radius={radius}
    className={cn(neonEdgeShellVariants({ radius, tone, glow }), className)}
    {...props}
  >
    <span
      aria-hidden="true"
      data-slot="neon-edge-light"
      style={{ animationDuration: `${BASE_DURATION_S / Math.max(speed, 0.1)}s` }}
      className={cn(
        "absolute inset-[-150%] -z-10 animate-spin bg-conic from-transparent from-76% motion-reduce:animate-none",
        NEON_BEAM_CLASSES[tone],
      )}
    />
    <span className={neonEdgeInnerVariants({ variant, size, radius })}>{children}</span>
  </button>
);
