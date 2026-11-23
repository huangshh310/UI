"use client";

/**
 * AiCitation：Perplexity / ChatGPT Search 风格的行内角标引用与 RAG 检索上下文卡片。
 */
import { cn } from "@matt-ui/utils";
import { ArrowUpRight, BookOpen, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "../badge/index.js";
import type { AiCitationProps, AiCitationSource } from "./ai-citation.types.js";

const DEFAULT_ANSWER =
  "组件平台遵循单交互底座规约，在浅色与深色下自动维持 WCAG AA 对比度，并通过扁平化生成器输出零冗余 Registry 单文件。";

const DEFAULT_SOURCES: AiCitationSource[] = [
  {
    id: "adr",
    index: 1,
    title: "ADR-001 交互底座选型规约",
    domain: "docs/architecture",
    badge: "ADR",
    score: "98% 匹配",
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
    snippet: "所有前景与表面对比度不低于 4.5:1，输入框边线与焦点环对背景不低于 3:1。",
  },
  {
    id: "reg",
    index: 3,
    title: "shadcn Registry 源码扁平化器",
    domain: "scripts/registry",
    badge: "CODE",
    score: "91% 匹配",
    snippet: "兄弟目录导入自动登记为 registryDependencies，使用者单条命令即可拉取完整依赖图。",
  },
];

const parseScorePct = (score?: string) => {
  const match = score?.match(/(\d+)/);
  return match ? Math.min(100, Number(match[1])) : 92;
};

const CitationCard = ({ source }: { source: AiCitationSource }) => {
  const pct = parseScorePct(source.score);
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-solid border-border/80 bg-secondary/45 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex size-5.5 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-semibold text-primary-foreground">
            {source.index}
          </span>
          <span className="truncate text-[13px] font-semibold text-foreground">{source.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {source.badge && (
            <Badge variant="outline" shape="tag">
              {source.badge}
            </Badge>
          )}
          {source.score && (
            <Badge variant="secondary" shape="tag">
              {source.score}
            </Badge>
          )}
        </div>
      </div>
      <p className="m-0 border-l-2 border-solid border-border pl-3 text-[13px] leading-relaxed text-muted-foreground">
        “{source.snippet}”
      </p>
      <div className="flex items-center justify-between gap-3 pt-0.5">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <FileText aria-hidden="true" className="size-3 text-muted-foreground" />
          <span>{source.domain}</span>
          <ArrowUpRight aria-hidden="true" className="size-3 opacity-70" />
        </div>
        <div aria-hidden="true" className="h-1 w-20 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-foreground/75" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};

const CitationPillList = ({
  sources,
  activeId,
  onPick,
}: {
  sources: AiCitationSource[];
  activeId?: string;
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
              ? "border-primary bg-primary text-primary-foreground shadow-xs"
              : "border-border bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground dark:bg-secondary/50",
          )}
        >
          <span>[{src.index}]</span>
          <span className="max-w-28 truncate font-sans">{src.title}</span>
        </button>
      );
    })}
  </div>
);

export const AiCitation = ({
  answer = DEFAULT_ANSWER,
  sources = DEFAULT_SOURCES,
  defaultActiveId,
  onSelect,
  className,
}: AiCitationProps) => {
  const [activeId, setActiveId] = useState(defaultActiveId ?? sources[0]?.id ?? "");
  const active = sources.find((s) => s.id === activeId) ?? sources[0];

  return (
    <div
      data-slot="ai-citation"
      className={cn(
        "flex w-full max-w-xl flex-col gap-3.5 rounded-[22px] border border-solid border-border bg-card p-5 text-card-foreground shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <BookOpen aria-hidden="true" className="size-3.5 text-muted-foreground" />
          <span>已引用 {sources.length} 处知识库上下文</span>
        </div>
        <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
          已校验来源
        </span>
      </div>
      {answer && <p className="m-0 text-[13px] leading-relaxed text-foreground/90">{answer}</p>}
      <CitationPillList
        sources={sources}
        activeId={active?.id}
        onPick={(src) => (setActiveId(src.id), onSelect?.(src))}
      />
      {active && <CitationCard source={active} />}
    </div>
  );
};
