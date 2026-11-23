/**
 * OtpInput 的样式定义：四种槽位形态（独立描边 / shadcn 连体分组 / 柔灰填充 / 极简下划线）与三档尺寸。
 */
import type { OtpInputSize, OtpInputStatus, OtpInputVariant } from "./otp-input.types.js";

export const OTP_SLOT_BASE =
  "box-border appearance-none border border-solid text-center font-mono font-semibold text-foreground tabular-nums transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) outline-none focus-visible:z-10 data-disabled:pointer-events-none data-disabled:opacity-50";

export const OTP_SIZE_CLASSES: Record<OtpInputSize, string> = {
  sm: "h-10 w-9 text-sm",
  md: "h-12 w-10.5 text-base",
  lg: "h-14 w-12 text-lg",
};

export const OTP_VARIANT_CLASSES: Record<OtpInputVariant, string> = {
  default:
    "rounded-xl border-input/55 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/30 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-filled:border-foreground/35 dark:border-white/14 dark:hover:border-white/25",
  grouped:
    "rounded-none border-input/55 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/28 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-filled:bg-secondary/30 dark:border-white/14",
  filled:
    "rounded-xl border-transparent bg-secondary/80 hover:bg-secondary focus-visible:border-ring focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-filled:bg-secondary dark:bg-white/8 dark:hover:bg-white/12",
  underline:
    "rounded-none border-x-0 border-t-0 border-b-2 border-input/60 bg-transparent hover:border-foreground/45 focus-visible:border-ring data-filled:border-foreground",
};

export const OTP_STATUS_CLASSES: Record<OtpInputStatus, string> = {
  default: "",
  success:
    "border-emerald-500/80 bg-emerald-500/5 hover:border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 dark:border-emerald-500/80 dark:hover:border-emerald-400",
  error:
    "border-destructive bg-destructive/5 hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive dark:border-destructive dark:hover:border-destructive",
};
