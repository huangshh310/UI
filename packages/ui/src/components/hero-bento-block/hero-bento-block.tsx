"use client";

/**
 * HeroBentoBlock：由 Badge、Button、AvatarStack、SpotlightCard 与 Progress 组合的落地页首屏与 Bento 特性网格区块。
 */
import { cn } from "@matt-ui/utils";
import { ArrowRight, Layers, ShieldCheck, Zap } from "lucide-react";
import { AvatarStack } from "../avatar-stack/index.js";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { Progress } from "../progress/index.js";
import { SpotlightCard } from "../spotlight-card/index.js";
import type { HeroBentoBlockProps } from "./hero-bento-block.types.js";

const TEAMS = [
  { id: "1", name: "林知远", role: "前端架构", initials: "林", status: "online" as const },
  { id: "2", name: "周宁", role: "设计系统", initials: "周", status: "online" as const },
  { id: "3", name: "陈屿", role: "交互设计", initials: "陈" },
  { id: "4", name: "许澄", role: "质量工程", initials: "许" },
];

const AccessibilityCard = () => (
  <SpotlightCard tone="neutral" className="flex flex-col justify-between gap-3 p-5 @2xl:col-span-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3.5">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground">
          <ShieldCheck aria-hidden="true" className="size-4.5" />
        </span>
        <div>
          <p className="m-0 text-sm font-semibold tracking-tight text-foreground">
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

const BentoGrid = () => (
  <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-3">
    <SpotlightCard
      tone="neutral"
      className="flex flex-col justify-between gap-4 p-5 @2xl:col-span-2"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-secondary text-foreground">
          <Layers aria-hidden="true" className="size-4.5" />
        </span>
        <Badge variant="secondary">云端空间</Badge>
      </div>
      <div>
        <p className="m-0 text-base font-semibold tracking-tight text-foreground">
          一处整理你的灵感、文档与项目进度
        </p>
        <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
          从零碎想法到正式发布，在同一块纯净画布上与团队顺畅接力协作。
        </p>
      </div>
      <Progress value={84} tone="primary" showValue label="本季度目标完成度" />
    </SpotlightCard>
    <SpotlightCard tone="neutral" className="flex flex-col justify-between gap-4 p-5">
      <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-secondary text-foreground">
        <Zap aria-hidden="true" className="size-4.5" />
      </span>
      <div>
        <p className="m-0 font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums">
          12ms
        </p>
        <p className="m-0 mt-1.5 text-xs font-medium text-foreground">几乎零感知的交互反馈</p>
        <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
          原生手势与流畅弹簧动画，让每次操作都有真实的物理触感。
        </p>
      </div>
    </SpotlightCard>
    <AccessibilityCard />
  </div>
);

export const HeroBentoBlock = ({
  announcement = "新版本上线 · 空间画板 2.0",
  headline = "让创意从灵感到落地，每一步都轻盈顺手",
  subheadline = "专为独立创作者与产品团队打造的极简协作空间，告别繁琐菜单与视觉干扰。",
  onPrimaryClick,
  onSecondaryClick,
  className,
}: HeroBentoBlockProps) => (
  <div
    data-slot="hero-bento-block"
    className={cn(
      "@container relative flex w-full flex-col gap-7 overflow-hidden rounded-[26px] border border-solid border-border bg-card p-6 shadow-xs sm:p-8",
      className,
    )}
  >
    <div className="flex flex-col items-start gap-4">
      <Badge variant="secondary" dot>
        {announcement}
      </Badge>
      <p className="m-0 max-w-2xl text-2xl leading-[1.16] font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
        {headline}
      </p>
      <p className="m-0 max-w-xl text-sm leading-relaxed text-muted-foreground">{subheadline}</p>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button variant="primary" size="lg" className="rounded-full" onClick={onPrimaryClick}>
          <span>免费开始</span>
          <ArrowRight className="size-4" />
        </Button>
        <Button variant="outline" size="lg" className="rounded-full" onClick={onSecondaryClick}>
          了解更多
        </Button>
        <div className="flex items-center gap-2.5 pl-1">
          <AvatarStack items={TEAMS} max={4} size="sm" />
          <span className="text-xs text-muted-foreground">超过 12,000 支团队正在使用</span>
        </div>
      </div>
    </div>
    <BentoGrid />
  </div>
);
