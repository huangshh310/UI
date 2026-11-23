export type AudioWavesVariant = "bars" | "mirror" | "dots";
export type AudioWavesSize = "sm" | "md" | "lg";
export type AudioWavesTone = "default" | "signal" | "emerald" | "obsidian";

export interface AudioWavesProps {
  /** 受控激活态 */
  active?: boolean;
  /** 非受控初始激活态 */
  defaultActive?: boolean;
  /** 状态切换回调 */
  onActiveChange?: (active: boolean) => void;
  /** 波形样式：对称镜像（mirror）、底边对齐音柱（bars）或律动点阵（dots） */
  variant?: AudioWavesVariant;
  /** 尺寸规格 */
  size?: AudioWavesSize;
  /** 色彩风格 */
  tone?: AudioWavesTone;
  /** 紧凑胶囊模式（隐藏多余装饰边距，适合嵌入输入框） */
  compact?: boolean;
  /** 音柱数量 */
  bars?: number;
  /** 自定义状态文案 */
  label?: string;
  /** 时长读数 */
  durationLabel?: string;
  /** 可选实时语音转写字幕预览 */
  transcript?: string;
  /** 可选识别语种徽章 */
  locale?: string;
  /** 自定义类名 */
  className?: string;
}
