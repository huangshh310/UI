export type HoldToConfirmTone = "signal" | "destructive";

export interface HoldToConfirmProps {
  /** 默认按住提示文案 */
  label?: string;
  /** 完成确认后的文案 */
  confirmedLabel?: string;
  /** 需要持续按住的毫秒数（默认 900ms） */
  holdDurationMs?: number;
  /** 语义色调 */
  tone?: HoldToConfirmTone;
  /** 完成确认回调 */
  onConfirm?: () => void;
  /** 禁用状态 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}
