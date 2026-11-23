"use client";

/**
 * HeroBentoBlock 的首屏标题区与 Bento 特性网格子组件。
 */
import { cn } from "@matt-ui/utils";
import { ArrowRight, Layers, ShieldCheck, Zap } from "lucide-react";
import { AvatarStack } from "../avatar-stack/index.js";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { Progress } from "../progress/index.js";
import { SpotlightCard } from "../spotlight-card/index.js";
import type { HeroBentoAlign, HeroBentoVariant } from "./hero-bento-block.types.js";
import {
  HERO_TEAMS,
  heroActionsVariants,
  heroHeaderVariants,
} from "./hero-bento-block.variants.js";

export interface HeroHeaderProps {
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

export const HeroHeader = (p: HeroHeaderProps) => (
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

export const BentoGrid = ({
  variant,
  compact,
}: {
  variant: HeroBentoVariant;
  compact: boolean;
}) => {
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
