export type AiReasoningStatus = "thinking" | "completed";

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
  /** 思考总耗时文本 */
  durationLabel?: string;
  /** 思维链步骤列表 */
  steps?: AiReasoningStep[];
  /** 默认是否展开详细思考轨迹 */
  defaultExpanded?: boolean;
  /** 自定义类名 */
  className?: string;
}
