/**
 * 展示页用到的常量。端到端测试通过这些名称定位按钮。
 */
import type { ButtonSize, ButtonVariant } from "@matt-ui/ui";

export const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
  "signal",
];

/** 带文字的尺寸；icon 尺寸单独展示 */
export const TEXT_SIZES: Exclude<ButtonSize, "icon">[] = ["sm", "md", "lg"];

export const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];
