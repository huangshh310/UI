"use client";

/**
 * AiDiffReview 顶部文件头与底部操作栏部件。
 */
import { cn } from "@matt-ui/utils";
import { Check, FileDiff, RotateCcw, X } from "lucide-react";
import { Button } from "../button/index.js";

const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export interface DiffHeaderProps {
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
        "inline-flex h-7 cursor-pointer items-center rounded-md border border-solid px-2 font-sans text-[11px] font-medium transition-colors",
        FOCUS_RING,
        obsidian
          ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          : "border-border/75 bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground dark:border-white/8",
      )}
    >
      {allSelected ? "全不选" : "全选"}
    </button>
  </div>
);

export const DiffHeader = (p: DiffHeaderProps) => {
  const muted = p.obsidian ? "text-zinc-400" : "text-muted-foreground";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 border-b border-solid px-4 py-2.5",
        p.obsidian
          ? "border-zinc-800 bg-zinc-900/60"
          : "border-border/75 bg-card dark:border-white/8",
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

export interface DiffFooterProps {
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

export const DiffFooter = (p: DiffFooterProps) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-2 border-t border-solid px-4 py-2.5",
      p.obsidian
        ? "border-zinc-800 bg-zinc-900/60"
        : "border-border/75 bg-card dark:border-white/8",
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
