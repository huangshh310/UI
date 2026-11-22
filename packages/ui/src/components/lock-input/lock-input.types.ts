/**
 * LockInput 的类型定义。
 */
import type { ComponentProps, ReactNode } from "react";

export interface LockInputProps extends Omit<ComponentProps<"input">, "prefix"> {
  /** 输入框上方标签，自动与输入框通过 htmlFor / id 关联 */
  label?: string;
  /** 输入框下方辅助说明，无错误时通过 aria-describedby 关联 */
  hint?: string;
  /** 错误提示，传入后声明 aria-invalid 并优先作为描述信息 */
  error?: string;
  /** 锁定态：转为只读并显示锁图标 */
  locked?: boolean;
  /** 输入框左侧前缀内容（图标或单位等） */
  prefix?: ReactNode;
  /** 输入框右侧后缀内容 */
  suffix?: ReactNode;
  /** 外层容器自定义类名 */
  containerClassName?: string;
}
