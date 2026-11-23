"use client";

/**
 * AiCitation：Perplexity / ChatGPT Search / Claude Citations 风格的行内角标引用与磨砂玻璃 RAG 溯源卡。
 */
import { cn } from "@matt-ui/utils";
import { ArrowUpRight, BookOpen, CheckCircle2, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "../badge/index.js";
import type { AiCitationProps, AiCitationSource, AiCitationVariant } from "./ai-citation.types.js";
import {
  CITATION_DEFAULT_ANSWER,
  CITATION_DEFAULT_SOURCES,
  citationShellVariants,
} from "./ai-citation.variants.js";

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
