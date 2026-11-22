/**
 * TypewriterButton 的类型定义。
 */
import type { ComponentProps } from "react";

export interface TypewriterButtonProps extends Omit<ComponentProps<"button">, "children"> {
  /** 按钮上的文字，逐字显示的就是它 */
  label: string;
  /** 每个字符之间的间隔，单位毫秒，默认 75 */
  charDuration?: number;
  /** 挂载后是否立即开始打字，默认否 */
  autoStart?: boolean;
  /** 逐字显示时是否播放机械按键音效，默认是 */
  sound?: boolean;
  /** 全部字符显示完后调用 */
  onComplete?: () => void;
}
