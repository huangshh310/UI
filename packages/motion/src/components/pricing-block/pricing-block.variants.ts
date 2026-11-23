/**
 * PricingBlock 的静态样式查找表与内置默认套餐数据（不依赖 cva）。
 */
import type { PricingBlockVariant, PricingTier } from "./pricing-block.types.js";

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
