/**
 * AiCitation 视觉变体与内置 RAG 检索来源。
 */
import { cva } from "class-variance-authority";
import type { AiCitationSource } from "./ai-citation.types.js";

export const citationShellVariants = cva("flex w-full flex-col text-card-foreground", {
  variants: {
    variant: {
      card: "gap-3.5 overflow-hidden rounded-xl border border-solid border-border bg-card p-4 shadow-xs dark:border-white/10",
      popover:
        "gap-3.5 overflow-hidden rounded-xl border border-solid border-border bg-popover/95 p-4 text-popover-foreground shadow-md backdrop-blur-md dark:border-white/10",
      inline: "gap-3 bg-transparent p-0",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const CITATION_DEFAULT_ANSWER =
  "组件平台遵循单交互底座规约，在浅色与深色下自动维持 WCAG AA 对比度，并通过扁平化生成器输出零冗余 Registry 单文件。";

export const CITATION_DEFAULT_SOURCES: AiCitationSource[] = [
  {
    id: "adr",
    index: 1,
    title: "ADR-001 交互底座选型规约",
    domain: "docs/architecture",
    badge: "ADR",
    score: "98% 匹配",
    publishedAt: "2026-11",
    snippet:
      "一个组件的交互行为只来自一个交互底座；Base UI 缺口组件采用精确锁版本的 @ui-sdk/react。",
  },
  {
    id: "wcag",
    index: 2,
    title: "WCAG 1.4.11 双主题对比度门禁",
    domain: "packages/tokens",
    badge: "SPEC",
    score: "95% 匹配",
    publishedAt: "2026-11",
    snippet: "所有前景与表面对比度不低于 4.5:1，输入框边线与焦点环对背景不低于 3:1。",
  },
  {
    id: "reg",
    index: 3,
    title: "shadcn Registry 源码扁平化器",
    domain: "scripts/registry",
    badge: "CODE",
    score: "91% 匹配",
    publishedAt: "2026-11",
    snippet: "兄弟目录导入自动登记为 registryDependencies，使用者单条命令即可拉取完整依赖图。",
  },
];
