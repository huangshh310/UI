export type AiTokenSegmentTone = "signal" | "primary" | "success" | "warning";

export interface AiTokenSegment {
  id: string;
  label: string;
  tokens: number;
  tone: AiTokenSegmentTone;
}

export interface AiTokenMeterProps {
  /** 上下文窗口最大容量（默认 200000） */
  maxTokens?: number;
  /** 分段 Token 占用明细 */
  segments?: AiTokenSegment[];
  /** 预估成本标签 */
  costLabel?: string;
  /** 点击压缩上下文回调（参数为释放的 Token 数） */
  onCompact?: (savedTokens: number) => void;
  /** 自定义类名 */
  className?: string;
}
