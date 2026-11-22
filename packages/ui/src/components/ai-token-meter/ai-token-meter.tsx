"use client";

/**
 * AiTokenMeter：Cursor / Bencho 风格的 AI 上下文窗口与分段 Token 预算 HUD，支持交互高亮分段与一键压缩。
 */
import { cn } from "@matt-ui/utils";
import { Minimize2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import type {
  AiTokenMeterProps,
  AiTokenSegment,
  AiTokenSegmentTone,
} from "./ai-token-meter.types.js";

const DEFAULT_SEGMENTS: AiTokenSegment[] = [
  { id: "system", label: "系统与规范", tokens: 18000, tone: "primary" },
  { id: "history", label: "历史对话", tokens: 68000, tone: "signal" },
  { id: "rag", label: "知识库片段", tokens: 42000, tone: "success" },
  { id: "tools", label: "工具输出", tokens: 20000, tone: "warning" },
];

const TONE_BG: Record<AiTokenSegmentTone, string> = {
  signal: "bg-signal",
  primary: "bg-indigo-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
};

const formatK = (n: number) => `${(n / 1000).toFixed(1)}K`;

const SegmentLegend = ({
  segments,
  focusedId,
  onFocus,
}: {
  segments: AiTokenSegment[];
  focusedId: string | null;
  onFocus: (id: string | null) => void;
}) => (
  <div className="grid grid-cols-2 gap-2">
    {segments.map((seg) => {
      const active = focusedId === seg.id;
      return (
        <button
          key={seg.id}
          type="button"
          aria-pressed={active}
          onClick={() => onFocus(active ? null : seg.id)}
          className={cn(
            "flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-solid px-3 py-2 text-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "border-signal/60 bg-signal/8 shadow-xs"
              : "border-border/75 bg-secondary/35 hover:bg-secondary/60",
          )}
        >
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              aria-hidden="true"
              className={cn("size-2 shrink-0 rounded-full", TONE_BG[seg.tone])}
            />
            <span>{seg.label}</span>
          </span>
          <span className="font-mono text-[11px] font-semibold text-foreground tabular-nums">
            {formatK(seg.tokens)}
          </span>
        </button>
      );
    })}
  </div>
);

const StackedBar = ({
  segments,
  maxTokens,
  focusedId,
  onFocus,
}: {
  segments: AiTokenSegment[];
  maxTokens: number;
  focusedId: string | null;
  onFocus: (id: string | null) => void;
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex h-3 w-full gap-1 overflow-hidden rounded-full bg-secondary/90 p-0.5 shadow-inner">
      {segments.map((seg) => {
        const pct = Math.min(100, Math.max(2, (seg.tokens / maxTokens) * 100));
        return (
          <div
            key={seg.id}
            style={{ width: `${pct}%` }}
            className={cn(
              "h-full rounded-full transition-all duration-(--ui-duration-normal)",
              TONE_BG[seg.tone],
              focusedId !== null && focusedId !== seg.id && "opacity-30",
            )}
          />
        );
      })}
    </div>
    <SegmentLegend segments={segments} focusedId={focusedId} onFocus={onFocus} />
  </div>
);

const compactSegments = (segments: AiTokenSegment[], compacted: boolean) =>
  segments.map((seg) =>
    compacted && (seg.id === "history" || seg.id === "tools")
      ? { ...seg, tokens: Math.round(seg.tokens * 0.4) }
      : seg,
  );

const MeterHeader = ({
  used,
  maxTokens,
  pct,
  compacted,
  savedPct,
  costLabel,
  onToggle,
}: {
  used: number;
  maxTokens: number;
  pct: number;
  compacted: boolean;
  savedPct: number;
  costLabel: string;
  onToggle: () => void;
}) => (
  <div className="flex items-start justify-between gap-2">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground">Context Window</span>
        <Badge variant={compacted ? "success" : "secondary"} shape="tag">
          {compacted ? `已压缩 -${savedPct}%` : costLabel}
        </Badge>
      </div>
      <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
        {formatK(used)} / {formatK(maxTokens)} ({pct}%)
      </span>
    </div>
    <Button size="sm" variant={compacted ? "ghost" : "outline"} onClick={onToggle}>
      {compacted ? <RotateCcw className="size-3.5" /> : <Minimize2 className="size-3.5" />}
      <span>{compacted ? "还原" : "压缩上下文"}</span>
    </Button>
  </div>
);

export const AiTokenMeter = ({
  maxTokens = 200000,
  segments = DEFAULT_SEGMENTS,
  costLabel = "~$0.038",
  onCompact,
  className,
}: AiTokenMeterProps) => {
  const [compacted, setCompacted] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const safeMax = Math.max(1, maxTokens);
  const compactedSegments = compactSegments(segments, true);
  const activeSegments = compacted ? compactedSegments : segments;
  const rawUsed = segments.reduce((sum, s) => sum + s.tokens, 0);
  const compactedUsed = compactedSegments.reduce((sum, s) => sum + s.tokens, 0);
  const savedTokens = Math.max(0, rawUsed - compactedUsed);
  const savedPct = rawUsed > 0 ? Math.round((savedTokens / rawUsed) * 100) : 0;
  const used = activeSegments.reduce((sum, s) => sum + s.tokens, 0);
  const pct = Math.min(100, Math.round((used / safeMax) * 100));
  const handleToggle = () => {
    if (!compacted) onCompact?.(savedTokens);
    setCompacted((prev) => !prev);
  };
  return (
    <div
      data-slot="ai-token-meter"
      className={cn(
        "flex w-full max-w-xl flex-col gap-3.5 rounded-[22px] border border-solid border-border/90 bg-card p-4 text-card-foreground shadow-md",
        className,
      )}
    >
      <MeterHeader
        used={used}
        maxTokens={safeMax}
        pct={pct}
        compacted={compacted}
        savedPct={savedPct}
        costLabel={costLabel}
        onToggle={handleToggle}
      />
      <StackedBar
        segments={activeSegments}
        maxTokens={safeMax}
        focusedId={focusedId}
        onFocus={setFocusedId}
      />
    </div>
  );
};
