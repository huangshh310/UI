"use client";

/**
 * AiCitation 内部子部件：正文行内角标、Perplexity 风格横向来源条与分层引文预览卡。
 */
import { cn } from "@matt-ui/utils";
import { ArrowUpRight, BookOpen, FileText, Globe } from "lucide-react";
import type { AiCitationSource } from "./ai-citation.types.js";

const CITATION_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

const formatRelevanceLabel = (score?: string) => {
  if (!score) return null;
  const match = score.match(/(\d+)/);
  return match ? `相关度 ${Math.min(100, Number(match[1]))}%` : score;
};

const gridColumnsClass = (count: number) => {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-3";
};

export const CitationAnswerBlock = ({
  answer,
  sources,
  activeId,
  onPick,
}: {
  answer: string;
  sources: AiCitationSource[];
  activeId?: string;
  onPick: (src: AiCitationSource) => void;
}) => (
  <p className="m-0 text-sm leading-relaxed text-foreground/95">
    <span>{answer}</span>
    {sources.length > 0 && (
      <span className="ml-1.5 inline-flex flex-wrap items-center gap-1 align-middle">
        {sources.map((src) => {
          const isSelected = src.id === activeId;
          return (
            <button
              key={src.id}
              type="button"
              aria-label={`引用 ${src.index}`}
              aria-pressed={isSelected}
              onClick={() => onPick(src)}
              className={cn(
                "inline-flex size-4.5 -translate-y-0.5 cursor-pointer items-center justify-center rounded-full border border-solid font-mono text-[10px] font-semibold tabular-nums transition-all",
                CITATION_FOCUS_RING,
                isSelected
                  ? "border-foreground bg-foreground text-background shadow-2xs"
                  : "border-border bg-muted/70 text-muted-foreground hover:border-foreground/35 hover:bg-muted hover:text-foreground dark:border-white/15 dark:bg-white/[0.06]",
              )}
            >
              {src.index}
            </button>
          );
        })}
      </span>
    )}
  </p>
);

const CitationSourceCard = ({
  source,
  selected,
  onPick,
}: {
  source: AiCitationSource;
  selected: boolean;
  onPick: (src: AiCitationSource) => void;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={() => onPick(source)}
    className={cn(
      "group flex min-w-0 cursor-pointer flex-col gap-1.5 rounded-lg border border-solid p-2.5 text-left transition-all",
      CITATION_FOCUS_RING,
      selected
        ? "border-foreground/35 bg-card shadow-xs ring-1 ring-foreground/10 dark:border-white/30 dark:bg-white/[0.07] dark:ring-white/10"
        : "border-border/75 bg-muted/20 hover:border-foreground/25 hover:bg-muted/40 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]",
    )}
  >
    <div className="flex min-w-0 items-center gap-1.5">
      <span
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold tabular-nums transition-colors",
          selected
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground group-hover:text-foreground dark:bg-white/10",
        )}
      >
        {source.index}
      </span>
      <span className="truncate font-mono text-[11px] text-muted-foreground">{source.domain}</span>
    </div>
    <span className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
      {source.title}
    </span>
  </button>
);

export const CitationSourceStrip = ({
  sources,
  activeId,
  onPick,
}: {
  sources: AiCitationSource[];
  activeId?: string;
  onPick: (src: AiCitationSource) => void;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <BookOpen aria-hidden="true" className="size-3 shrink-0" />
      <span>参考来源</span>
      <span className="font-mono tabular-nums">({sources.length})</span>
    </div>
    <div className={cn("grid gap-2", gridColumnsClass(sources.length))}>
      {sources.map((src) => (
        <CitationSourceCard
          key={src.id}
          source={src}
          selected={src.id === activeId}
          onPick={onPick}
        />
      ))}
    </div>
  </div>
);

const CitationPreviewHeader = ({ source }: { source: AiCitationSource }) => {
  const relevance = formatRelevanceLabel(source.score);
  const SourceIcon = source.url ? Globe : FileText;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-solid border-border/75 bg-card text-muted-foreground dark:border-white/10 dark:bg-white/[0.05]"
        >
          <SourceIcon className="size-3.5" />
        </span>
        <span className="truncate text-xs font-semibold tracking-tight text-foreground">
          {source.title}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {relevance && (
          <span className="inline-flex items-center rounded-md border border-solid border-emerald-600/20 bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[11px] font-medium text-emerald-800 tabular-nums dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-200">
            {relevance}
          </span>
        )}
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`打开原文 ${source.domain}`}
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-md border border-solid border-border/75 bg-card text-foreground transition-colors hover:border-foreground/30 hover:bg-accent dark:border-white/10 dark:bg-white/[0.05]",
              CITATION_FOCUS_RING,
            )}
          >
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground/70"
          >
            <ArrowUpRight className="size-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};

export const CitationSourcePreview = ({
  source,
  inline,
}: {
  source: AiCitationSource;
  inline: boolean;
}) => (
  <div
    className={cn(
      "flex flex-col gap-2.5 rounded-lg border border-solid p-3.5",
      inline
        ? "border-border bg-card shadow-xs dark:border-white/10"
        : "border-border/80 bg-muted/35 dark:border-white/10 dark:bg-white/[0.03]",
    )}
  >
    <CitationPreviewHeader source={source} />
    <blockquote className="m-0 border-l-2 border-solid border-foreground/20 pl-3 text-[13px] leading-relaxed text-foreground/90 dark:border-white/25">
      “{source.snippet}”
    </blockquote>
    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground tabular-nums">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="truncate">{source.domain}</span>
        {source.publishedAt && <span className="shrink-0">· 更新于 {source.publishedAt}</span>}
      </div>
      {source.badge && (
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground dark:bg-white/[0.06]">
          {source.badge}
        </span>
      )}
    </div>
  </div>
);
