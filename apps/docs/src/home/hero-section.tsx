/**
 * 首页首屏：克制的信号色点缀、双色调大标题、双操作按钮、交互式 CLI 命令卡与指标带。
 */
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { CSSProperties } from "react";
import { COMPONENTS, TOTAL_SPECIMEN_COUNT } from "@/registry/registry";
import { LinkButton } from "@/site/link-button";
import { HeroCli } from "./hero-cli";

/** 入场动效的先后顺序 */
const order = (index: number) => ({ "--i": index }) as CSSProperties;

const STATS = [
  { value: String(COMPONENTS.length), label: "精雕组件与区块" },
  { value: String(TOTAL_SPECIMEN_COUNT), label: "场景交互示例" },
  { value: "Base UI", label: "无障碍交互底座" },
  { value: "MIT", label: "源码可控开源" },
];

/** 1px 细线切分的统计与技术指标带 */
const HeroStats = () => (
  <dl
    style={order(5)}
    className="rise mt-12 grid w-full max-w-3xl grid-cols-2 divide-y divide-border/75 overflow-hidden rounded-2xl border border-border bg-(--site-surface) text-left shadow-xs sm:grid-cols-4 sm:divide-x sm:divide-y-0"
  >
    {STATS.map(({ value, label }) => (
      <div key={label} className="px-5 py-4">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-1 font-mono text-lg font-semibold tracking-tight text-foreground tabular-nums">
          {value}
        </dd>
      </div>
    ))}
  </dl>
);

const HeroBadge = () => (
  <Link
    href="/components"
    className="rise inline-flex items-center gap-2 rounded-full border border-border bg-(--site-surface)/90 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs backdrop-blur-sm transition-colors duration-(--ui-duration-fast) hover:border-foreground/25 hover:text-foreground"
  >
    <span aria-hidden="true" className="size-2 rounded-full bg-signal" />
    <span className="font-mono">React 19 · Tailwind v4 · shadcn Registry</span>
    <ArrowRightIcon className="size-3.5" aria-hidden="true" />
  </Link>
);

export const HeroSection = () => (
  <section className="relative overflow-hidden border-b border-border/70">
    {/* 极淡的信号色顶部柔晕与点阵网格，只在背景渲染，不干扰正文对比度 */}
    <div
      aria-hidden="true"
      className="hero-aura pointer-events-none absolute inset-x-0 top-0 h-[420px]"
    />

    <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-5 pt-14 pb-16 text-center md:px-9 lg:pt-20 lg:pb-20">
      <HeroBadge />

      <h1
        style={order(1)}
        className="rise mt-7 max-w-4xl text-4xl leading-[1.08] font-semibold tracking-[-0.04em] sm:text-5xl md:text-[64px]"
      >
        为高端 C 端与
        <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-700 bg-clip-text text-transparent dark:from-blue-300 dark:via-indigo-300 dark:to-cyan-300">
          {" "}
          AI 产品
        </span>
        <br />
        <span className="text-muted-foreground">雕琢每一像素触感</span>
      </h1>

      <p
        style={order(2)}
        className="rise mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-base"
      >
        开源 React 19 组件平台，融合陶瓷光影层次、物理弹簧微交互与全栈智能体组件。 基于 Base UI
        无障碍底座与 Design Token，一条命令将完整 TypeScript 源码装进你的项目。
      </p>

      <div style={order(3)} className="rise mt-8 flex flex-wrap items-center justify-center gap-3">
        <LinkButton href="/components" tone="solid">
          浏览组件
          <ArrowRightIcon weight="bold" aria-hidden="true" />
        </LinkButton>
        <LinkButton href="/docs" tone="outline">
          快速开始
        </LinkButton>
      </div>

      <div style={order(4)} className="rise mt-9 flex w-full justify-center">
        <HeroCli />
      </div>

      <HeroStats />
    </div>
  </section>
);
