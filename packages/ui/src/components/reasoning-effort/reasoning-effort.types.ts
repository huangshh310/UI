/**
 * ReasoningEffort 的类型定义。
 */
import type { ComponentProps } from "react";

/** 推理思考深度档位（对标 AICSS Reasoning Effort） */
export type ReasoningEffortLevel = "low" | "medium" | "high" | "max";

/** 展示变体：segmented 紧凑分段器、cards 详细档位卡 */
export type ReasoningEffortVariant = "segmented" | "cards";

export interface ReasoningEffortOption {
  value: ReasoningEffortLevel;
  label: string;
  description: string;
  latency: string;
  bars: 1 | 2 | 3 | 4;
}

export interface ReasoningEffortProps extends Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> {
  /** 受控当前推理深度 */
  value?: ReasoningEffortLevel;
  /** 非受控初始推理深度，默认 "medium" */
  defaultValue?: ReasoningEffortLevel;
  /** 展示变体，默认 "segmented" */
  variant?: ReasoningEffortVariant;
  /** 禁用切换 */
  disabled?: boolean;
  /** 自定义档位文案覆盖 */
  options?: ReasoningEffortOption[];
  /** 档位变更回调 */
  onValueChange?: (value: ReasoningEffortLevel) => void;
}
