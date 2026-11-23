/**
 * NeonEdgeButton：一束信号色的光沿着边框绕行的按钮，文字始终是主角。
 *
 * 做法：按钮留出一像素内边距作为「边框」，背后放一层旋转的锥形渐变，
 * 内层用实底盖住中间，只露出边缘的那一圈光。
 * 光是纯装饰；用户要求减少动态效果时停止旋转。
 */
import { cn } from "@matt-ui/utils";
import type { NeonEdgeButtonProps } from "./neon-edge-button.types.js";

/** 速度倍数为 1 时绕行一圈的秒数 */
const BASE_DURATION_S = 3;

export const NeonEdgeButton = ({
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
    className={cn(
      "relative isolate m-0 box-border inline-flex cursor-pointer appearance-none overflow-hidden rounded-full border-0 bg-border p-px",
      "font-sans text-sm font-medium whitespace-nowrap text-primary-foreground select-none",
      "transition-transform duration-(--ui-duration-fast) active:scale-[0.98]",
      "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
      "disabled:pointer-events-none disabled:opacity-50",
      glow &&
        "shadow-[0_4px_14px_-4px_color-mix(in_oklab,var(--ui-signal)_30%,transparent)] dark:shadow-[0_0_24px_-6px_var(--ui-signal)]",
      className,
    )}
    {...props}
  >
    <span
      aria-hidden="true"
      data-slot="neon-edge-light"
      style={{ animationDuration: `${BASE_DURATION_S / Math.max(speed, 0.1)}s` }}
      className="absolute inset-[-150%] -z-10 animate-spin bg-conic from-transparent from-78% to-signal motion-reduce:animate-none"
    />
    <span className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5">
      {children}
    </span>
  </button>
);
