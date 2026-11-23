"use client";

/**
 * PricingBlock：组合 StretchSwitch 计费周期切换与 NumberFlow 滚动数字的三档定价对比区块。
 */
import { cn } from "@matt-ui/utils";
import { useState } from "react";
import { StretchSwitch } from "../stretch-switch/index.js";
import { TierCard } from "./pricing-block-card.js";
import type { BillingCycle, PricingBlockProps } from "./pricing-block.types.js";
import { DEFAULT_PRICING_TIERS } from "./pricing-block.variants.js";

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
