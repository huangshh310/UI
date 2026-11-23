// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * HeroBentoBlock：由 Badge、Button、AvatarStack、SpotlightCard 与 Progress 组合的落地页首屏与 Bento 特性网格区块。
 */

import { AvatarStack } from "@/components/ui/avatar-stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ArrowRight, Layers, ShieldCheck, Zap } from "lucide-react";

export const HERO_TEAMS = [
  { id: "1", name: "林知远", role: "前端架构", initials: "林", status: "online" as const },
  { id: "2", name: "周宁", role: "设计系统", initials: "周", status: "online" as const },
  { id: "3", name: "陈屿", role: "交互设计", initials: "陈" },
  { id: "4", name: "许澄", role: "质量工程", initials: "许" },
];

export const heroFrameVariants = cva(
  "@container relative flex w-full flex-col overflow-hidden rounded-[26px] border border-solid",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-card shadow-xs dark:border-white/10",
        spotlight:
          "border-border/80 bg-card shadow-md dark:border-white/12 dark:shadow-[0_20px_48px_rgba(0,0,0,0.42)]",
        minimal:
          "border-border/75 bg-secondary/25 shadow-none dark:border-white/10 dark:bg-card/80",
      },
      compact: {
        true: "gap-5 p-5 sm:p-6",
        false: "gap-7 p-6 sm:p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      compact: false,
    },
  },
);

export const heroHeaderVariants = cva("relative z-10 flex flex-col gap-4", {
  variants: {
    align: {
      start: "items-start text-left",
      center: "items-center text-center",
    },
  },
  defaultVariants: {
    align: "start",
  },
});

export const heroActionsVariants = cva("flex flex-wrap items-center gap-3 pt-1", {
  variants: {
    align: {
      start: "justify-start",
      center: "justify-center",
    },
  },
  defaultVariants: {
    align: "start",
  },
});
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
interface HeroHeaderProps {
  announcement: string;
  headline: string;
  subheadline: string;
  variant: HeroBentoVariant;
  align: HeroBentoAlign;
  primaryLabel: string;
  secondaryLabel: string;
  socialProof: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const HeroHeader = (p: HeroHeaderProps) => (
  <div className={heroHeaderVariants({ align: p.align })}>
    <Badge variant={p.variant === "spotlight" ? "soft" : "secondary"} dot>
      {p.announcement}
    </Badge>
    <p
      className={cn(
        "m-0 max-w-2xl text-2xl leading-[1.14] font-semibold tracking-[-0.035em] text-foreground sm:text-[34px]",
        p.align === "center" && "mx-auto",
      )}
    >
      {p.headline}
    </p>
    <p
      className={cn(
        "m-0 max-w-xl text-sm leading-relaxed text-muted-foreground",
        p.align === "center" && "mx-auto",
      )}
    >
      {p.subheadline}
    </p>
    <div className={heroActionsVariants({ align: p.align })}>
      <Button variant="primary" size="lg" radius="pill" onClick={p.onPrimaryClick}>
        <span>{p.primaryLabel}</span>
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
      <Button variant="outline" size="lg" radius="pill" onClick={p.onSecondaryClick}>
        {p.secondaryLabel}
      </Button>
      <div className="flex items-center gap-2.5 pl-1">
        <AvatarStack items={HERO_TEAMS} max={4} size="sm" />
        <span className="text-xs text-muted-foreground">{p.socialProof}</span>
      </div>
    </div>
  </div>
);

const AccessibilityCard = ({ tone, compact }: { tone: "neutral" | "signal"; compact: boolean }) => (
  <SpotlightCard
    tone={tone}
    className={cn(
      "flex flex-col justify-between gap-3 border-border/80 dark:border-white/10 @2xl:col-span-3",
      compact ? "p-4" : "p-5",
    )}
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3.5">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border border-solid border-border/80 bg-secondary/70 text-foreground shadow-xs dark:border-white/10 dark:bg-white/[0.05]">
          <ShieldCheck aria-hidden="true" className="size-4.5" />
        </span>
        <div>
          <p className="m-0 text-sm font-semibold tracking-[-0.015em] text-foreground">
            端到端本地加密与离线优先
          </p>
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">
            所有笔记与画板均支持即时离线读写，联网后毫秒级增量同步到全部设备。
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="success" dot>
          实时同步中
        </Badge>
        <Badge variant="outline">桌面与移动端</Badge>
      </div>
    </div>
  </SpotlightCard>
);

const WorkspaceFeatureCard = ({
  variant,
  tone,
  pad,
}: {
  variant: HeroBentoVariant;
  tone: "neutral" | "signal";
  pad: string;
}) => (
  <SpotlightCard
    tone={tone}
    className={cn(
      "flex flex-col justify-between gap-4 border-border/80 dark:border-white/10 @2xl:col-span-2",
      pad,
    )}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-solid border-border/80 bg-secondary/70 text-foreground shadow-xs dark:border-white/10 dark:bg-white/[0.05]">
        <Layers aria-hidden="true" className="size-4.5" />
      </span>
      <Badge variant={variant === "spotlight" ? "soft" : "secondary"}>云端空间</Badge>
    </div>
    <div>
      <p className="m-0 text-base font-semibold tracking-[-0.02em] text-foreground">
        一处整理你的灵感、文档与项目进度
      </p>
      <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
        从零碎想法到正式发布，在同一块纯净画布上与团队顺畅接力协作。
      </p>
    </div>
    <div className="rounded-2xl border border-solid border-border/75 bg-secondary/35 p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
      <Progress
        value={84}
        tone={variant === "spotlight" ? "signal" : "primary"}
        showValue
        label="本季度目标完成度"
      />
    </div>
  </SpotlightCard>
);

const LatencyMetricCard = ({ tone, pad }: { tone: "neutral" | "signal"; pad: string }) => (
  <SpotlightCard
    tone={tone}
    className={cn("flex flex-col justify-between gap-4 border-border/80 dark:border-white/10", pad)}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-solid border-border/80 bg-secondary/70 text-foreground shadow-xs dark:border-white/10 dark:bg-white/[0.05]">
        <Zap aria-hidden="true" className="size-4.5" />
      </span>
      <Badge variant="outline" size="sm">
        P99 响应
      </Badge>
    </div>
    <div>
      <p className="m-0 font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums">
        12ms
      </p>
      <p className="m-0 mt-2 text-xs font-medium text-foreground">几乎零感知的交互反馈</p>
      <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
        原生手势与流畅弹簧动画，让每次操作都有真实的物理触感。
      </p>
    </div>
  </SpotlightCard>
);

const BentoGrid = ({ variant, compact }: { variant: HeroBentoVariant; compact: boolean }) => {
  const tone = variant === "spotlight" ? "signal" : "neutral";
  const pad = compact ? "p-4" : "p-5";

  return (
    <div
      className={cn("relative z-10 grid grid-cols-1 @2xl:grid-cols-3", compact ? "gap-3" : "gap-4")}
    >
      <WorkspaceFeatureCard variant={variant} tone={tone} pad={pad} />
      <LatencyMetricCard tone={tone} pad={pad} />
      <AccessibilityCard tone={tone} compact={compact} />
    </div>
  );
};
const resolveHeroConfig = (props: HeroBentoBlockProps) => ({
  announcement: props.announcement ?? "新版本上线 · 空间画板 2.0",
  headline: props.headline ?? "让创意从灵感到落地，每一步都轻盈顺手",
  subheadline:
    props.subheadline ?? "专为独立创作者与产品团队打造的极简协作空间，告别繁琐菜单与视觉干扰。",
  variant: props.variant ?? "default",
  align: props.align ?? "start",
  primaryLabel: props.primaryLabel ?? "免费开始",
  secondaryLabel: props.secondaryLabel ?? "了解更多",
  socialProof: props.socialProof ?? "超过 12,000 支团队正在使用",
  compact: props.compact ?? false,
});

export const HeroBentoBlock = (props: HeroBentoBlockProps) => {
  const cfg = resolveHeroConfig(props);

  return (
    <div
      data-slot="hero-bento-block"
      data-variant={cfg.variant}
      data-align={cfg.align}
      className={cn(
        heroFrameVariants({ variant: cfg.variant, compact: cfg.compact }),
        props.className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b to-transparent",
          cfg.variant === "spotlight"
            ? "from-signal/[0.07] dark:from-signal/[0.12]"
            : "from-foreground/[0.03] dark:from-white/[0.04]",
        )}
      />
      <HeroHeader
        announcement={cfg.announcement}
        headline={cfg.headline}
        subheadline={cfg.subheadline}
        variant={cfg.variant}
        align={cfg.align}
        primaryLabel={cfg.primaryLabel}
        secondaryLabel={cfg.secondaryLabel}
        socialProof={cfg.socialProof}
        onPrimaryClick={props.onPrimaryClick}
        onSecondaryClick={props.onSecondaryClick}
      />
      <BentoGrid variant={cfg.variant} compact={cfg.compact} />
    </div>
  );
};
