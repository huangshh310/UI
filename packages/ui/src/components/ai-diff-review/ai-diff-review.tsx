"use client";

/**
 * AiDiffReview：Cursor / Copilot 风格的 AI 代码与配置变更行级审阅卡片，支持全选/逐行勾选与应用变更。
 */
import { cn } from "@matt-ui/utils";
import { Check, FileDiff, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import type { AiDiffLine, AiDiffReviewProps } from "./ai-diff-review.types.js";

const DEFAULT_LINES: AiDiffLine[] = [
  { id: "d1", lineNumber: 14, type: "context", content: "  --ui-shadow-sm:" },
  { id: "d2", lineNumber: 15, type: "remove", content: "    0 1px 2px 0 rgba(0, 0, 0, 0.05);" },
  { id: "d3", lineNumber: 15, type: "add", content: "    inset 0 1px 0 0 var(--ui-specular)," },
  { id: "d4", lineNumber: 16, type: "add", content: "    inset 0 -1px 0 0 var(--ui-bevel)," },
  { id: "d5", lineNumber: 17, type: "context", content: "    0 3px 8px -2px rgba(0, 0, 0, 0.06);" },
];

const DiffRow = ({
  line,
  checked,
  onToggle,
}: {
  line: AiDiffLine;
  checked: boolean;
  onToggle: () => void;
}) => {
  const isChange = line.type !== "context";
  const prefix = line.type === "add" ? "+" : line.type === "remove" ? "-" : " ";
  const rowStyle =
    line.type === "add"
      ? "bg-emerald-500/10 text-foreground"
      : line.type === "remove"
        ? "bg-rose-500/10 text-foreground"
        : "bg-transparent text-muted-foreground";
  const markerStyle =
    line.type === "add"
      ? "text-emerald-700 dark:text-emerald-300"
      : line.type === "remove"
        ? "text-rose-700 dark:text-rose-300"
        : "text-muted-foreground";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 border-b border-solid border-border/50 px-3.5 py-1.5 font-mono text-xs last:border-b-0",
        rowStyle,
        isChange && !checked && "opacity-45 line-through",
      )}
    >
      {isChange ? (
        <input
          type="checkbox"
          aria-label={`采纳第 ${line.lineNumber} 行变更`}
          checked={checked}
          onChange={onToggle}
          className="size-3.5 shrink-0 cursor-pointer accent-signal"
        />
      ) : (
        <span className="size-3.5 shrink-0" />
      )}
      <span className="w-6 shrink-0 text-right text-[11px] text-foreground/80 tabular-nums">
        {line.lineNumber}
      </span>
      <span className={cn("w-3 shrink-0 font-bold", markerStyle)}>{prefix}</span>
      <code className="min-w-0 flex-1 truncate">{line.content}</code>
    </div>
  );
};

const DiffHeader = ({
  fileName,
  adds,
  removes,
  allSelected,
  onToggleAll,
}: {
  fileName: string;
  adds: number;
  removes: number;
  allSelected: boolean;
  onToggleAll: () => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-border/80 bg-secondary/45 px-4 py-2.5">
    <div className="flex min-w-0 items-center gap-2">
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-signal/12 text-signal">
        <FileDiff aria-hidden="true" className="size-3.5" />
      </span>
      <span className="truncate font-mono text-xs font-semibold text-foreground">{fileName}</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Badge variant="success" shape="tag">
        +{adds}
      </Badge>
      <Badge variant="destructive" shape="tag">
        -{removes}
      </Badge>
      <button
        type="button"
        onClick={onToggleAll}
        className="ml-1 cursor-pointer rounded-md border border-solid border-border bg-card px-2 py-0.5 font-sans text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {allSelected ? "全不选" : "全选"}
      </button>
    </div>
  </div>
);

const DiffFooter = ({
  applied,
  selectedCount,
  totalCount,
  onReset,
  onApply,
}: {
  applied: boolean;
  selectedCount: number;
  totalCount: number;
  onReset: () => void;
  onApply: () => void;
}) => (
  <div className="flex items-center justify-between gap-2 border-t border-solid border-border/80 bg-secondary/30 px-4 py-2.5">
    <span className="text-xs text-muted-foreground">
      {applied ? "已写入工作区文件" : `已勾选 ${selectedCount} / ${totalCount} 处变更`}
    </span>
    {applied ? (
      <Button size="sm" variant="ghost" onClick={onReset}>
        <RotateCcw className="size-3.5" />
        <span>已应用变更</span>
      </Button>
    ) : (
      <Button size="sm" variant="signal" disabled={selectedCount === 0} onClick={onApply}>
        <Check className="size-3.5" />
        <span>应用 {selectedCount} 处变更</span>
      </Button>
    )}
  </div>
);

export const AiDiffReview = ({
  fileName = "packages/tokens/src/scales/shadows.css",
  lines = DEFAULT_LINES,
  onApply,
  className,
}: AiDiffReviewProps) => {
  const changeIds = lines.filter((l) => l.type !== "context").map((l) => l.id);
  const [selected, setSelected] = useState<string[]>(changeIds);
  const [applied, setApplied] = useState(false);

  const adds = lines.filter((l) => l.type === "add").length;
  const removes = lines.filter((l) => l.type === "remove").length;
  const toggleLine = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected((prev) => (prev.length === changeIds.length ? [] : changeIds));

  return (
    <div
      data-slot="ai-diff-review"
      className={cn(
        "w-full max-w-xl overflow-hidden rounded-[22px] border border-solid border-border/90 bg-card text-card-foreground shadow-md",
        className,
      )}
    >
      <DiffHeader
        fileName={fileName}
        adds={adds}
        removes={removes}
        allSelected={selected.length === changeIds.length}
        onToggleAll={toggleAll}
      />
      <div className="overflow-hidden">
        {lines.map((line) => (
          <DiffRow
            key={line.id}
            line={line}
            checked={selected.includes(line.id)}
            onToggle={() => toggleLine(line.id)}
          />
        ))}
      </div>
      <DiffFooter
        applied={applied}
        selectedCount={selected.length}
        totalCount={changeIds.length}
        onReset={() => setApplied(false)}
        onApply={() => (setApplied(true), onApply?.(selected))}
      />
    </div>
  );
};
