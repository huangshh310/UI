export interface HeroBentoBlockProps {
  /** 顶部公告徽章文字 */
  announcement?: string;
  /** 主标题 */
  headline?: string;
  /** 副标题描述 */
  subheadline?: string;
  /** 主 CTA 回调 */
  onPrimaryClick?: () => void;
  /** 次 CTA 回调 */
  onSecondaryClick?: () => void;
  /** 自定义类名 */
  className?: string;
}
