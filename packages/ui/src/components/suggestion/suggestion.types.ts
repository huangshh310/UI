/**
 * Suggestion 的类型定义：空态场景灵感卡片组、垂直追问列表与回合末流式追问胶囊条。
 */
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type SuggestionsVariant = "pills" | "cards" | "list";
export type SuggestionSize = "sm" | "md";
export type SuggestionSurface = "default" | "ghost" | "glass";
export type SuggestionPillVariant = "default" | "ghost" | "signal";
export type SuggestionsColumns = 1 | 2 | 3;

export interface SuggestionItem {
  id: string;
  /** 展示标题或胶囊短句 */
  label: string;
  /** 点击后实际提交或回填的完整提示词（省略时回退为 label） */
  prompt?: string;
  /** 卡片或列表形态下的补充说明 */
  description?: string;
  /** 可选分类标签（卡片形态支持按分类筛选） */
  category?: string;
  /** 可选右侧或行尾等宽徽章（如快捷键或推荐标识） */
  badge?: string;
  /** 可选前置图标 */
  icon?: ReactNode;
}

export interface SuggestionsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** 结构化建议项列表（也可直接传 Suggestion 子元素进行复合拼装） */
  items?: SuggestionItem[];
  /** 视觉形态：pills 紧凑追问胶囊条，cards 空态灵感卡片网格，list 简洁追问列表 */
  variant?: SuggestionsVariant;
  /** 尺寸密度，默认 md */
  size?: SuggestionSize;
  /** 容器与卡片表面质感，默认 default */
  surface?: SuggestionSurface;
  /** pills 形态下是否启用单行横向滚动轨道，默认 false */
  scrollable?: boolean;
  /** cards 形态下的桌面栅格列数，默认 2 */
  columns?: SuggestionsColumns;
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
  /** 胶囊外观风格，默认 default */
  variant?: SuggestionPillVariant;
  /** 胶囊尺寸，默认 md */
  size?: SuggestionSize;
  /** 可选尾部等宽徽章 */
  badge?: string;
  /** 前置微图标 */
  icon?: ReactNode;
}
