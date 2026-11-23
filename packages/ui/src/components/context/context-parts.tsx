"use client";

/**
 * Context 的子视图部件：环形进度微表盘、头部操作条与清爽可点击分段列表。
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
        className="stroke-border dark:stroke-white/14"
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
          <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:bg-white/8">
            {p.compacted ? `已释放 ${formatContextTokens(p.savedTokens)}` : p.costLabel}
          </span>
        )}
      </div>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
        {formatContextTokens(p.used)} / {formatContextTokens(p.maxTokens)} · {p.pct}%
        {p.modelName ? ` · ${p.modelName}` : ""}
      </span>
    </div>
    {p.compactable && (
      <button
        type="button"
        onClick={p.onToggleCompact}
        className={cn(
          "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs transition-colors duration-(--ui-duration-fast) hover:border-foreground/20 hover:bg-accent/50 dark:border-white/10 dark:hover:border-white/20",
          CONTEXT_FOCUS_RING,
        )}
      >
        {p.compacted ? (
          <RotateCcw aria-hidden="true" className="size-3 text-muted-foreground" />
        ) : (
          <Minimize2 aria-hidden="true" className="size-3 text-muted-foreground" />
        )}
        <span>{p.compacted ? "还原" : "压缩上下文"}</span>
      </button>
    )}
  </div>
);

const ContextSegmentLegend = ({
  segments,
  maxTokens,
  focusedId,
  onFocus,
}: {
  segments: ContextSegment[];
  maxTokens: number;
  focusedId: string | null;
  onFocus: (id: string | null) => void;
}) => (
  <div className="flex flex-col gap-0.5">
    {segments.map((seg) => {
      const active = focusedId === seg.id;
      const barTone = CONTEXT_TONE_BAR[seg.tone ?? "signal"];
      const share = Math.round((seg.tokens / maxTokens) * 100);
      return (
        <button
          key={seg.id}
          type="button"
          aria-pressed={active}
          aria-label={`${seg.label} ${share}% · ${formatContextTokens(seg.tokens)}`}
          onClick={() => onFocus(active ? null : seg.id)}
          className={cn(
            `flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-solid px-2 py-1.5 text-left text-xs transition-colors duration-(--ui-duration-fast) ${CONTEXT_FOCUS_RING}`,
            active
              ? "border-border bg-secondary/80 text-foreground dark:border-white/12 dark:bg-white/10"
              : "border-transparent bg-transparent text-muted-foreground hover:bg-accent/55 hover:text-foreground",
          )}
        >
          <span className="inline-flex min-w-0 items-center gap-2 truncate">
            <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", barTone)} />
            <span className={cn("truncate", active && "font-medium text-foreground")}>
              {seg.label}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] tabular-nums">
            <span className="text-muted-foreground">{share}%</span>
            <span className="font-medium text-foreground">{formatContextTokens(seg.tokens)}</span>
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
  const statusTone =
    p.pct >= 90
      ? "text-destructive"
      : p.pct >= 80
        ? "text-amber-600 dark:text-amber-400"
        : undefined;

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
      <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-secondary dark:bg-white/10">
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
      <ContextSegmentLegend
        segments={p.segments}
        maxTokens={p.maxTokens}
        focusedId={p.focusedId}
        onFocus={p.onFocus}
      />
      <div className="flex items-center justify-between border-t border-solid border-border pt-2 font-mono text-[11px] text-muted-foreground tabular-nums dark:border-white/10">
        <span>剩余可用 {formatContextTokens(remaining)}</span>
        <span className={statusTone}>
          {p.pct >= 90 ? "接近上限" : p.pct >= 80 ? "建议压缩" : "预算健康"}
        </span>
      </div>
    </div>
  );
};
