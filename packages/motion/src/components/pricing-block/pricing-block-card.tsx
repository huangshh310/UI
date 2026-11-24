"use client";

/**
 * PricingBlock 单张套餐卡片及其内部标题、价格与权益清单。
 */
import { cn } from "@matt-ui/utils";
import { Check } from "lucide-react";
import { NumberFlow } from "../number-flow/index.js";
import type { BillingCycle, PricingBlockVariant, PricingTier } from "./pricing-block.types.js";
import {
  TIER_BADGE_STYLE,
  TIER_CARD_BASE,
  TIER_CARD_FEATURED,
  TIER_CARD_STANDARD,
  TIER_CTA_BASE,
  TIER_CTA_FEATURED,
  TIER_CTA_STANDARD,
} from "./pricing-block.variants.js";

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
      "m-0 flex flex-1 list-none flex-col gap-2.5 p-0 pt-2 text-[13px]",
      inverted ? "text-primary-foreground" : "text-muted-foreground",
    )}
  >
    {features.map((feat) => (
      <li key={feat} className="flex items-start gap-2.5 leading-snug">
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full",
            inverted
              ? "bg-black/22 text-primary-foreground"
              : spotlightFeatured
                ? "bg-signal/12 text-info dark:bg-signal/22"
                : "bg-secondary text-foreground/80",
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
          inverted ? "text-primary-foreground" : "text-muted-foreground",
        )}
      >
        {tier.description}
      </p>
    </div>
  );
};

export interface TierCardProps {
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
        inverted ? "text-primary-foreground" : "text-muted-foreground",
      )}
    >
      {note}
    </p>
  </div>
);

export const TierCard = ({ tier, cycle, variant, currency, compact, onPick }: TierCardProps) => {
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
