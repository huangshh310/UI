"use client";

/**
 * Context 的子视图部件：环形进度图标、头部操作条与可聚焦分段图例。
 */
import { cn } from "@matt-ui/utils";
import { Minimize2, RotateCcw } from "lucide-react";
import type { ContextSegment } from "./context.types.js";
import { CONTEXT_FOCUS_RING, CONTEXT_TONE_BAR, formatContextTokens } from "./context.variants.js";

export const ContextRingIcon = ({ pct }: { pct: number }) => {
  const radius = 5.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, pct)) / 100);
  const toneClass =
    pct >= 90
      ? "text-destructive"
      : pct >= 75
        ? "text-amber-600 dark:text-amber-400"
        : "text-signal";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-3.5 shrink-0 -rotate-90", toneClass)}
    >
      <circle
        cx="8"
        cy="8"
        r={radius}
        fill="none"
        className="stroke-border/80 dark:stroke-white/14"
        strokeWidth="2.2"
      />
      <circle
        cx="8"
        cy="8"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
};

interface BreakdownHeaderProps {
  used: number;
  maxTokens: number;
  pct: number;
  savedTokens: number;
  compacted: boolean;
  costLabel: string;
  showCost: boolean;
  modelName?: string;
  compactable: boolean;
  onToggleCompact: () => void;
}

const ContextBreakdownHeader = (p: BreakdownHeaderProps) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex min-w-0 flex-col gap-0.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-foreground">上下文窗口</span>
        {(p.compacted || p.showCost) && (
          <span className="rounded-md border border-solid border-border/70 bg-secondary/75 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:border-white/10 dark:bg-white/8">
            {p.compacted ? `已释放 ${formatContextTokens(p.savedTokens)}` : p.costLabel}
          </span>
        )}
      </div>
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {formatContextTokens(p.used)} / {formatContextTokens(p.maxTokens)} · {p.pct}%
        {p.modelName ? ` · ${p.modelName}` : ""}
      </span>
    </div>
    {p.compactable && (
      <button
        type="button"
        onClick={p.onToggleCompact}
        className={cn(
          "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-solid border-border/80 bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:bg-accent dark:border-white/12 dark:hover:border-white/22",
          CONTEXT_FOCUS_RING,
        )}
      >
        {p.compacted ? (
          <RotateCcw aria-hidden="true" className="size-3" />
        ) : (
          <Minimize2 aria-hidden="true" className="size-3 text-signal" />
        )}
        <span>{p.compacted ? "还原" : "压缩上下文"}</span>
      </button>
    )}
  </div>
);

const ContextSegmentLegend = ({
  segments,
  focusedId,
  onFocus,
}: {
  segments: ContextSegment[];
  focusedId: string | null;
  onFocus: (id: string | null) => void;
}) => (
  <div className="grid grid-cols-2 gap-1.5">
    {segments.map((seg) => {
      const active = focusedId === seg.id;
      const barTone = CONTEXT_TONE_BAR[seg.tone ?? "signal"];
      return (
        <button
          key={seg.id}
          type="button"
          aria-pressed={active}
          onClick={() => onFocus(active ? null : seg.id)}
          className={cn(
            `flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-solid px-2.5 py-1.5 text-left text-[11px] transition-colors duration-(--ui-duration-fast) ${CONTEXT_FOCUS_RING}`,
            active
              ? "border-signal/55 bg-signal/10 text-foreground"
              : "border-border/70 bg-secondary/40 text-muted-foreground hover:border-border hover:bg-accent/60 hover:text-foreground dark:border-white/8 dark:bg-white/5 dark:hover:bg-white/9",
          )}
        >
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
            <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", barTone)} />
            <span className="truncate">{seg.label}</span>
          </span>
          <span className="font-mono text-[11px] font-medium text-foreground tabular-nums">
            {formatContextTokens(seg.tokens)}
          </span>
        </button>
      );
    })}
  </div>
);

export interface ContextBreakdownContentProps extends BreakdownHeaderProps {
  segments: ContextSegment[];
  focusedId: string | null;
  onFocus: (id: string | null) => void;
  compact: boolean;
}

export const ContextBreakdownContent = (p: ContextBreakdownContentProps) => {
  const remaining = Math.max(0, p.maxTokens - p.used);
  return (
    <div className={cn("flex flex-col gap-3 font-sans", p.compact ? "p-3" : "p-3.5")}>
      <ContextBreakdownHeader
        used={p.used}
        maxTokens={p.maxTokens}
        pct={p.pct}
        savedTokens={p.savedTokens}
        compacted={p.compacted}
        costLabel={p.costLabel}
        showCost={p.showCost}
        modelName={p.modelName}
        compactable={p.compactable}
        onToggleCompact={p.onToggleCompact}
      />
      <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-secondary/90 p-0.5 dark:bg-white/10">
        {p.segments.map((seg) => (
          <div
            key={seg.id}
            style={{ width: `${Math.min(100, Math.max(2, (seg.tokens / p.maxTokens) * 100))}%` }}
            className={cn(
              "h-full rounded-full transition-opacity duration-(--ui-duration-fast)",
              CONTEXT_TONE_BAR[seg.tone ?? "signal"],
              p.focusedId !== null && p.focusedId !== seg.id && "opacity-25",
            )}
          />
        ))}
      </div>
      <ContextSegmentLegend segments={p.segments} focusedId={p.focusedId} onFocus={p.onFocus} />
      <div className="flex items-center justify-between border-t border-solid border-border/65 pt-2 font-mono text-[11px] text-muted-foreground tabular-nums dark:border-white/8">
        <span>剩余可用 {formatContextTokens(remaining)}</span>
        <span className={p.pct >= 80 ? "text-amber-600 dark:text-amber-400" : undefined}>
          {p.pct >= 90 ? "接近上限" : p.pct >= 80 ? "建议压缩" : "预算健康"}
        </span>
      </div>
    </div>
  );
};
