export interface IntroGreeting {
  text: string;
  lang?: string;
}

export interface IntroLoaderProps {
  /** 轮播问候语或品牌词 */
  greetings?: IntroGreeting[];
  /** 总展示时长（毫秒） */
  durationMs?: number;
  /** 是否处于播放激活状态 */
  active: boolean;
  /** 播放完毕或用户跳过时回调 */
  onComplete?: () => void;
  /** 是否覆盖全屏；文档演示可设 false 嵌入容器 */
  fullscreen?: boolean;
  /** 是否允许用户手动跳过或按 Esc 退出 */
  skippable?: boolean;
  /** 自定义类名 */
  className?: string;
}
