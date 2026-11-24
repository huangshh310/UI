"use client";

import { Check, ChevronDown, ChevronUp, CircleDashed, Copy, X } from "lucide-react";
import { cn } from "@matt-ui/utils";
import type {
  AiTestCase,
  AiTestDiffLine,
  AiTestFailure,
  AiTestFilter,
  AiTestStatus,
} from "./ai-test-results.types.js";

const FILTER_META: Array<{ key: AiTestFilter; label: string }> = [
  { key: "all", label: "全部" },
  { key: "failed", label: "失败" },
  { key: "skipped", label: "跳过" },
  { key: "slow", label: "慢速" },
];

export function FilterToolbar(p: {
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

export function TestFailurePanel({ failure }: { failure: AiTestFailure }) {
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

export function TestCaseRow({
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
