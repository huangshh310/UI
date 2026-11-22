export type AiDiffLineType = "context" | "remove" | "add";

export interface AiDiffLine {
  id: string;
  lineNumber: number;
  type: AiDiffLineType;
  content: string;
}

export interface AiDiffReviewProps {
  /** 目标文件路径 */
  fileName?: string;
  /** Diff 行列表 */
  lines?: AiDiffLine[];
  /** 应用选中变更回调 */
  onApply?: (acceptedLineIds: string[]) => void;
  /** 自定义类名 */
  className?: string;
}
