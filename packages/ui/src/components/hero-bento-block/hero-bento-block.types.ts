export type HeroBentoVariant = "default" | "spotlight" | "minimal";
export type HeroBentoAlign = "start" | "center";

export interface HeroBentoBlockProps {
  /** 顶部公告徽章文字 */
  announcement?: string;
  /** 主标题 */
  headline?: string;
  /** 副标题描述 */
  subheadline?: string;
  /** 视觉风格：标准中性高光、品牌蓝聚光或极简发丝 */
  variant?: HeroBentoVariant;
  /** 首屏文字与操作区对齐方式：左对齐或居中对齐 */
  align?: HeroBentoAlign;
  /** 主按钮文案，默认「免费开始」 */
  primaryLabel?: string;
  /** 次按钮文案，默认「了解更多」 */
  secondaryLabel?: string;
  /** 团队头像旁的背书文案 */
  socialProof?: string;
  /** 紧凑内边距密度 */
  compact?: boolean;
  /** 主 CTA 回调 */
  onPrimaryClick?: () => void;
  /** 次 CTA 回调 */
  onSecondaryClick?: () => void;
  /** 自定义类名 */
  className?: string;
}
