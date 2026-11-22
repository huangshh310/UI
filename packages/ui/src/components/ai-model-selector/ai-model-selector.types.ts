export type AiReasoningEffort = "fast" | "balanced" | "deep";

export interface AiModelOption {
  id: string;
  name: string;
  tagline: string;
  contextLabel: string;
  tier: "pro" | "flash" | "vision";
}

export interface AiModelConfig {
  modelId: string;
  effort: AiReasoningEffort;
  capabilities: string[];
}

export interface AiModelSelectorProps {
  /** 可选模型列表 */
  models?: AiModelOption[];
  /** 初始选中模型 */
  defaultModelId?: string;
  /** 初始推理深度 */
  defaultEffort?: AiReasoningEffort;
  /** 配置变更回调 */
  onChange?: (config: AiModelConfig) => void;
  /** 自定义类名 */
  className?: string;
}
