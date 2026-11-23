export type AiReasoningStatus = "thinking" | "completed";
export type AiReasoningVariant = "card" | "ghost" | "inline";

export interface AiReasoningStep {
  id: string;
  title: string;
  detail?: string;
  duration?: string;
  tag?: string;
}

export interface AiReasoningProps {
  /** 当前推理状态 */
  status?: AiReasoningStatus;
  /** 视觉变体：标准卡片（card）、柔光内嵌（ghost）或极简行内折叠（inline） */
  variant?: AiReasoningVariant;
  /** 自定义标题文案（默认按 status 自动生成） */
  title?: string;
  /** 思考总耗时文本 */
  durationLabel?: string;
  /** 可选思考 Token 计数（如 "486 tok"） */
  tokensLabel?: string;
  /** 思维链步骤列表 */
  steps?: AiReasoningStep[];
  /** 受控展开状态 */
  expanded?: boolean;
  /** 默认是否展开详细思考轨迹 */
  defaultExpanded?: boolean;
  /** 展开状态变化回调 */
  onExpandedChange?: (expanded: boolean) => void;
  /** 自定义类名 */
  className?: string;
}
