export type AiDiffLineType = "context" | "remove" | "add";
export type AiDiffReviewTheme = "obsidian" | "adaptive";

export interface AiDiffLine {
  id: string;
  lineNumber: number;
  type: AiDiffLineType;
  content: string;
}

export interface AiDiffReviewProps {
  /** 目标文件路径 */
  fileName?: string;
  /** 可选变更意图摘要（展示在文件名下方） */
  summary?: string;
  /** 可选语言标识角标（如 "css" / "json" / "tsx"） */
  language?: string;
  /** 代码差异视口主题：默认曜石暗色代码舞台（obsidian），或跟随宿主的自适应模式（adaptive） */
  theme?: AiDiffReviewTheme;
  /** 紧凑行距模式 */
  compact?: boolean;
  /** Diff 行列表 */
  lines?: AiDiffLine[];
  /** 应用选中变更回调 */
  onApply?: (acceptedLineIds: string[]) => void;
  /** 全部忽略/放弃变更回调 */
  onRejectAll?: () => void;
  /** 自定义类名 */
  className?: string;
}
