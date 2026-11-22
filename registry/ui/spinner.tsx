// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
import { cn } from "@/lib/utils";

export type SpinnerSize = "xs" | "sm" | "md" | "lg";

export interface SpinnerProps {
  /** 尺寸预设 */
  size?: SpinnerSize;
  /** 面向屏幕阅读器的加载状态描述 */
  label?: string;
  /** 自定义类名 */
  className?: string;
}
const SIZE_CLASS: Record<SpinnerSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

export const Spinner = ({ size = "md", label = "加载中", className }: SpinnerProps) => (
  <output
    aria-label={label}
    data-slot="spinner"
    data-size={size}
    className={cn("inline-flex items-center justify-center text-signal", className)}
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin motion-reduce:animate-none", SIZE_CLASS[size])}
    >
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <path
        d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </output>
);
