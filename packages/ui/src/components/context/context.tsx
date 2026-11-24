"use client";

/**
 * Context：AI 上下文窗口环形微表盘与分段 Token 预算浮层检查器。
 */
import { Popover } from "@base-ui/react/popover";
import { cn } from "@matt-ui/utils";
import { useState } from "react";
import { ContextBreakdownContent, ContextRingIcon } from "./context-parts.js";
import type { ContextProps, ContextSegment, ContextSize, ContextSurface } from "./context.types.js";
import {
  CONTEXT_POPOVER_SURFACE,
  contextInlineVariants,
  contextTriggerVariants,
  formatContextTokens,
} from "./context.variants.js";

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
