/**
 * LockInput 的类型定义。
 */
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import type { lockInputShellVariants } from "./lock-input.variants.js";

type ShellVariantProps = VariantProps<typeof lockInputShellVariants>;

export type LockInputVariant = NonNullable<ShellVariantProps["variant"]>;
export type LockInputSize = NonNullable<ShellVariantProps["size"]>;
export type LockInputRadius = NonNullable<ShellVariantProps["radius"]>;
export type LockInputRingTone = NonNullable<ShellVariantProps["ringTone"]>;

export interface LockInputProps extends Omit<
  ComponentProps<"input">,
  "prefix" | "size" | "onCopy"
> {
  /** 输入框视觉风格：卡片描边、柔灰填充、极简透明或底部基线 */
  variant?: LockInputVariant;
  /** 输入框尺寸规格 */
  size?: LockInputSize;
  /** 外框圆角规格（underline 变体始终为直角底线） */
  radius?: LockInputRadius;
  /** 聚焦锁定环配色倾向：品牌信号色或纯中性单色 */
  ringTone?: LockInputRingTone;
  /** 是否使用等宽字体（适合项目 ID、API Key、Token 等内容） */
  mono?: boolean;
  /** 输入框上方标签，自动与输入框通过 htmlFor / id 关联 */
  label?: string;
  /** 标签右侧补充信息（如「必填」「已锁定」或辅助操作） */
  labelExtra?: ReactNode;
  /** 输入框下方辅助说明，无错误时通过 aria-describedby 关联 */
  hint?: string;
  /** 错误提示，传入后声明 aria-invalid 并优先作为描述信息 */
  error?: string;
  /** 锁定态（受控）：转为只读并显示锁图标 */
  locked?: boolean;
  /** 初始锁定态（配合 lockable 使用的非受控初始值） */
  defaultLocked?: boolean;
  /** 允许用户点击右侧锁图标切换锁定与可编辑状态 */
  lockable?: boolean;
  /** 锁定状态变化时的回调 */
  onLockedChange?: (locked: boolean) => void;
  /** 可编辑且存在内容时显示一键清空按钮 */
  clearable?: boolean;
  /** 点击清空按钮后的回调 */
  onClear?: () => void;
  /** 显示一键复制按钮（尤其适用于锁定态密钥或项目标识） */
  copyable?: boolean;
  /** 复制成功后的回调，参数为当前文本值 */
  onCopy?: (value: string) => void;
  /** 当 type="password" 时，显示明文/密文切换按钮 */
  revealable?: boolean;
  /** 在底部展示字数统计；传入 maxLength 时自动显示「当前 / 上限」 */
  showCount?: boolean;
  /** 右侧快捷键提示角标（如 "⌘K" 或 "/"） */
  shortcut?: string;
  /** 输入框左侧前缀内容（图标、协议头或单位等） */
  prefix?: ReactNode;
  /** 输入框右侧后缀内容 */
  suffix?: ReactNode;
  /** 外层容器自定义类名 */
  containerClassName?: string;
}
