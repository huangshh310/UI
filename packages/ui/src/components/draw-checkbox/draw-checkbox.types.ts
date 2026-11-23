/**
 * DrawCheckbox 的类型定义。
 */
import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import type {
  drawCheckboxBoxVariants,
  drawCheckboxItemVariants,
} from "./draw-checkbox.variants.js";

type BoxVariantProps = VariantProps<typeof drawCheckboxBoxVariants>;
type ItemVariantProps = VariantProps<typeof drawCheckboxItemVariants>;

export type DrawCheckboxVariant = NonNullable<ItemVariantProps["variant"]>;
export type DrawCheckboxShape = NonNullable<BoxVariantProps["shape"]>;
export type DrawCheckboxSize = NonNullable<BoxVariantProps["size"]>;
export type DrawCheckboxTone = NonNullable<BoxVariantProps["tone"]>;
export type DrawCheckboxControlPosition = "left" | "right";

export interface DrawCheckboxProps {
  id?: string;
  name?: string;
  value?: string;
  /** 容器外观：行内默认、C 端服务卡片、胶囊标签或轻盈列表行 */
  variant?: DrawCheckboxVariant;
  /** 复选框几何形状：圆角方块、全圆（Things/iOS 风格）或利落方角 */
  shape?: DrawCheckboxShape;
  /** 复选框与文案尺寸 */
  size?: DrawCheckboxSize;
  /** 勾选态语义色：墨色 primary、品牌信号色 signal 或警示 destructive */
  tone?: DrawCheckboxTone;
  /** 复选框位于文案左侧还是右侧（卡片/设置行常用 right） */
  controlPosition?: DrawCheckboxControlPosition;
  /** 复选框旁的标签文字 */
  label?: string;
  /** 标签下方的补充说明 */
  description?: string;
  /** 左侧图标或徽标（适合 card / pill / tile 变体） */
  icon?: ReactNode;
  /** 标签旁的轻盈徽章（如「推荐」「新功能」「PRO」） */
  badge?: ReactNode;
  /** 右侧附加信息（如价格「￥28/月」或截止时间） */
  trailing?: ReactNode;
  /** 待办清单划线模式：勾选后文案柔和淡出并添加删除线 */
  strikethrough?: boolean;
  /** 错误提示文案；传入后自动标记 aria-invalid 并播报 alert */
  error?: string;
  /** 受控勾选状态 */
  checked?: boolean;
  /** 非受控初始勾选状态，默认否 */
  defaultChecked?: boolean;
  /** 半选态（部分选中） */
  indeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
}
