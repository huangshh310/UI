/**
 * StretchSwitch 的类型定义。
 */
import type { ReactNode } from "react";

export type StretchSwitchTone = "primary" | "signal" | "success";
export type StretchSwitchSize = "sm" | "md" | "lg";
export type StretchSwitchVariant = "default" | "card" | "pill" | "row";

export interface StretchSwitchProps {
  id?: string;
  name?: string;
  value?: string;
  /** 开关旁的标签文字 */
  label?: string;
  /** 标签下方的补充说明 */
  description?: string;
  /** 标签前的装饰图标 */
  icon?: ReactNode;
  /** 标签旁的紧凑徽章（例如 "推荐" / "Beta" / "已锁定"） */
  badge?: string;
  /** 滑块内部可选微图标（例如日夜切换图标） */
  thumbIcon?: {
    checked?: ReactNode;
    unchecked?: ReactNode;
  };
  /** 视觉形态：基础行内、设置卡片、胶囊开关或全宽设置行 */
  variant?: StretchSwitchVariant;
  /** 开关尺寸：紧凑 sm、默认 md、大号 lg */
  size?: StretchSwitchSize;
  /** 开启态轨道底色：极简黑白 primary、品牌蓝 signal 或 iOS 翡翠绿 success */
  tone?: StretchSwitchTone;
  /** 开关控件相对标签的位置（card/row 默认在右侧，其余默认在左侧） */
  controlPosition?: "left" | "right";
  /** 受控开启状态 */
  checked?: boolean;
  /** 非受控初始开启状态，默认否 */
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}
