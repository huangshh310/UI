export type AudioWavesVariant = "bars" | "mirror";

export interface AudioWavesProps {
  /** 受控激活态 */
  active?: boolean;
  /** 非受控初始激活态 */
  defaultActive?: boolean;
  /** 状态切换回调 */
  onActiveChange?: (active: boolean) => void;
  /** 波形样式 */
  variant?: AudioWavesVariant;
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
