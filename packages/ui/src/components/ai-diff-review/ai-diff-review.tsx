"use client";

/**
 * AiDiffReview：Cursor / Copilot 风格的 AI 代码与配置变更行级审阅卡片，支持自适应语义表面与曜石暗色主题、逐行勾选与应用变更。
 */
import { cn } from "@matt-ui/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import { DiffFooter, DiffHeader } from "./ai-diff-review.parts.js";
import type { AiDiffLine, AiDiffReviewProps, AiDiffReviewTheme } from "./ai-diff-review.types.js";
import {
  DIFF_DEFAULT_LINES,
  DIFF_MARKER_STYLE,
  DIFF_ROW_STYLE,
  diffReviewShellVariants,
} from "./ai-diff-review.variants.js";

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
