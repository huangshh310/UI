export type BillingCycle = "monthly" | "yearly";

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  ctaLabel: string;
  recommended?: boolean;
}

export interface PricingBlockProps {
  /** 定价档位列表；省略时使用内置三档示例 */
  tiers?: PricingTier[];
  /** 选择套餐回调 */
  onSelectPlan?: (tierId: string, cycle: BillingCycle) => void;
  /** 自定义类名 */
  className?: string;
}
