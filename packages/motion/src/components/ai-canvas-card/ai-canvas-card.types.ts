export interface AiCanvasCardProps {
  /** 生成提示词文案 */
  prompt?: string;
  /** 画幅比例标识 */
  aspectLabel?: string;
  /** 视觉风格标签 */
  styleLabel?: string;
  /** 生成变体回调 */
  onRemix?: (seedIndex: number) => void;
  /** 收藏回调 */
  onFavoriteChange?: (favorited: boolean) => void;
  /** 自定义类名 */
  className?: string;
}
