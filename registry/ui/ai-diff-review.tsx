// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiDiffReview：智能代码与配置变更行级审阅卡片，支持自适应语义表面与曜石暗色主题、逐行勾选与应用变更。
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Check, FileDiff, RotateCcw, X } from "lucide-react";
import { useState } from "react";

export const diffReviewShellVariants = cva(
  "w-full overflow-hidden rounded-2xl border border-solid shadow-xs",
  {
    variants: {
      theme: {
        adaptive: "border-border bg-card text-card-foreground",
        obsidian: "[color-scheme:dark] border-zinc-800 bg-zinc-950 text-zinc-100",
      },
    },
    defaultVariants: {
      theme: "adaptive",
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
    add: "border-l-2 border-l-emerald-500/80 bg-emerald-500/12 text-emerald-100",
    remove: "border-l-2 border-l-rose-500/80 bg-rose-500/12 text-rose-100",
    context: "border-l-2 border-l-transparent bg-transparent text-zinc-300",
  },
  adaptive: {
    add: "border-l-2 border-l-emerald-500/75 bg-emerald-500/[0.08] text-foreground dark:bg-emerald-500/12",
    remove:
      "border-l-2 border-l-rose-500/75 bg-rose-500/[0.08] text-foreground dark:bg-rose-500/12",
    context: "border-l-2 border-l-transparent bg-transparent text-muted-foreground",
  },
};

export const DIFF_MARKER_STYLE: Record<AiDiffReviewTheme, Record<AiDiffLineType, string>> = {
  obsidian: {
    add: "text-emerald-400",
    remove: "text-rose-400",
    context: "text-zinc-400",
  },
  adaptive: {
    add: "text-emerald-700 dark:text-emerald-400",
    remove: "text-rose-700 dark:text-rose-400",
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
const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

interface DiffHeaderProps {
  fileName: string;
  summary?: string;
  language?: string;
  adds: number;
  removes: number;
  allSelected: boolean;
  obsidian: boolean;
  onToggleAll: () => void;
}

const DiffStats = ({
  adds,
  removes,
  allSelected,
  obsidian,
  onToggleAll,
}: {
  adds: number;
  removes: number;
  allSelected: boolean;
  obsidian: boolean;
  onToggleAll: () => void;
}) => (
  <div className="flex items-center gap-2">
    <span
      className={cn(
        "font-mono text-[11px] font-medium tabular-nums",
        obsidian ? "text-emerald-400" : "text-emerald-700 dark:text-emerald-400",
      )}
    >
      +{adds}
    </span>
    <span
      className={cn(
        "font-mono text-[11px] font-medium tabular-nums",
        obsidian ? "text-rose-400" : "text-rose-700 dark:text-rose-400",
      )}
    >
      -{removes}
    </span>
    <button
      type="button"
      onClick={onToggleAll}
      className={cn(
        "inline-flex h-7 cursor-pointer items-center rounded-md px-2 font-sans text-[11px] font-medium transition-colors",
        FOCUS_RING,
        obsidian
          ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {allSelected ? "全不选" : "全选"}
    </button>
  </div>
);

const DiffHeader = (p: DiffHeaderProps) => {
  const muted = p.obsidian ? "text-zinc-400" : "text-muted-foreground";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 px-4 py-3",
        p.obsidian ? "bg-zinc-900/60" : "bg-card",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <FileDiff aria-hidden="true" className={cn("size-3.5 shrink-0", muted)} />
        <div className="flex min-w-0 flex-col">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-mono text-xs font-semibold">{p.fileName}</span>
            {p.language && (
              <span className={cn("shrink-0 font-mono text-[11px] uppercase tabular-nums", muted)}>
                {p.language}
              </span>
            )}
          </div>
          {p.summary && <span className={cn("truncate text-[11px]", muted)}>{p.summary}</span>}
        </div>
      </div>
      <DiffStats
        adds={p.adds}
        removes={p.removes}
        allSelected={p.allSelected}
        obsidian={p.obsidian}
        onToggleAll={p.onToggleAll}
      />
    </div>
  );
};

interface DiffFooterProps {
  applied: boolean;
  selectedCount: number;
  totalCount: number;
  hasReject: boolean;
  obsidian: boolean;
  onReset: () => void;
  onRejectAll: () => void;
  onApply: () => void;
}

const DiffFooterActions = (p: Omit<DiffFooterProps, "totalCount">) => {
  if (p.applied) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className={cn("h-8 rounded-lg", p.obsidian && "text-zinc-200 hover:bg-zinc-800")}
        onClick={p.onReset}
      >
        <RotateCcw className="size-3.5" />
        <span>已应用变更</span>
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {p.hasReject && (
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "h-8 rounded-lg",
            p.obsidian && "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800",
          )}
          onClick={p.onRejectAll}
        >
          <X className="size-3.5" />
          <span>放弃</span>
        </Button>
      )}
      <Button
        size="sm"
        variant="primary"
        className={cn(
          "h-8 rounded-lg",
          p.obsidian && "bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
        )}
        disabled={p.selectedCount === 0}
        onClick={p.onApply}
      >
        <Check className="size-3.5" />
        <span>应用 {p.selectedCount} 处变更</span>
      </Button>
    </div>
  );
};

const DiffFooter = (p: DiffFooterProps) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-2 px-4 py-3",
      p.obsidian ? "bg-zinc-900/60" : "bg-card",
    )}
  >
    <span
      className={cn(
        "font-mono text-[11px] tabular-nums",
        p.obsidian ? "text-zinc-400" : "text-muted-foreground",
      )}
    >
      {p.applied ? "已写入工作区文件" : `已勾选 ${p.selectedCount} / ${p.totalCount} 处变更`}
    </span>
    <DiffFooterActions
      applied={p.applied}
      selectedCount={p.selectedCount}
      hasReject={p.hasReject}
      obsidian={p.obsidian}
      onReset={p.onReset}
      onRejectAll={p.onRejectAll}
      onApply={p.onApply}
    />
  </div>
);
const DiffCheckbox = ({
  lineNumber,
  checked,
  obsidian,
  onToggle,
}: {
  lineNumber: number;
  checked: boolean;
  obsidian: boolean;
  onToggle: () => void;
}) => {
  const checkedCls = obsidian
    ? "border-zinc-100 bg-zinc-100 text-zinc-950"
    : "border-foreground bg-foreground text-background";
  const idleCls = obsidian
    ? "border-zinc-600 bg-transparent text-transparent"
    : "border-border bg-card text-transparent dark:border-white/20";
  return (
    <label className="relative inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center">
      <input
        type="checkbox"
        aria-label={`采纳第 ${lineNumber} 行变更`}
        checked={checked}
        onChange={onToggle}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-3.5 items-center justify-center rounded-[4px] border border-solid transition-colors peer-focus-visible:border-ring peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-focus-visible:ring-inset",
          checked ? checkedCls : idleCls,
        )}
      >
        <Check className="size-2.5 stroke-[2.5]" />
      </span>
    </label>
  );
};

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
    ? "border-l-transparent bg-transparent text-zinc-400 line-through"
    : "border-l-transparent bg-transparent text-muted-foreground line-through";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-mono text-xs leading-relaxed",
        compact ? "px-3 py-1" : "px-3.5 py-1.5",
        DIFF_ROW_STYLE[theme][line.type],
        isChange && !checked && uncheckedStyle,
      )}
    >
      {isChange ? (
        <DiffCheckbox
          lineNumber={line.lineNumber}
          checked={checked}
          obsidian={obsidian}
          onToggle={onToggle}
        />
      ) : (
        <span className="size-3.5 shrink-0" />
      )}
      <span
        className={cn(
          "w-6 shrink-0 select-none text-right text-[11px] tabular-nums",
          obsidian ? "text-zinc-400" : "text-muted-foreground",
        )}
      >
        {line.lineNumber}
      </span>
      <span
        className={cn(
          "w-3 shrink-0 select-none font-semibold",
          DIFF_MARKER_STYLE[theme][line.type],
        )}
      >
        {prefix}
      </span>
      <code className="whitespace-pre pr-4">{line.content}</code>
    </div>
  );
};

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
  <div
    className={cn(
      "overflow-x-auto py-1.5",
      theme === "obsidian" ? "bg-zinc-950" : "bg-muted/50 text-foreground dark:bg-white/[0.04]",
    )}
  >
    <div className="min-w-max">
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
  const theme = props.theme ?? "adaptive";
  const obsidian = theme === "obsidian";
  const compact = props.compact ?? false;
  const lines = props.lines ?? DIFF_DEFAULT_LINES;
  const s = useDiffSelection(lines, props.onApply, props.onRejectAll);

  return (
    <div
      data-slot="ai-diff-review"
      data-theme={theme}
      className={cn(diffReviewShellVariants({ theme }), props.className)}
    >
      <DiffHeader
        fileName={props.fileName ?? "packages/tokens/src/scales/shadows.css"}
        summary={props.summary}
        language={props.language}
        adds={lines.filter((l) => l.type === "add").length}
        removes={lines.filter((l) => l.type === "remove").length}
        allSelected={s.selected.length === s.changeIds.length}
        obsidian={obsidian}
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
        obsidian={obsidian}
        onReset={() => s.setApplied(false)}
        onRejectAll={s.rejectAll}
        onApply={s.apply}
      />
    </div>
  );
};
