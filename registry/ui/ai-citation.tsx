// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiCitation：Perplexity / ChatGPT Search / Claude Citations 风格的行内角标引用与磨砂玻璃 RAG 溯源卡。
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ArrowUpRight, BookOpen, CheckCircle2, FileText } from "lucide-react";
import { useState } from "react";

export const citationShellVariants = cva("flex w-full max-w-xl flex-col text-card-foreground", {
  variants: {
    variant: {
      card: "gap-3.5 rounded-2xl border border-solid border-border/85 bg-card p-5 shadow-xs",
      popover: "gap-3 rounded-2xl border border-solid border-border/80 bg-card/80 p-4 shadow-xs",
      inline: "gap-2.5 bg-transparent p-0",
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
export type AiCitationVariant = "card" | "popover" | "inline";

export interface AiCitationSource {
  id: string;
  index: number;
  title: string;
  domain: string;
  snippet: string;
  score?: string;
  badge?: string;
  /** 可选原文链接地址 */
  url?: string;
  /** 可选文档更新或发布时间 */
  publishedAt?: string;
}

export interface AiCitationProps {
  /** 视觉布局形态：标准溯源卡（card）、磨砂浮层预览（popover）或极简内联条（inline） */
  variant?: AiCitationVariant;
  /** 可选 AI 回答正文（展示行内角标与下方来源卡片的联动上下文） */
  answer?: string;
  /** 检索到的知识源列表 */
  sources?: AiCitationSource[];
  /** 初始激活的来源 ID */
  defaultActiveId?: string;
  /** 切换来源回调 */
  onSelect?: (source: AiCitationSource) => void;
  /** 自定义类名 */
  className?: string;
}
const parseScorePct = (score?: string) => {
  const match = score?.match(/(\d+)/);
  return match ? Math.min(100, Number(match[1])) : 92;
};

const CitationSourceMeta = ({ source, pct }: { source: AiCitationSource; pct: number }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
    <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
      <FileText aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{source.domain}</span>
          <ArrowUpRight aria-hidden="true" className="size-3" />
        </a>
      ) : (
        <span className="inline-flex items-center gap-1">
          <span>{source.domain}</span>
          <ArrowUpRight aria-hidden="true" className="size-3 opacity-70" />
        </span>
      )}
      {source.publishedAt && <span className="text-muted-foreground">· {source.publishedAt}</span>}
    </div>
    <div aria-hidden="true" className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
      <div className="h-full rounded-full bg-signal" style={{ width: `${pct}%` }} />
    </div>
  </div>
);

const CitationCard = ({ source, elevated }: { source: AiCitationSource; elevated: boolean }) => (
  <div
    className={cn(
      "flex flex-col gap-3 rounded-2xl border border-solid border-border/80 bg-popover/96 p-4 text-popover-foreground backdrop-blur-xl transition-all",
      elevated ? "shadow-lg" : "shadow-xs",
    )}
  >
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="inline-flex size-5.5 shrink-0 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-semibold text-signal-foreground">
          {source.index}
        </span>
        <span className="truncate text-[13px] font-semibold tracking-tight text-foreground">
          {source.title}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {source.badge && (
          <Badge variant="outline" shape="tag">
            {source.badge}
          </Badge>
        )}
        {source.score && (
          <span className="rounded-full border border-solid border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10.5px] font-medium text-emerald-700 dark:text-emerald-300">
            {source.score}
          </span>
        )}
      </div>
    </div>
    <p className="m-0 border-l-2 border-solid border-signal/50 pl-3 text-[13px] leading-relaxed text-muted-foreground">
      “{source.snippet}”
    </p>
    <CitationSourceMeta source={source} pct={parseScorePct(source.score)} />
  </div>
);

const CitationPillList = ({
  sources,
  activeId,
  variant,
  onPick,
}: {
  sources: AiCitationSource[];
  activeId?: string;
  variant: AiCitationVariant;
  onPick: (src: AiCitationSource) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5">
    {sources.map((src) => {
      const isSelected = src.id === activeId;
      return (
        <button
          key={src.id}
          type="button"
          aria-pressed={isSelected}
          onClick={() => onPick(src)}
          className={cn(
            "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-2.5 font-mono text-[11px] font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isSelected
              ? "border-signal bg-signal text-signal-foreground shadow-xs"
              : "border-border/85 bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground dark:bg-secondary/50",
          )}
        >
          <span>[{src.index}]</span>
          <span className={variant === "popover" ? "sr-only" : "max-w-28 truncate font-sans"}>
            {src.title}
          </span>
        </button>
      );
    })}
  </div>
);

const CitationHeader = ({ count }: { count: number }) => (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-2 text-xs font-semibold tracking-tight text-foreground">
      <BookOpen aria-hidden="true" className="size-3.5 text-muted-foreground" />
      <span>已引用 {count} 处知识库上下文</span>
    </div>
    <span className="inline-flex items-center gap-1 rounded-full border border-solid border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
      <CheckCircle2 aria-hidden="true" className="size-3" />
      已校验来源
    </span>
  </div>
);

const resolveCitationDefaults = (props: AiCitationProps) => {
  const sources = props.sources ?? CITATION_DEFAULT_SOURCES;
  return {
    variant: props.variant ?? "card",
    answer: props.answer ?? CITATION_DEFAULT_ANSWER,
    sources,
    initialId: props.defaultActiveId ?? sources[0]?.id ?? "",
  };
};

export const AiCitation = (props: AiCitationProps) => {
  const cfg = resolveCitationDefaults(props);
  const [activeId, setActiveId] = useState(cfg.initialId);
  const active = cfg.sources.find((s) => s.id === activeId) ?? cfg.sources[0];

  return (
    <div
      data-slot="ai-citation"
      data-variant={cfg.variant}
      className={cn(citationShellVariants({ variant: cfg.variant }), props.className)}
    >
      {cfg.variant !== "inline" && <CitationHeader count={cfg.sources.length} />}
      {cfg.answer && (
        <p className="m-0 text-[13.5px] leading-relaxed text-foreground/92">{cfg.answer}</p>
      )}
      <CitationPillList
        sources={cfg.sources}
        activeId={active?.id}
        variant={cfg.variant}
        onPick={(src) => {
          setActiveId(src.id);
          props.onSelect?.(src);
        }}
      />
      {active && <CitationCard source={active} elevated={cfg.variant === "popover"} />}
    </div>
  );
};
