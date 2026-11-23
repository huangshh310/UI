// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiDiffReview：Cursor / Copilot 风格的 AI 代码与配置变更行级审阅卡片，支持曜石暗色差异舞台、全选/逐行勾选与应用变更。
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Check, FileDiff, RotateCcw, X } from "lucide-react";
import { useState } from "react";

export const diffReviewShellVariants = cva(
  "w-full max-w-xl overflow-hidden border border-solid border-border/85 bg-card text-card-foreground shadow-xs",
  {
    variants: {
      compact: {
        false: "rounded-2xl",
        true: "rounded-xl",
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const DIFF_DEFAULT_LINES: AiDiffLine[] = [
  { id: "d1", lineNumber: 14, type: "context", content: "  --ui-shadow-sm:" },
  { id: "d2", lineNumber: 15, type: "remove", content: "    0 1px 2px 0 rgba(0, 0, 0, 0.05);" },
  { id: "d3", lineNumber: 15, type: "add", content: "    inset 0 1px 0 0 var(--ui-specular)," },
  { id: "d4", lineNumber: 16, type: "add", content: "    inset 0 -1px 0 0 var(--ui-bevel)," },
  { id: "d5", lineNumber: 17, type: "context", content: "    0 3px 8px -2px rgba(0, 0, 0, 0.06);" },
];

export const DIFF_ROW_STYLE: Record<AiDiffReviewTheme, Record<AiDiffLineType, string>> = {
  obsidian: {
    add: "border-l-2 border-l-emerald-500 bg-emerald-500/14 text-emerald-100",
    remove: "border-l-2 border-l-rose-500 bg-rose-500/14 text-rose-100",
    context: "border-l-2 border-l-transparent bg-transparent text-zinc-300",
  },
  adaptive: {
    add: "border-l-2 border-l-emerald-500 bg-emerald-500/10 text-foreground",
    remove: "border-l-2 border-l-rose-500 bg-rose-500/10 text-foreground",
    context: "border-l-2 border-l-transparent bg-transparent text-muted-foreground",
  },
};

export const DIFF_MARKER_STYLE: Record<AiDiffReviewTheme, Record<AiDiffLineType, string>> = {
  obsidian: {
    add: "text-emerald-400",
    remove: "text-rose-400",
    context: "text-zinc-500",
  },
  adaptive: {
    add: "text-emerald-700 dark:text-emerald-300",
    remove: "text-rose-700 dark:text-rose-300",
    context: "text-muted-foreground",
  },
};
export type AiDiffLineType = "context" | "remove" | "add";
export type AiDiffReviewTheme = "obsidian" | "adaptive";

export interface AiDiffLine {
  id: string;
  lineNumber: number;
  type: AiDiffLineType;
  content: string;
}

export interface AiDiffReviewProps {
  /** 目标文件路径 */
  fileName?: string;
  /** 可选变更意图摘要（展示在文件名下方） */
  summary?: string;
  /** 可选语言标识角标（如 "css" / "json" / "tsx"） */
  language?: string;
  /** 代码差异视口主题：默认曜石暗色代码舞台（obsidian），或跟随宿主的自适应模式（adaptive） */
  theme?: AiDiffReviewTheme;
  /** 紧凑行距模式 */
  compact?: boolean;
  /** Diff 行列表 */
  lines?: AiDiffLine[];
  /** 应用选中变更回调 */
  onApply?: (acceptedLineIds: string[]) => void;
  /** 全部忽略/放弃变更回调 */
  onRejectAll?: () => void;
  /** 自定义类名 */
  className?: string;
}
interface RowProps {
  line: AiDiffLine;
  theme: AiDiffReviewTheme;
  compact: boolean;
  checked: boolean;
  onToggle: () => void;
}

const DiffRow = ({ line, theme, compact, checked, onToggle }: RowProps) => {
  const isChange = line.type !== "context";
  const prefix = line.type === "add" ? "+" : line.type === "remove" ? "-" : " ";
  const obsidian = theme === "obsidian";
  const uncheckedStyle = obsidian
    ? "bg-transparent text-zinc-400 line-through"
    : "bg-transparent text-muted-foreground line-through";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 border-b border-solid font-mono text-xs last:border-b-0",
        compact ? "px-3 py-1" : "px-3.5 py-1.5",
        obsidian ? "border-zinc-800/75" : "border-border/50",
        DIFF_ROW_STYLE[theme][line.type],
        isChange && !checked && uncheckedStyle,
      )}
    >
      {isChange ? (
        <input
          type="checkbox"
          aria-label={`采纳第 ${line.lineNumber} 行变更`}
          checked={checked}
          onChange={onToggle}
          className="size-3.5 shrink-0 cursor-pointer rounded accent-signal outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : (
        <span className="size-3.5 shrink-0" />
      )}
      <span
        className={cn(
          "w-6 shrink-0 text-right text-[11px] tabular-nums",
          obsidian ? "text-zinc-400" : "text-muted-foreground",
        )}
      >
        {line.lineNumber}
      </span>
      <span className={cn("w-3 shrink-0 font-bold", DIFF_MARKER_STYLE[theme][line.type])}>
        {prefix}
      </span>
      <code className="min-w-0 flex-1 truncate">{line.content}</code>
    </div>
  );
};

interface HeaderProps {
  fileName: string;
  summary?: string;
  language?: string;
  adds: number;
  removes: number;
  allSelected: boolean;
  onToggleAll: () => void;
}

const DiffHeader = ({
  fileName,
  summary,
  language,
  adds,
  removes,
  allSelected,
  onToggleAll,
}: HeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-solid border-border/80 bg-secondary/45 px-4 py-2.5">
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="inline-flex size-6.5 shrink-0 items-center justify-center rounded-lg border border-solid border-border/75 bg-card text-foreground shadow-2xs">
        <FileDiff aria-hidden="true" className="size-3.5" />
      </span>
      <div className="flex min-w-0 flex-col">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-mono text-xs font-semibold text-foreground">
            {fileName}
          </span>
          {language && (
            <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground uppercase">
              {language}
            </span>
          )}
        </div>
        {summary && <span className="truncate text-[11px] text-muted-foreground">{summary}</span>}
      </div>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="rounded-full border border-solid border-emerald-500/30 bg-emerald-500/12 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-700 tabular-nums dark:text-emerald-300">
        +{adds}
      </span>
      <span className="rounded-full border border-solid border-destructive/30 bg-destructive/12 px-2 py-0.5 font-mono text-[11px] font-medium text-destructive tabular-nums">
        -{removes}
      </span>
      <button
        type="button"
        onClick={onToggleAll}
        className="ml-1 cursor-pointer rounded-full border border-solid border-border/85 bg-card px-2.5 py-0.5 font-sans text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {allSelected ? "全不选" : "全选"}
      </button>
    </div>
  </div>
);

interface FooterProps {
  applied: boolean;
  selectedCount: number;
  totalCount: number;
  hasReject: boolean;
  onReset: () => void;
  onRejectAll: () => void;
  onApply: () => void;
}

const DiffFooter = (p: FooterProps) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-solid border-border/80 bg-secondary/30 px-4 py-2.5">
    <span className="text-xs text-muted-foreground">
      {p.applied ? "已写入工作区文件" : `已勾选 ${p.selectedCount} / ${p.totalCount} 处变更`}
    </span>
    {p.applied ? (
      <Button size="sm" variant="ghost" onClick={p.onReset}>
        <RotateCcw className="size-3.5" />
        <span>已应用变更</span>
      </Button>
    ) : (
      <div className="flex items-center gap-1.5">
        {p.hasReject && (
          <Button size="sm" variant="outline" className="rounded-full" onClick={p.onRejectAll}>
            <X className="size-3.5" />
            <span>放弃</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="primary"
          className="rounded-full"
          disabled={p.selectedCount === 0}
          onClick={p.onApply}
        >
          <Check className="size-3.5" />
          <span>应用 {p.selectedCount} 处变更</span>
        </Button>
      </div>
    )}
  </div>
);

const DiffViewport = ({
  lines,
  theme,
  compact,
  selected,
  onToggleLine,
}: {
  lines: AiDiffLine[];
  theme: AiDiffReviewTheme;
  compact: boolean;
  selected: string[];
  onToggleLine: (id: string) => void;
}) => (
  <div className={cn("overflow-x-auto", theme === "obsidian" && "[color-scheme:dark] bg-zinc-950")}>
    {lines.map((line) => (
      <DiffRow
        key={line.id}
        line={line}
        theme={theme}
        compact={compact}
        checked={selected.includes(line.id)}
        onToggle={() => onToggleLine(line.id)}
      />
    ))}
  </div>
);

const useDiffSelection = (
  lines: AiDiffLine[],
  onApply?: (ids: string[]) => void,
  onRejectAll?: () => void,
) => {
  const changeIds = lines.filter((l) => l.type !== "context").map((l) => l.id);
  const [selected, setSelected] = useState<string[]>(changeIds);
  const [applied, setApplied] = useState(false);

  const toggleLine = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected((prev) => (prev.length === changeIds.length ? [] : changeIds));
  const rejectAll = () => {
    setSelected([]);
    onRejectAll?.();
  };
  const apply = () => {
    setApplied(true);
    onApply?.(selected);
  };

  return { changeIds, selected, applied, setApplied, toggleLine, toggleAll, rejectAll, apply };
};

export const AiDiffReview = (props: AiDiffReviewProps) => {
  const theme = props.theme ?? "obsidian";
  const compact = props.compact ?? false;
  const lines = props.lines ?? DIFF_DEFAULT_LINES;
  const s = useDiffSelection(lines, props.onApply, props.onRejectAll);

  return (
    <div
      data-slot="ai-diff-review"
      data-theme={theme}
      className={cn(diffReviewShellVariants({ compact }), props.className)}
    >
      <DiffHeader
        fileName={props.fileName ?? "packages/tokens/src/scales/shadows.css"}
        summary={props.summary}
        language={props.language}
        adds={lines.filter((l) => l.type === "add").length}
        removes={lines.filter((l) => l.type === "remove").length}
        allSelected={s.selected.length === s.changeIds.length}
        onToggleAll={s.toggleAll}
      />
      <DiffViewport
        lines={lines}
        theme={theme}
        compact={compact}
        selected={s.selected}
        onToggleLine={s.toggleLine}
      />
      <DiffFooter
        applied={s.applied}
        selectedCount={s.selected.length}
        totalCount={s.changeIds.length}
        hasReject={Boolean(props.onRejectAll)}
        onReset={() => s.setApplied(false)}
        onRejectAll={s.rejectAll}
        onApply={s.apply}
      />
    </div>
  );
};
