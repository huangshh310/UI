"use client";

/**
 * PricingBlock：组合 StretchSwitch 计费周期切换与 NumberFlow 滚动数字的三档定价对比区块。
 */
import { cn } from "@matt-ui/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { NumberFlow } from "../number-flow/index.js";
import { StretchSwitch } from "../stretch-switch/index.js";
import type { BillingCycle, PricingBlockProps, PricingTier } from "./pricing-block.types.js";

const DEFAULT_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "个人版",
    description: "日常创作与个人轻量项目使用。",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["无限个人文档与画板", "多端实时云同步", "基础导出与分享链接"],
    ctaLabel: "免费开始",
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
  },
  {
    id: "enterprise",
    name: "团队版",
    description: "多人实时协作与高级权限管理。",
    monthlyPrice: 699,
    yearlyPrice: 559,
    features: ["无限团队成员与共享空间", "企业单点登录（SSO）", "专属客户经理与 SLA 保障"],
    ctaLabel: "联系我们",
  },
];

const FeatureList = ({ features, inverted }: { features: string[]; inverted?: boolean }) => (
  <ul
    className={cn(
      "m-0 flex flex-1 list-none flex-col gap-2.5 border-t border-solid p-0 pt-5 text-[13px]",
      inverted
        ? "border-primary-foreground/15 text-primary-foreground/80"
        : "border-border/80 text-muted-foreground",
    )}
  >
    {features.map((feat) => (
      <li key={feat} className="flex items-start gap-2.5">
        <Check
          aria-hidden="true"
          className={cn(
            "mt-0.5 size-4 shrink-0",
            inverted ? "text-primary-foreground" : "text-foreground/75",
          )}
        />
        <span>{feat}</span>
      </li>
    ))}
  </ul>
);

interface TierCardProps {
  tier: PricingTier;
  cycle: BillingCycle;
  onPick: () => void;
}

const TierHeader = ({ tier, featured }: { tier: PricingTier; featured: boolean }) => (
  <>
    <div className="flex items-center justify-between gap-2">
      <p
        className={cn(
          "m-0 font-sans text-base font-semibold tracking-tight",
          featured ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {tier.name}
      </p>
      {featured && (
        <span className="rounded-full bg-primary-foreground/14 px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
          最受欢迎
        </span>
      )}
    </div>
    <p
      className={cn(
        "m-0 mt-1.5 text-xs leading-relaxed",
        featured ? "text-primary-foreground/72" : "text-muted-foreground",
      )}
    >
      {tier.description}
    </p>
  </>
);

const TierCard = ({ tier, cycle, onPick }: TierCardProps) => {
  const price = cycle === "yearly" ? tier.yearlyPrice : tier.monthlyPrice;
  const featured = Boolean(tier.recommended);
  return (
    <div
      className={cn(
        "flex flex-col rounded-[24px] border border-solid p-6 transition-shadow duration-(--ui-duration-fast)",
        featured
          ? "border-primary bg-primary text-primary-foreground shadow-lg"
          : "border-border/90 bg-card text-card-foreground shadow-xs",
      )}
    >
      <TierHeader tier={tier} featured={featured} />
      <div className="my-6 flex items-baseline gap-1">
        <NumberFlow
          value={price}
          prefix="¥"
          suffix="/月"
          className={cn(
            "text-4xl tracking-tight",
            featured ? "text-primary-foreground" : "text-foreground",
          )}
          format={{ maximumFractionDigits: 0 }}
        />
      </div>
      <FeatureList features={tier.features} inverted={featured} />
      <button
        type="button"
        onClick={onPick}
        className={cn(
          "mt-6 inline-flex h-10.5 w-full cursor-pointer items-center justify-center rounded-full border border-solid font-sans text-sm font-medium transition-[background-color,transform,opacity] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring",
          featured
            ? "border-transparent bg-primary-foreground text-primary hover:opacity-92"
            : "border-border bg-secondary/70 text-foreground hover:bg-accent",
        )}
      >
        {tier.ctaLabel}
      </button>
    </div>
  );
};

export const PricingBlock = ({
  tiers = DEFAULT_TIERS,
  onSelectPlan,
  className,
}: PricingBlockProps) => {
  const [yearly, setYearly] = useState(false);
  const cycle: BillingCycle = yearly ? "yearly" : "monthly";

  return (
    <div
      data-slot="pricing-block"
      className={cn("@container flex w-full flex-col gap-7", className)}
    >
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className={cn(!yearly ? "font-medium text-foreground" : "text-muted-foreground")}>
          按月计费
        </span>
        <StretchSwitch label="按年计费" checked={yearly} onCheckedChange={setYearly} />
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
          年付省 20%
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-3">
        {tiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            cycle={cycle}
            onPick={() => onSelectPlan?.(tier.id, cycle)}
          />
        ))}
      </div>
    </div>
  );
};
