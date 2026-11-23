export type BillingCycle = "monthly" | "yearly";
export type PricingBlockVariant = "default" | "spotlight" | "minimal";

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  ctaLabel: string;
  recommended?: boolean;
  /** 自定义右上角角标文案；推荐档默认显示「最受欢迎」 */
  badge?: string;
  /** 价格下方补充说明（如「含 14 天免费试用」或「按年一次结算」） */
  highlightNote?: string;
  /** 价格周期后缀，默认 "/月" */
  periodLabel?: string;
}

export interface PricingBlockProps {
  /** 定价档位列表；省略时使用内置三档示例 */
  tiers?: PricingTier[];
  /** 视觉风格：反色高光主推、品牌蓝描边聚焦或极简发丝 */
  variant?: PricingBlockVariant;
  /** 初始计费周期，默认 "monthly" */
  defaultCycle?: BillingCycle;
  /** 货币前缀符号，默认 "¥" */
  currency?: string;
  /** 年付开关旁的优惠角标文案，默认 "年付省 20%" */
  discountBadge?: string;
  /** 紧凑模式，减小卡片内边距与网格间距 */
  compact?: boolean;
  /** 选择套餐回调 */
  onSelectPlan?: (tierId: string, cycle: BillingCycle) => void;
  /** 自定义类名 */
  className?: string;
}
