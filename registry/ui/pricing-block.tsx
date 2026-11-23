// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * PricingBlock：组合 StretchSwitch 计费周期切换与 NumberFlow 滚动数字的三档定价对比区块。
 */

import { NumberFlow } from "@/components/ui/number-flow";
import { StretchSwitch } from "@/components/ui/stretch-switch";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "个人版",
    description: "日常创作与个人轻量项目使用。",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["无限个人文档与画板", "多端实时云同步", "基础导出与分享链接"],
    ctaLabel: "免费开始",
    highlightNote: "永久免费，无需绑定信用卡",
  },
  {
    id: "pro",
    name: "专业版",
    description: "为独立创作者与精致产品团队打造。",
    monthlyPrice: 199,
    yearlyPrice: 159,
    recommended: true,
    features: ["无限制 AI 写作与灵感助手", "自定义品牌域名与主题", "版本历史回溯与优先支持"],
    ctaLabel: "升级专业版",
    highlightNote: "包含 14 天无门槛试用",
  },
  {
    id: "enterprise",
    name: "团队版",
    description: "多人实时协作与高级权限管理。",
    monthlyPrice: 699,
    yearlyPrice: 559,
    features: ["无限团队成员与共享空间", "企业单点登录（SSO）", "专属客户经理与 SLA 保障"],
    ctaLabel: "联系我们",
    highlightNote: "支持对公发票与定制部署",
  },
];

export const TIER_CARD_BASE =
  "relative flex flex-col rounded-[24px] border border-solid transition-[border-color,box-shadow,transform] duration-(--ui-duration-fast)";

export const TIER_CARD_STANDARD: Record<PricingBlockVariant, string> = {
  default:
    "border-border/80 bg-card text-card-foreground shadow-xs hover:border-foreground/20 hover:shadow-sm dark:border-white/10 dark:hover:border-white/20",
  spotlight:
    "border-border/80 bg-card text-card-foreground shadow-xs hover:border-foreground/20 dark:border-white/10 dark:hover:border-white/20",
  minimal:
    "border-border/75 bg-secondary/25 text-foreground shadow-none hover:border-foreground/20 dark:border-white/10 dark:bg-white/[0.02]",
};

export const TIER_CARD_FEATURED: Record<PricingBlockVariant, string> = {
  default:
    "border-primary bg-primary text-primary-foreground shadow-lg ring-1 ring-primary/15 dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
  spotlight:
    "border-signal/60 bg-card text-card-foreground shadow-md ring-1 ring-signal/20 dark:border-signal/55 dark:ring-signal/25",
  minimal:
    "border-foreground/30 bg-card text-card-foreground shadow-sm dark:border-white/22 dark:bg-card",
};

export const TIER_CTA_BASE =
  "inline-flex h-10.5 w-full cursor-pointer items-center justify-center rounded-full border border-solid font-sans text-sm font-medium transition-[background-color,border-color,transform,opacity] duration-(--ui-duration-fast) active:scale-[0.98] motion-reduce:active:scale-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid";

export const TIER_CTA_FEATURED: Record<PricingBlockVariant, string> = {
  default: "border-transparent bg-primary-foreground text-primary hover:opacity-92",
  spotlight:
    "border-transparent bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-signal/92",
  minimal: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
};

export const TIER_CTA_STANDARD =
  "border-border/80 bg-secondary/75 text-foreground hover:border-foreground/20 hover:bg-accent dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.11]";

export const TIER_BADGE_STYLE: Record<PricingBlockVariant, string> = {
  default: "bg-primary-foreground/15 text-primary-foreground",
  spotlight:
    "border border-solid border-signal/25 bg-signal/10 text-blue-700 dark:border-signal/35 dark:bg-signal/20 dark:text-blue-300",
  minimal: "border border-solid border-border/80 bg-secondary text-foreground dark:border-white/12",
};
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
const FeatureList = ({
  features,
  inverted,
  spotlightFeatured,
}: {
  features: string[];
  inverted: boolean;
  spotlightFeatured: boolean;
}) => (
  <ul
    className={cn(
      "m-0 flex flex-1 list-none flex-col gap-2.5 border-t border-solid p-0 pt-5 text-[13px]",
      inverted
        ? "border-primary-foreground/15 text-primary-foreground/85"
        : "border-border/80 text-muted-foreground dark:border-white/10",
    )}
  >
    {features.map((feat) => (
      <li key={feat} className="flex items-start gap-2.5 leading-snug">
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full",
            inverted
              ? "bg-primary-foreground/15 text-primary-foreground"
              : spotlightFeatured
                ? "bg-signal/12 text-blue-700 dark:bg-signal/22 dark:text-blue-300"
                : "bg-secondary text-foreground/80 dark:bg-white/10",
          )}
        >
          <Check className="size-2.5 stroke-[2.5]" />
        </span>
        <span>{feat}</span>
      </li>
    ))}
  </ul>
);

const TierHeader = ({
  tier,
  variant,
  featured,
  inverted,
}: {
  tier: PricingTier;
  variant: PricingBlockVariant;
  featured: boolean;
  inverted: boolean;
}) => {
  const badgeLabel = tier.badge ?? (featured ? "最受欢迎" : undefined);
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p
          className={cn(
            "m-0 font-sans text-base font-semibold tracking-[-0.02em]",
            inverted ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {tier.name}
        </p>
        {badgeLabel && (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              featured
                ? TIER_BADGE_STYLE[variant]
                : "border border-solid border-border/80 bg-secondary text-muted-foreground dark:border-white/10",
            )}
          >
            {badgeLabel}
          </span>
        )}
      </div>
      <p
        className={cn(
          "m-0 mt-1.5 text-xs leading-relaxed",
          inverted ? "text-primary-foreground/78" : "text-muted-foreground",
        )}
      >
        {tier.description}
      </p>
    </div>
  );
};

interface TierCardProps {
  tier: PricingTier;
  cycle: BillingCycle;
  variant: PricingBlockVariant;
  currency: string;
  compact: boolean;
  onPick: () => void;
}

const resolveBillingNote = (tier: PricingTier, cycle: BillingCycle, price: number) => {
  if (tier.highlightNote) return tier.highlightNote;
  if (price === 0) return "永久免费使用";
  return cycle === "yearly" ? "按年一次结算，随时可调整方案" : "按月灵活订阅，随时取消";
};

const TierPriceBlock = ({
  price,
  currency,
  periodLabel,
  note,
  compact,
  inverted,
}: {
  price: number;
  currency: string;
  periodLabel: string;
  note: string;
  compact: boolean;
  inverted: boolean;
}) => (
  <div className={cn("flex flex-col gap-1", compact ? "my-4" : "my-6")}>
    <div className="flex items-baseline gap-1">
      <NumberFlow
        value={price}
        prefix={currency}
        suffix={periodLabel}
        className={cn(
          "font-semibold tracking-[-0.03em] tabular-nums",
          compact ? "text-3xl" : "text-4xl",
          inverted ? "text-primary-foreground" : "text-foreground",
        )}
        format={{ maximumFractionDigits: 0 }}
      />
    </div>
    <p
      className={cn(
        "m-0 text-[11px]",
        inverted ? "text-primary-foreground/75" : "text-muted-foreground",
      )}
    >
      {note}
    </p>
  </div>
);

const TierCard = ({ tier, cycle, variant, currency, compact, onPick }: TierCardProps) => {
  const price = cycle === "yearly" ? tier.yearlyPrice : tier.monthlyPrice;
  const featured = Boolean(tier.recommended);
  const inverted = featured && variant === "default";
  const spotlightFeatured = featured && variant === "spotlight";

  return (
    <div
      data-slot="pricing-tier"
      data-featured={featured ? "" : undefined}
      className={cn(
        TIER_CARD_BASE,
        compact ? "p-5" : "p-6",
        featured ? TIER_CARD_FEATURED[variant] : TIER_CARD_STANDARD[variant],
      )}
    >
      <TierHeader tier={tier} variant={variant} featured={featured} inverted={inverted} />
      <TierPriceBlock
        price={price}
        currency={currency}
        periodLabel={tier.periodLabel ?? "/月"}
        note={resolveBillingNote(tier, cycle, price)}
        compact={compact}
        inverted={inverted}
      />
      <FeatureList
        features={tier.features}
        inverted={inverted}
        spotlightFeatured={spotlightFeatured}
      />
      <button
        type="button"
        onClick={onPick}
        className={cn(
          TIER_CTA_BASE,
          compact ? "mt-5 h-9.5 text-xs" : "mt-6",
          featured ? TIER_CTA_FEATURED[variant] : TIER_CTA_STANDARD,
        )}
      >
        {tier.ctaLabel}
      </button>
    </div>
  );
};
const BillingToggleBar = ({
  yearly,
  discountBadge,
  onYearlyChange,
}: {
  yearly: boolean;
  discountBadge: string;
  onYearlyChange: (next: boolean) => void;
}) => (
  <div className="flex justify-center">
    <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-solid border-border/80 bg-secondary/45 px-4 py-2 text-sm dark:border-white/10 dark:bg-white/[0.03]">
      <span
        className={cn(
          "text-xs transition-colors",
          !yearly ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        按月计费
      </span>
      <StretchSwitch label="按年计费" size="sm" checked={yearly} onCheckedChange={onYearlyChange} />
      <span
        className={cn(
          "rounded-full border border-solid px-2.5 py-0.5 text-[11px] font-medium transition-colors",
          yearly
            ? "border-signal/25 bg-signal/10 text-blue-700 dark:border-signal/35 dark:bg-signal/20 dark:text-blue-300"
            : "border-border/80 bg-background text-muted-foreground dark:border-white/10 dark:bg-card",
        )}
      >
        {discountBadge}
      </span>
    </div>
  </div>
);

export const PricingBlock = ({
  tiers = DEFAULT_PRICING_TIERS,
  variant = "default",
  defaultCycle = "monthly",
  currency = "¥",
  discountBadge = "年付省 20%",
  compact = false,
  onSelectPlan,
  className,
}: PricingBlockProps) => {
  const [yearly, setYearly] = useState(defaultCycle === "yearly");
  const cycle: BillingCycle = yearly ? "yearly" : "monthly";

  return (
    <div
      data-slot="pricing-block"
      data-variant={variant}
      className={cn("@container flex w-full flex-col", compact ? "gap-5" : "gap-7", className)}
    >
      <BillingToggleBar yearly={yearly} discountBadge={discountBadge} onYearlyChange={setYearly} />
      <div className={cn("grid grid-cols-1 @2xl:grid-cols-3", compact ? "gap-3.5" : "gap-4")}>
        {tiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            cycle={cycle}
            variant={variant}
            currency={currency}
            compact={compact}
            onPick={() => onSelectPlan?.(tier.id, cycle)}
          />
        ))}
      </div>
    </div>
  );
};
