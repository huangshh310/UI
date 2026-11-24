// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDashed,
  Copy,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export const aiTestResultsContainerVariants = cva("w-full text-foreground", {
  variants: {
    variant: {
      card: "rounded-2xl border border-border bg-card/95 p-4 shadow-sm sm:p-5",
      seamless: "bg-transparent p-0",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const TEST_RESULTS_DEFAULT_SUMMARY: AiTestRunSummary = {
  passed: 39,
  failed: 2,
  skipped: 1,
  duration: "6.3s",
};

export const TEST_RESULTS_DEFAULT_FILES: AiTestFile[] = [
  {
    id: "file-pricing",
    path: "src/cart/pricing.test.ts",
    durationMs: 134,
    totalCount: 6,
    cases: [
      {
        id: "t-1",
        suite: "applyCoupon",
        name: "按小计减免 10% 折扣",
        status: "passed",
        durationMs: 3,
      },
      {
        id: "t-2",
        suite: "applyCoupon",
        name: "同一张优惠券仅生效一次",
        status: "failed",
        durationMs: 4,
        failure: {
          name: "AssertionError",
          message:
            "expected { subtotal: 4200, discount: 840, ...(1) } to deeply equal { subtotal: 4200, discount: 420, ...(1) }",
          diff: [
            { type: "context", text: "Object {" },
            { type: "expected", text: '  "discount": 420,' },
            { type: "received", text: '  "discount": 840,' },
            { type: "context", text: '  "subtotal": 4200,' },
            { type: "expected", text: '  "total": 3780,' },
            { type: "received", text: '  "total": 3360,' },
            { type: "context", text: "}" },
          ],
        },
      },
      {
        id: "t-3",
        suite: "applyCoupon",
        name: "兼容旧版多币种四舍五入",
        status: "skipped",
        durationMs: 0,
      },
    ],
  },
  {
    id: "file-checkout",
    path: "src/cart/checkout.test.ts",
    durationMs: 812,
    totalCount: 4,
    cases: [
      {
        id: "t-4",
        suite: "checkoutBatch",
        name: "批量结算 500 笔订单",
        status: "passed",
        durationMs: 418,
      },
      {
        id: "t-5",
        suite: "checkoutBatch",
        name: "幂等键防重放校验",
        status: "failed",
        durationMs: 265,
        failure: {
          name: "AssertionError",
          message: "expected 200 to strictly equal 409",
          diff: [
            { type: "expected", text: "409" },
            { type: "received", text: "200" },
          ],
        },
      },
    ],
  },
];
export type AiTestStatus = "passed" | "failed" | "skipped";

export type AiTestFilter = "all" | "failed" | "skipped" | "slow";

export type AiTestResultsVariant = "card" | "seamless";

export interface AiTestDiffLine {
  type: "context" | "expected" | "received";
  text: string;
}

export interface AiTestFailure {
  name: string;
  message: string;
  diff?: AiTestDiffLine[];
}

export interface AiTestCase {
  id: string;
  suite?: string;
  name: string;
  status: AiTestStatus;
  durationMs: number;
  failure?: AiTestFailure;
}

export interface AiTestFile {
  id: string;
  path: string;
  durationMs: number;
  /** 文件真实总用例数（可选，不传则按 cases.length 计算） */
  totalCount?: number;
  cases: AiTestCase[];
}

export interface AiTestRunSummary {
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
}

export interface AiTestResultsProps {
  /** 测试文件分组列表；不传则使用内置演示数据 */
  files?: AiTestFile[];
  /** 汇总计数（可选，不传则自动从 files 聚合） */
  summary?: AiTestRunSummary;
  /** 判定为“慢速”用例的阈值（毫秒），默认 200 */
  slowThresholdMs?: number;
  /** 初始激活的筛选条件，默认 "all" */
  defaultFilter?: AiTestFilter;
  /** 是否默认展开整体面板，默认 true */
  defaultOpen?: boolean;
  /** 容器视觉风格：标准卡片（card）或无框画布（seamless） */
  variant?: AiTestResultsVariant;
  /** 复制测试报告回调 */
  onCopy?: (summaryText: string) => void;
  /** 自定义类名 */
  className?: string;
}
const FILTER_META: Array<{ key: AiTestFilter; label: string }> = [
  { key: "all", label: "全部" },
  { key: "failed", label: "失败" },
  { key: "skipped", label: "跳过" },
  { key: "slow", label: "慢速" },
];

function FilterToolbar(p: {
  filter: AiTestFilter;
  counts: Record<AiTestFilter, number>;
  copied: boolean;
  onSelect: (next: AiTestFilter) => void;
  onCopy: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
      <fieldset
        aria-label="测试结果筛选"
        className="m-0 flex flex-wrap items-center gap-1 border-0 p-0"
      >
        {FILTER_META.map((opt) => (
          <button
            key={opt.key}
            type="button"
            aria-pressed={p.filter === opt.key}
            onClick={() => p.onSelect(opt.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              p.filter === opt.key
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <span>{opt.label}</span>
            <span className="tabular-nums text-[11px] text-muted-foreground">
              {p.counts[opt.key]}
            </span>
          </button>
        ))}
      </fieldset>
      <button
        type="button"
        onClick={p.onCopy}
        aria-label="复制测试报告"
        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {p.copied ? (
          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  );
}

function DiffLineRow({ line }: { line: AiTestDiffLine }) {
  const prefix = line.type === "expected" ? "-" : line.type === "received" ? "+" : " ";
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 px-3 py-0.5 font-mono text-[11.5px] leading-5",
        line.type === "expected" && "bg-emerald-500/12 text-emerald-950 dark:text-emerald-100",
        line.type === "received" && "bg-rose-500/12 text-rose-950 dark:text-rose-100",
        line.type === "context" && "text-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "w-3 shrink-0 select-none text-center font-semibold",
          line.type === "expected" && "text-emerald-800 dark:text-emerald-300",
          line.type === "received" && "text-rose-800 dark:text-rose-300",
          line.type === "context" && "text-muted-foreground",
        )}
      >
        {prefix}
      </span>
      <span className="min-w-0 whitespace-pre-wrap break-all">{line.text}</span>
    </div>
  );
}

function TestFailurePanel({ failure }: { failure: AiTestFailure }) {
  return (
    <div className="mt-2 ml-5 space-y-2">
      <div className="space-y-0.5 font-mono text-[11.5px] leading-relaxed">
        <p className="font-medium text-muted-foreground">{failure.name}</p>
        <p className="text-foreground">{failure.message}</p>
      </div>
      {failure.diff && failure.diff.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border/80 bg-background">
          <div className="flex items-center gap-3 border-b border-border/70 px-3 py-1.5 font-mono text-[11px]">
            <span className="font-medium text-emerald-800 dark:text-emerald-300">- Expected</span>
            <span className="font-medium text-rose-800 dark:text-rose-300">+ Received</span>
          </div>
          <div className="py-1.5">
            {failure.diff.map((line, index) => (
              <DiffLineRow key={`${line.type}-${index}`} line={line} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TestStatusIcon({ status }: { status: AiTestStatus }) {
  if (status === "passed") {
    return (
      <Check
        className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-hidden="true"
      />
    );
  }
  if (status === "failed") {
    return <X className="size-3.5 shrink-0 text-destructive" aria-hidden="true" />;
  }
  return <CircleDashed className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />;
}

const TEST_NAME_TONE: Record<AiTestStatus, string> = {
  failed: "font-medium text-foreground",
  passed: "text-foreground/80",
  skipped: "text-muted-foreground",
};

function TestCaseRow({
  item,
  expanded,
  onToggle,
}: {
  item: AiTestCase;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="py-1">
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex min-w-0 items-center gap-2">
          <TestStatusIcon status={item.status} />
          <span className={cn("truncate", TEST_NAME_TONE[item.status])}>{item.name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="tabular-nums text-[11px] text-muted-foreground">
            {item.status === "skipped" ? "跳过" : `${item.durationMs}ms`}
          </span>
          {item.failure ? (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              aria-label={`${expanded ? "收起" : "展开"}用例 ${item.name}`}
              className="inline-flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
          ) : null}
        </div>
      </div>
      {expanded && item.failure ? <TestFailurePanel failure={item.failure} /> : null}
    </div>
  );
}
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
