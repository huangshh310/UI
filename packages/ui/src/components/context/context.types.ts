/**
 * Context 的类型定义：环形上下文窗口进度微胶囊与分段 Token 预算浮层检查器。
 */
export type ContextSegmentTone = "primary" | "signal" | "success" | "warning";

export interface ContextSegment {
  id: string;
  label: string;
  tokens: number;
  tone?: ContextSegmentTone;
}

export type ContextVariant = "pill" | "inline";

export interface ContextProps {
  /** 模型最大上下文窗口 Token 容量，默认 200000 */
  maxTokens?: number;
  /** 分段 Token 占用明细 */
  segments?: ContextSegment[];
  /** 展示形态：pill 紧凑环形微胶囊（点击展开浮层明细），inline 直接平铺明细卡片 */
  variant?: ContextVariant;
  /** 预估当轮会话成本说明（如 "~$0.024"） */
  costLabel?: string;
  /** 点击一键压缩上下文时的回调，回传压缩释放的 Token 数量 */
  onCompact?: (savedTokens: number) => void;
  className?: string;
  "aria-label"?: string;
}
