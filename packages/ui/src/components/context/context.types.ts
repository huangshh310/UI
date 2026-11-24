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
export type ContextSize = "sm" | "md";
export type ContextSurface = "default" | "subtle" | "glass";

export interface ContextProps {
  /** 模型最大上下文窗口 Token 容量，默认 200000 */
  maxTokens?: number;
  /** 分段 Token 占用明细 */
  segments?: ContextSegment[];
  /** 展示形态：pill 紧凑环形微胶囊（点击展开浮层明细），inline 直接平铺明细卡片 */
  variant?: ContextVariant;
  /** 胶囊或面板紧凑度，默认 md */
  size?: ContextSize;
  /** 表面质感：default 发丝卡片、subtle 轻量填充、glass 毛玻璃，默认 default */
  surface?: ContextSurface;
  /** 预估当轮会话成本说明（如 "~$0.024"） */
  costLabel?: string;
  /** 是否展示成本徽章，默认 true */
  showCost?: boolean;
  /** 可选当前模型标识（展示于浮层头部，如 "matt-pro"） */
  modelName?: string;
  /** 是否展示一键压缩按钮，默认 true */
  compactable?: boolean;
  /** 点击一键压缩上下文时的回调，回传压缩释放的 Token 数量 */
  onCompact?: (savedTokens: number) => void;
  className?: string;
  "aria-label"?: string;
}
