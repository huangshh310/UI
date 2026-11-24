"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { cn } from "@matt-ui/utils";
import { FilterToolbar, TestCaseRow } from "./ai-test-results.diff.js";
import type {
  AiTestCase,
  AiTestFile,
  AiTestFilter,
  AiTestResultsProps,
  AiTestRunSummary,
} from "./ai-test-results.types.js";
import {
  TEST_RESULTS_DEFAULT_FILES,
  TEST_RESULTS_DEFAULT_SUMMARY,
  aiTestResultsContainerVariants,
} from "./ai-test-results.variants.js";

function computeSummary(files: AiTestFile[]): AiTestRunSummary {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let totalMs = 0;
  for (const file of files) {
    totalMs += file.durationMs;
    for (const c of file.cases) {
      if (c.status === "passed") passed += 1;
      else if (c.status === "failed") failed += 1;
      else skipped += 1;
    }
  }
  const duration = totalMs >= 1000 ? `${(totalMs / 1000).toFixed(1)}s` : `${totalMs}ms`;
  return { passed, failed, skipped, duration };
}

function matchesFilter(item: AiTestCase, filter: AiTestFilter, slowThresholdMs: number): boolean {
  if (filter === "all") return true;
  if (filter === "failed") return item.status === "failed";
  if (filter === "skipped") return item.status === "skipped";
  return item.durationMs >= slowThresholdMs;
}

function FileSuiteList({
  visibleCases,
  expandedCases,
  onToggleCase,
}: {
  visibleCases: AiTestCase[];
  expandedCases: Record<string, boolean>;
  onToggleCase: (id: string) => void;
}) {
  const suites = Array.from(new Set(visibleCases.map((c) => c.suite ?? "")));
  return (
    <div className="mt-1.5 ml-1.5 space-y-2 border-l border-border/70 pl-4">
      {suites.map((suite) => (
        <div key={suite || "default"} className="space-y-0.5">
          {suite ? <p className="text-xs font-medium text-foreground">{suite}</p> : null}
          <div className="pl-2">
            {visibleCases
              .filter((c) => (c.suite ?? "") === suite)
              .map((c) => (
                <TestCaseRow
                  key={c.id}
                  item={c}
                  expanded={expandedCases[c.id] ?? c.status === "failed"}
                  onToggle={() => onToggleCase(c.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TestFileGroup(p: {
  file: AiTestFile;
  visibleCases: AiTestCase[];
  open: boolean;
  expandedCases: Record<string, boolean>;
  onToggleFile: () => void;
  onToggleCase: (id: string) => void;
}) {
  const failedCount = p.file.cases.filter((c) => c.status === "failed").length;
  const totalCount = p.file.totalCount ?? p.file.cases.length;

  return (
    <div className="py-2 first:pt-1">
      <button
        type="button"
        onClick={p.onToggleFile}
        aria-expanded={p.open}
        className="flex w-full items-center justify-between gap-3 rounded-md py-1 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex min-w-0 items-center gap-2">
          {failedCount > 0 ? (
            <XCircle className="size-3.5 shrink-0 text-destructive" aria-hidden="true" />
          ) : (
            <CheckCircle2
              className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
          )}
          <span className="truncate font-mono text-xs text-foreground/90">{p.file.path}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[11px] tabular-nums text-muted-foreground">
          <span>
            {failedCount > 0 ? `${failedCount} 失败 · ` : ""}
            {totalCount} 用例 · {p.file.durationMs}ms
          </span>
          {p.open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </div>
      </button>
      {p.open ? (
        <FileSuiteList
          visibleCases={p.visibleCases}
          expandedCases={p.expandedCases}
          onToggleCase={p.onToggleCase}
        />
      ) : null}
    </div>
  );
}

function ResultsHeader({
  failed,
  summaryLine,
  open,
  onToggle,
}: {
  failed: number;
  summaryLine: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center justify-between gap-3 pb-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center gap-2 text-xs">
        {failed > 0 ? (
          <XCircle className="size-4 shrink-0 text-destructive" aria-hidden="true" />
        ) : (
          <CheckCircle2
            className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
        )}
        <span className="font-medium text-foreground">{summaryLine}</span>
      </div>
      {open ? (
        <ChevronUp className="size-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="size-4 text-muted-foreground" />
      )}
    </button>
  );
}

function buildMetrics(
  files: AiTestFile[],
  custom: AiTestRunSummary | undefined,
  slowThresholdMs: number,
) {
  const summary =
    custom ??
    (files === TEST_RESULTS_DEFAULT_FILES ? TEST_RESULTS_DEFAULT_SUMMARY : computeSummary(files));
  const counts: Record<AiTestFilter, number> = {
    all: summary.passed + summary.failed + summary.skipped,
    failed: summary.failed,
    skipped: summary.skipped,
    slow: files.flatMap((f) => f.cases).filter((c) => c.durationMs >= slowThresholdMs).length,
  };
  const summaryLine = `${summary.passed} 通过，${summary.failed} 失败，${summary.skipped} 跳过 · ${summary.duration}`;
  return { summary, counts, summaryLine };
}

function TestFilesBody(p: { files: AiTestFile[]; filter: AiTestFilter; slowThresholdMs: number }) {
  const [closedFiles, setClosedFiles] = useState<Record<string, boolean>>({});
  const [expandedCases, setExpandedCases] = useState<Record<string, boolean>>({});

  return (
    <div className="divide-y divide-border/50">
      {p.files.map((file) => {
        const visibleCases = file.cases.filter((c) =>
          matchesFilter(c, p.filter, p.slowThresholdMs),
        );
        if (visibleCases.length === 0) return null;
        return (
          <TestFileGroup
            key={file.id}
            file={file}
            visibleCases={visibleCases}
            open={!closedFiles[file.id]}
            expandedCases={expandedCases}
            onToggleFile={() => setClosedFiles((prev) => ({ ...prev, [file.id]: !prev[file.id] }))}
            onToggleCase={(id) =>
              setExpandedCases((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }))
            }
          />
        );
      })}
    </div>
  );
}

const DEFAULT_RESULTS_CFG = {
  files: TEST_RESULTS_DEFAULT_FILES,
  slowThresholdMs: 200,
  defaultFilter: "all" as AiTestFilter,
  defaultOpen: true,
  variant: "card" as const,
};

/**
 * AI 测试执行报告面板，对标 HextaUI Test Results：
 * 展示通过/失败/跳过汇总、状态筛选胶囊、文件级折叠树以及默认展开的失败断言 Diff。
 */
export function AiTestResults(props: AiTestResultsProps) {
  const cfg = { ...DEFAULT_RESULTS_CFG, ...props };
  const [open, setOpen] = useState(cfg.defaultOpen);
  const [filter, setFilter] = useState<AiTestFilter>(cfg.defaultFilter);
  const [copied, setCopied] = useState(false);
  const { summary, counts, summaryLine } = buildMetrics(
    cfg.files,
    props.summary,
    cfg.slowThresholdMs,
  );

  const handleCopy = () => {
    props.onCopy?.(summaryLine);
    navigator.clipboard?.writeText(summaryLine).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={cn(aiTestResultsContainerVariants({ variant: cfg.variant }), props.className)}>
      <ResultsHeader
        failed={summary.failed}
        summaryLine={summaryLine}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />
      {open ? (
        <div className="ml-2 border-l border-border/70 pl-4">
          <FilterToolbar
            filter={filter}
            counts={counts}
            copied={copied}
            onSelect={setFilter}
            onCopy={handleCopy}
          />
          <TestFilesBody files={cfg.files} filter={filter} slowThresholdMs={cfg.slowThresholdMs} />
        </div>
      ) : null}
    </div>
  );
}
