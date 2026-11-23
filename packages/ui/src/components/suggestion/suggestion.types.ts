/**
 * Suggestion 的类型定义：空态场景灵感卡片组与回合末流式追问胶囊条。
 */
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type SuggestionsVariant = "pills" | "cards";

export interface SuggestionItem {
  id: string;
  /** 展示标题或胶囊短句 */
  label: string;
  /** 点击后实际提交或回填的完整提示词（省略时回退为 label） */
  prompt?: string;
  /** 卡片形态下的补充说明 */
  description?: string;
  /** 可选分类标签（卡片形态支持按分类筛选） */
  category?: string;
  /** 可选前置图标 */
  icon?: ReactNode;
}

export interface SuggestionsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** 结构化建议项列表（也可直接传 Suggestion 子元素进行复合拼装） */
  items?: SuggestionItem[];
  /** 视觉形态：pills 紧凑追问胶囊条，cards 空态灵感卡片网格 */
  variant?: SuggestionsVariant;
  /** 选中某条建议时的回调，返回对应的完整 prompt 文本与原始条目 */
  onSelect?: (prompt: string, item?: SuggestionItem) => void;
  /** 是否在卡片形态顶部展示分类筛选胶囊，默认 true */
  showCategoryFilter?: boolean;
}

export interface SuggestionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** 该建议对应的提示词文本 */
  suggestion: string;
  /** 点击选中回调 */
  onSelect?: (suggestion: string) => void;
  /** 前置微图标 */
  icon?: ReactNode;
}
