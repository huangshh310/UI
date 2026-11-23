// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Context：AI 上下文窗口环形微表盘与分段 Token 预算浮层检查器（对标 shadcn AI Elements Context + Linear 遥测美学）。
 */

import { cn } from "@/lib/utils";
import { Popover } from "@base-ui/react/popover";
import { cva } from "class-variance-authority";
import { Minimize2, RotateCcw } from "lucide-react";
import { useState } from "react";

export const CONTEXT_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const CONTEXT_TONE_BAR: Record<ContextSegmentTone, string> = {
  primary: "bg-primary",
  signal: "bg-signal",
  success: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-amber-500 dark:bg-amber-400",
};

export const CONTEXT_POPOVER_SURFACE =
  "w-84 origin-(--transform-origin) overflow-hidden rounded-2xl border border-solid border-border/80 bg-popover/96 text-popover-foreground shadow-[0_18px_48px_-12px_rgba(0,0,0,0.16),0_3px_10px_-2px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-[transform,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out) outline-none data-ending-style:scale-97 data-ending-style:opacity-0 data-starting-style:scale-97 data-starting-style:opacity-0 dark:border-white/10 dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.78)]";

export const contextTriggerVariants = cva(
  `inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-solid font-mono font-medium text-foreground tabular-nums select-none transition-[background-color,border-color,box-shadow] duration-(--ui-duration-fast) data-popup-open:border-ring/70 data-popup-open:bg-accent ${CONTEXT_FOCUS_RING}`,
  {
    variants: {
      size: {
        sm: "h-7 px-2 text-[11px]",
        md: "h-8 px-2.5 text-[11px]",
      },
      surface: {
        default:
          "border-border/80 bg-card/90 shadow-xs hover:border-foreground/22 hover:bg-card dark:border-white/10 dark:bg-card/80 dark:hover:border-white/22",
        subtle:
          "border-transparent bg-secondary/75 hover:bg-secondary dark:bg-white/8 dark:hover:bg-white/12",
        glass:
          "border-border/75 bg-popover/85 shadow-xs backdrop-blur-xl hover:border-foreground/22 dark:border-white/10 dark:bg-popover/78",
      },
    },
    defaultVariants: {
      size: "md",
      surface: "default",
    },
  },
);

export const contextInlineVariants = cva(
  "w-full max-w-md rounded-2xl border border-solid text-card-foreground",
  {
    variants: {
      surface: {
        default: "border-border/80 bg-card/92 shadow-sm dark:border-white/10 dark:bg-card/85",
        subtle: "border-border/65 bg-secondary/40 dark:border-white/8 dark:bg-white/4",
        glass:
          "border-border/75 bg-popover/90 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-popover/80",
      },
    },
    defaultVariants: {
      surface: "default",
    },
  },
);

export const formatContextTokens = (n: number) => `${(n / 1000).toFixed(1)}K`;
export type ContextSegmentTone = "primary" | "signal" | "success" | "warning";

export interface ContextSegment {
  id: string;
  label: string;
  tokens: number;
  tone?: ContextSegmentTone;
}

export type ContextVariant = "pill" | "inline";
export type ContextSize = "sm" | "md";
export type ContextSurface = "default" | "subtle" | "glass";

export interface ContextProps {
  /** 模型最大上下文窗口 Token 容量，默认 200000 */
  maxTokens?: number;
  /** 分段 Token 占用明细 */
  segments?: ContextSegment[];
  /** 展示形态：pill 紧凑环形微胶囊（点击展开浮层明细），inline 直接平铺明细卡片 */
  variant?: ContextVariant;
  /** 胶囊或面板紧凑度，默认 md */
  size?: ContextSize;
  /** 表面质感：default 发丝卡片、subtle 轻量填充、glass 毛玻璃，默认 default */
  surface?: ContextSurface;
  /** 预估当轮会话成本说明（如 "~$0.024"） */
  costLabel?: string;
  /** 是否展示成本徽章，默认 true */
  showCost?: boolean;
  /** 可选当前模型标识（展示于浮层头部，如 "claude-3.7-sonnet"） */
  modelName?: string;
  /** 是否展示一键压缩按钮，默认 true */
  compactable?: boolean;
  /** 点击一键压缩上下文时的回调，回传压缩释放的 Token 数量 */
  onCompact?: (savedTokens: number) => void;
  className?: string;
  "aria-label"?: string;
}
const ContextRingIcon = ({ pct }: { pct: number }) => {
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

interface ContextBreakdownContentProps extends BreakdownHeaderProps {
  segments: ContextSegment[];
  focusedId: string | null;
  onFocus: (id: string | null) => void;
  compact: boolean;
}

const ContextBreakdownContent = (p: ContextBreakdownContentProps) => {
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
const DEFAULT_CONTEXT_SEGMENTS: ContextSegment[] = [
  { id: "system", label: "系统提示", tokens: 16000, tone: "primary" },
  { id: "history", label: "历史对话", tokens: 64000, tone: "signal" },
  { id: "sources", label: "检索上下文", tokens: 32000, tone: "success" },
  { id: "tools", label: "工具输出", tokens: 16000, tone: "warning" },
];

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
  size,
  surface,
  ariaLabel,
  className,
  children,
}: {
  pct: number;
  used: number;
  size: ContextSize;
  surface: ContextSurface;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <Popover.Root>
    <Popover.Trigger
      data-slot="context"
      data-variant="pill"
      aria-label={ariaLabel ?? `上下文窗口占用 ${pct}% · ${formatContextTokens(used)}`}
      className={cn(contextTriggerVariants({ size, surface }), className)}
    >
      <ContextRingIcon pct={pct} />
      <span>{pct}%</span>
      <span className="text-muted-foreground">· {formatContextTokens(used)}</span>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner sideOffset={8} align="end" className="z-(--ui-z-popover) outline-none">
        <Popover.Popup className={CONTEXT_POPOVER_SURFACE}>{children}</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);

const buildBreakdownProps = (
  props: ContextProps,
  m: ReturnType<typeof useContextMetrics>,
  size: ContextSize,
) => ({
  segments: m.activeSegments,
  maxTokens: m.safeMax,
  used: m.used,
  pct: m.pct,
  savedTokens: m.savedTokens,
  compacted: m.compacted,
  costLabel: props.costLabel ?? "~$0.024",
  showCost: props.showCost ?? true,
  modelName: props.modelName,
  compactable: props.compactable ?? true,
  focusedId: m.focusedId,
  onFocus: m.setFocusedId,
  onToggleCompact: m.toggleCompact,
  compact: size === "sm",
});

export const Context = (props: ContextProps) => {
  const variant = props.variant ?? "pill";
  const size = props.size ?? "md";
  const surface = props.surface ?? "default";
  const m = useContextMetrics(
    props.maxTokens ?? 200000,
    props.segments ?? DEFAULT_CONTEXT_SEGMENTS,
    props.onCompact,
  );
  const body = <ContextBreakdownContent {...buildBreakdownProps(props, m, size)} />;

  if (variant === "inline") {
    return (
      <div
        data-slot="context"
        data-variant="inline"
        className={cn(contextInlineVariants({ surface }), props.className)}
      >
        {body}
      </div>
    );
  }

  return (
    <ContextPopover
      pct={m.pct}
      used={m.used}
      size={size}
      surface={surface}
      ariaLabel={props["aria-label"]}
      className={props.className}
    >
      {body}
    </ContextPopover>
  );
};
