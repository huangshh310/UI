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
    name: "入门版",
    description: "适合个人开源项目与原型探索。",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["全部基础组件与 Token", "shadcn CLI 源码安装", "社区讨论支持"],
    ctaLabel: "免费开始",
  },
  {
    id: "pro",
    name: "专业版",
    description: "面向成长中的产品与设计工程团队。",
    monthlyPrice: 199,
    yearlyPrice: 159,
    recommended: true,
    features: [
      "包含全部 Blocks 与动效套件",
      "私有 Registry 同步与版本锁",
      "双主题 axe 无障碍巡检报告",
    ],
    ctaLabel: "升级专业版",
  },
  {
    id: "enterprise",
    name: "企业版",
    description: "跨团队多品牌设计系统治理方案。",
    monthlyPrice: 699,
    yearlyPrice: 559,
    features: ["多品牌主题自动对比度审计", "专属架构顾问与 SLA 保障", "自定义 CI 合规流水线"],
    ctaLabel: "联系架构师",
  },
];

const FeatureList = ({ features }: { features: string[] }) => (
  <ul className="m-0 flex flex-1 list-none flex-col gap-2.5 border-t border-solid border-border/75 p-0 pt-4 text-xs text-muted-foreground">
    {features.map((feat) => (
      <li key={feat} className="flex items-start gap-2">
        <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-signal" />
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

const TierCard = ({ tier, cycle, onPick }: TierCardProps) => {
  const price = cycle === "yearly" ? tier.yearlyPrice : tier.monthlyPrice;
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-solid bg-card p-6 text-card-foreground shadow-sm",
        tier.recommended ? "border-signal/60 ring-2 ring-signal/15" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="m-0 font-sans text-base font-semibold text-foreground">{tier.name}</p>
        {tier.recommended && (
          <span className="rounded-full bg-signal px-2.5 py-0.5 font-mono text-[11px] font-medium text-signal-foreground">
            推荐
          </span>
        )}
      </div>
      <p className="m-0 mt-1.5 text-xs leading-relaxed text-muted-foreground">{tier.description}</p>
      <div className="my-5 flex items-baseline gap-1">
        <NumberFlow
          value={price}
          prefix="¥"
          suffix="/月"
          className="text-3xl"
          format={{ maximumFractionDigits: 0 }}
        />
      </div>
      <FeatureList features={tier.features} />
      <button
        type="button"
        onClick={onPick}
        className={cn(
          "mt-6 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border border-solid font-sans text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          tier.recommended
            ? "border-signal bg-signal text-signal-foreground hover:opacity-92"
            : "border-border bg-background text-foreground shadow-sm hover:bg-accent dark:bg-card",
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
    <div data-slot="pricing-block" className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className={cn(!yearly ? "font-medium text-foreground" : "text-muted-foreground")}>
          按月计费
        </span>
        <StretchSwitch label="按年计费" checked={yearly} onCheckedChange={setYearly} />
        <span className="rounded-full bg-signal px-2 py-0.5 font-mono text-[11px] font-medium text-signal-foreground">
          省 20%
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
