"use client";

/**
 * Context：AI 上下文窗口环形微表盘与分段 Token 预算浮层检查器（对标 shadcn AI Elements Context + HextaUI Token Ring）。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { Minimize2, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { ContextProps, ContextSegment, ContextSegmentTone } from "./context.types.js";

const DEFAULT_SEGMENTS: ContextSegment[] = [
  { id: "system", label: "系统提示", tokens: 16000, tone: "primary" },
  { id: "history", label: "历史对话", tokens: 64000, tone: "signal" },
  { id: "sources", label: "检索上下文", tokens: 32000, tone: "success" },
  { id: "tools", label: "工具输出", tokens: 16000, tone: "warning" },
];

const TONE_BAR: Record<ContextSegmentTone, string> = {
  primary: "bg-primary",
  signal: "bg-signal",
  success: "bg-success",
  warning: "bg-warning",
};

const formatTokens = (n: number) => `${(n / 1000).toFixed(1)}K`;

const RingIcon = ({ pct }: { pct: number }) => {
  const radius = 5.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, pct)) / 100);
  const toneClass = pct >= 90 ? "text-destructive" : pct >= 75 ? "text-warning" : "text-signal";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-3.5 shrink-0 -rotate-90", toneClass)}
    >
      <circle cx="8" cy="8" r={radius} fill="none" stroke="var(--ui-border)" strokeWidth="2.2" />
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

const BreakdownHeader = ({
  used,
  maxTokens,
  pct,
  savedTokens,
  compacted,
  costLabel,
  onToggleCompact,
}: {
  used: number;
  maxTokens: number;
  pct: number;
  savedTokens: number;
  compacted: boolean;
  costLabel: string;
  onToggleCompact: () => void;
}) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-foreground">上下文窗口</span>
        <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {compacted ? `已释放 ${formatTokens(savedTokens)}` : costLabel}
        </span>
      </div>
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {formatTokens(used)} / {formatTokens(maxTokens)} · {pct}%
      </span>
    </div>
    <button
      type="button"
      onClick={onToggleCompact}
      className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs transition-colors duration-(--ui-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {compacted ? (
        <RotateCcw aria-hidden="true" className="size-3" />
      ) : (
        <Minimize2 aria-hidden="true" className="size-3 text-signal" />
      )}
      <span>{compacted ? "还原" : "压缩上下文"}</span>
    </button>
  </div>
);

const SegmentLegend = ({
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
      const barTone = TONE_BAR[seg.tone ?? "signal"];
      return (
        <button
          key={seg.id}
          type="button"
          aria-pressed={active}
          onClick={() => onFocus(active ? null : seg.id)}
          className={cn(
            "flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-solid px-2.5 py-1.5 text-left text-[11px] transition-colors duration-(--ui-duration-fast) focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            active
              ? "border-signal/55 bg-signal/8 text-foreground"
              : "border-border/70 bg-secondary/35 text-muted-foreground hover:bg-accent/55 hover:text-foreground",
          )}
        >
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
            <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", barTone)} />
            <span className="truncate">{seg.label}</span>
          </span>
          <span className="font-mono text-[11px] font-medium text-foreground tabular-nums">
            {formatTokens(seg.tokens)}
          </span>
        </button>
      );
    })}
  </div>
);

const BreakdownCardContent = ({
  segments,
  maxTokens,
  used,
  pct,
  savedTokens,
  compacted,
  costLabel,
  focusedId,
  onFocus,
  onToggleCompact,
}: {
  segments: ContextSegment[];
  maxTokens: number;
  used: number;
  pct: number;
  savedTokens: number;
  compacted: boolean;
  costLabel: string;
  focusedId: string | null;
  onFocus: (id: string | null) => void;
  onToggleCompact: () => void;
}) => (
  <div className="flex flex-col gap-3 p-3.5 font-sans">
    <BreakdownHeader
      used={used}
      maxTokens={maxTokens}
      pct={pct}
      savedTokens={savedTokens}
      compacted={compacted}
      costLabel={costLabel}
      onToggleCompact={onToggleCompact}
    />
    <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-secondary p-0.5">
      {segments.map((seg) => (
        <div
          key={seg.id}
          style={{ width: `${Math.min(100, Math.max(2, (seg.tokens / maxTokens) * 100))}%` }}
          className={cn(
            "h-full rounded-full transition-opacity duration-(--ui-duration-fast)",
            TONE_BAR[seg.tone ?? "signal"],
            focusedId !== null && focusedId !== seg.id && "opacity-25",
          )}
        />
      ))}
    </div>
    <SegmentLegend segments={segments} focusedId={focusedId} onFocus={onFocus} />
  </div>
);

const useContextMetrics = (
  maxTokens: number,
  segments: ContextSegment[],
  onCompact?: (savedTokens: number) => void,
) => {
  const [compacted, setCompacted] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const safeMax = Math.max(1, maxTokens);
  const shrunk = segments.map((seg) =>
    seg.id === "history" || seg.id === "tools"
      ? { ...seg, tokens: Math.round(seg.tokens * 0.4) }
      : seg,
  );
  const activeSegments = compacted ? shrunk : segments;
  const rawUsed = segments.reduce((sum, s) => sum + s.tokens, 0);
  const savedTokens = Math.max(0, rawUsed - shrunk.reduce((sum, s) => sum + s.tokens, 0));
  const used = activeSegments.reduce((sum, s) => sum + s.tokens, 0);
  const pct = Math.min(100, Math.round((used / safeMax) * 100));

  const toggleCompact = () => {
    if (!compacted) onCompact?.(savedTokens);
    setCompacted((prev) => !prev);
  };

  return {
    safeMax,
    activeSegments,
    savedTokens,
    used,
    pct,
    compacted,
    focusedId,
    setFocusedId,
    toggleCompact,
  };
};

const ContextPopover = ({
  pct,
  used,
  ariaLabel,
  className,
  children,
}: {
  pct: number;
  used: number;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <Popover.Root>
    <Popover.Trigger
      data-slot="context"
      data-variant="pill"
      aria-label={ariaLabel ?? `上下文窗口占用 ${pct}% · ${formatTokens(used)}`}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-border bg-card px-2.5 font-mono text-[11px] font-medium text-foreground tabular-nums shadow-xs select-none",
        "transition-[background-color,border-color] duration-(--ui-duration-fast) hover:border-foreground/20 hover:bg-accent data-popup-open:border-ring/70 data-popup-open:bg-accent",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <RingIcon pct={pct} />
      <span>{pct}%</span>
      <span className="text-muted-foreground">· {formatTokens(used)}</span>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner sideOffset={8} align="end" className="z-(--ui-z-popover) outline-none">
        <Popover.Popup className="w-80 origin-(--transform-origin) overflow-hidden rounded-2xl border border-solid border-border bg-popover text-popover-foreground shadow-lg transition-[transform,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out) outline-none data-ending-style:scale-97 data-ending-style:opacity-0 data-starting-style:scale-97 data-starting-style:opacity-0">
          {children}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);

export const Context = ({
  maxTokens = 200000,
  segments = DEFAULT_SEGMENTS,
  variant = "pill",
  costLabel = "~$0.024",
  onCompact,
  className,
  "aria-label": ariaLabel,
}: ContextProps) => {
  const m = useContextMetrics(maxTokens, segments, onCompact);
  const body = (
    <BreakdownCardContent
      segments={m.activeSegments}
      maxTokens={m.safeMax}
      used={m.used}
      pct={m.pct}
      savedTokens={m.savedTokens}
      compacted={m.compacted}
      costLabel={costLabel}
      focusedId={m.focusedId}
      onFocus={m.setFocusedId}
      onToggleCompact={m.toggleCompact}
    />
  );

  if (variant === "inline") {
    return (
      <div
        data-slot="context"
        data-variant="inline"
        className={cn(
          "w-full max-w-md rounded-2xl border border-solid border-border bg-card text-card-foreground shadow-sm",
          className,
        )}
      >
        {body}
      </div>
    );
  }

  return (
    <ContextPopover pct={m.pct} used={m.used} ariaLabel={ariaLabel} className={className}>
      {body}
    </ContextPopover>
  );
};
