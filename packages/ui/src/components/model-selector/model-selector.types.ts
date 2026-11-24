/**
 * ModelSelector 的类型定义：可嵌入输入器工具栏或顶栏的紧凑模型与思考强度浮层选择器。
 */
export type ReasoningEffort = "fast" | "balanced" | "deep";

export type ModelCapabilityTag = "reasoning" | "vision" | "fast" | "code";

export type ModelSelectorVariant = "pill" | "ghost" | "glass";

export type ModelSelectorSize = "sm" | "md";

export type ModelSelectorAlign = "start" | "center" | "end";

export interface ModelOption {
  id: string;
  /** 模型显示名 */
  name: string;
  /** 模型系列或提供方分组名（如 旗舰系列 / 高速系列） */
  provider?: string;
  /** 一句话场景定位 */
  description?: string;
  /** 上下文窗口标记（如 200K / 1M） */
  contextWindow?: string;
  /** 可选短标签（如 "推荐" / "New"） */
  badge?: string;
  /** 可选吞吐或延迟提示（如 "~90 tok/s"） */
  speedHint?: string;
  /** 能力徽章标签 */
  capabilities?: ModelCapabilityTag[];
}

export interface ModelSelectorValue {
  modelId: string;
  effort: ReasoningEffort;
  webSearch: boolean;
}

export interface ModelSelectorProps {
  /** 可选模型集合 */
  models?: ModelOption[];
  /** 受控模型 ID */
  modelId?: string;
  /** 非受控默认模型 ID */
  defaultModelId?: string;
  /** 受控推理强度 */
  effort?: ReasoningEffort;
  /** 非受控默认推理强度 */
  defaultEffort?: ReasoningEffort;
  /** 触发器视觉变体：pill 发丝胶囊、ghost 无框顶栏切换器、glass 毛玻璃胶囊，默认 pill */
  variant?: ModelSelectorVariant;
  /** 触发器尺寸密度，默认 md */
  size?: ModelSelectorSize;
  /** 浮层水平对齐方式，默认 start */
  align?: ModelSelectorAlign;
  /** 是否按 provider 字段分组展示模型列表，默认 false */
  groupByProvider?: boolean;
  /** 是否在浮层底部展示推理强度切换器，默认 true */
  showEffortToggle?: boolean;
  /** 是否展示联网检索快捷开关，默认 true */
  showWebSearchToggle?: boolean;
  /** 非受控初始联网开关状态，默认 false */
  defaultWebSearch?: boolean;
  /** 是否在浮层顶部启用搜索过滤框，默认 true */
  searchable?: boolean;
  /** 任意配置项变更回调 */
  onValueChange?: (next: ModelSelectorValue) => void;
  /** 禁用触发器 */
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}
