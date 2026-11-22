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
  <SpotlightCard tone="neutral" className="flex flex-col justify-between gap-3 p-5 md:col-span-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-solid border-border bg-secondary/60 text-signal">
          <ShieldCheck aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p className="m-0 text-sm font-semibold text-foreground">双主题 WCAG AA 自动门禁</p>
          <p className="m-0 text-xs text-muted-foreground">
            浅色与深色每组 Token 均经 4.5:1 文字与 3:1 控件边界对比度校验。
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="success" dot>
          axe 0 违规
        </Badge>
        <Badge variant="outline">React 19</Badge>
      </div>
    </div>
  </SpotlightCard>
);

const BentoGrid = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <SpotlightCard glowBorder className="flex flex-col justify-between gap-4 p-5 md:col-span-2">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-xl border border-solid border-border bg-secondary/60 text-signal">
          <Layers aria-hidden="true" className="size-4" />
        </span>
        <Badge variant="secondary">shadcn Registry</Badge>
      </div>
      <div>
        <p className="m-0 text-base font-semibold text-foreground">源码直达与 npm 双通道分发</p>
        <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
          支持按单组件 CLI 拷贝源码到你的仓库，也支持通过 npm 包跨项目统一升级。
        </p>
      </div>
      <Progress value={96} tone="signal" showValue label="组件无障碍覆盖率" />
    </SpotlightCard>
    <SpotlightCard tone="neutral" className="flex flex-col justify-between gap-4 p-5">
      <span className="inline-flex size-9 items-center justify-center rounded-xl border border-solid border-border bg-secondary/60 text-foreground">
        <Zap aria-hidden="true" className="size-4" />
      </span>
      <div>
        <p className="m-0 font-mono text-2xl font-semibold text-foreground tabular-nums">
          &lt; 16ms
        </p>
        <p className="m-0 mt-1 text-xs font-medium text-foreground">零重渲染交互响应</p>
        <p className="m-0 mt-1 text-xs text-muted-foreground">
          核心组件零运行时动画依赖，按需拆分动效包。
        </p>
      </div>
    </SpotlightCard>
    <AccessibilityCard />
  </div>
);

export const HeroBentoBlock = ({
  announcement = "v2.5 · C 端触感与全栈 AI 组件体系",
  headline = "统一设计 Token、无障碍组件与高颜值页面区块",
  subheadline = "基于 React 19、Tailwind CSS v4 与 Base UI 构建，兼顾源码可控、键盘无障碍与双主题精致层次。",
  onPrimaryClick,
  onSecondaryClick,
  className,
}: HeroBentoBlockProps) => (
  <div
    data-slot="hero-bento-block"
    className={cn(
      "relative flex w-full flex-col gap-7 overflow-hidden rounded-[24px] border border-solid border-border/85 bg-card p-6 shadow-md sm:p-8",
      className,
    )}
  >
    <div className="flex flex-col items-start gap-4">
      <Badge variant="outline" dot>
        {announcement}
      </Badge>
      <p className="m-0 max-w-2xl text-2xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl">
        {headline}
      </p>
      <p className="m-0 max-w-xl text-sm leading-relaxed text-muted-foreground">{subheadline}</p>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button variant="signal" onClick={onPrimaryClick}>
          <span>开始集成</span>
          <ArrowRight className="size-4" />
        </Button>
        <Button variant="outline" onClick={onSecondaryClick}>
          查看架构文档
        </Button>
        <div className="flex items-center gap-2.5 pl-1">
          <AvatarStack items={TEAMS} max={4} size="sm" />
          <span className="text-xs text-muted-foreground">工程与设计团队共同维护</span>
        </div>
      </div>
    </div>
    <BentoGrid />
  </div>
);
