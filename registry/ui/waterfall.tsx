// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Waterfall：智能体多步调用耗时火焰图与嵌套追踪瀑布流。
 * 遵循 WAI-ARIA treegrid 键盘导航规范，支持嵌套调用展开、里程碑标记与时间窗口缩放。
 */

import { cn } from "@/lib/utils";
import {
  Waterfall as SdkWaterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallCell,
  WaterfallColumnHeader,
  WaterfallHeaderRow,
  WaterfallIndicator,
  WaterfallMark,
  WaterfallRow,
  WaterfallRowHeader,
  WaterfallTick,
  createWaterfallController,
  type WaterfallController,
  type WaterfallData,
  type WaterfallDataItem,
  type WaterfallDataRow,
  visibleWaterfallRows,
} from "@ui-sdk/react/waterfall";
import { cva } from "class-variance-authority";
import { ChevronRight, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

export const waterfallGridVariants = cva("grid items-center", {
  variants: {
    hasMeta: {
      true: "grid-cols-[minmax(116px,1.1fr)_76px_minmax(120px,1.75fr)] @lg:grid-cols-[minmax(160px,1.15fr)_88px_minmax(180px,2fr)]",
      false:
        "grid-cols-[minmax(120px,1.15fr)_minmax(140px,2fr)] @lg:grid-cols-[minmax(160px,1.15fr)_minmax(200px,2.2fr)]",
    },
  },
  defaultVariants: {
    hasMeta: false,
  },
});

export const WATERFALL_SHELL_CLASS =
  "@container flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-solid border-border bg-card font-sans text-card-foreground shadow-2xs";

export const WATERFALL_TOOLBAR_CLASS =
  "flex items-center justify-between gap-2 border-b border-solid border-border/70 bg-muted/30 px-3.5 py-2";

export const WATERFALL_CONTROL_BTN_CLASS =
  "inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-solid border-border bg-background px-2.5 font-sans text-xs font-medium text-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring";

export const WATERFALL_HEADER_ROW_CLASS =
  "border-b border-solid border-border/80 bg-muted/25 text-[11px] font-medium text-muted-foreground";

export const WATERFALL_ROW_CLASS =
  "group border-b border-solid border-border/45 text-xs transition-colors duration-(--ui-duration-instant) outline-none last:border-b-0 hover:bg-muted/35 focus-visible:bg-accent/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-[selected]:bg-signal/10";

export const WATERFALL_ROW_HEADER_CLASS =
  "flex min-w-0 items-center gap-1.5 py-2 pr-2.5 pl-[calc((var(--waterfall-level,1)-1)*14px+12px)] font-medium text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const WATERFALL_INDICATOR_CLASS =
  "inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-transform duration-(--ui-duration-fast) hover:text-foreground data-[expanded]:rotate-90";

export const WATERFALL_META_CELL_CLASS =
  "truncate border-x border-solid border-border/45 px-2.5 py-2 text-right font-mono text-[11px] text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const WATERFALL_BAR_CELL_CLASS =
  "relative flex h-9 items-center px-3 outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const WATERFALL_TICK_CLASS =
  "pointer-events-none absolute bottom-1 left-(--waterfall-tick) -translate-x-1/2 font-mono text-[10px] leading-none text-muted-foreground whitespace-nowrap";

export const WATERFALL_MARK_CLASS =
  "pointer-events-none absolute top-0 bottom-0 left-(--waterfall-mark) z-10 flex items-start border-l border-dashed border-signal pl-1 pt-1 font-mono text-[10px] leading-none font-medium text-foreground whitespace-nowrap data-[outside]:hidden";

export const WATERFALL_TONE_BAR_CLASS: Record<WaterfallSpanTone, string> = {
  default: "bg-primary/75",
  signal: "bg-signal",
  success: "bg-emerald-600 dark:bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-destructive",
};
export type WaterfallSpanTone = "default" | "signal" | "success" | "warning" | "destructive";

export interface WaterfallSpan {
  value: string;
  label: string;
  /** 相对起始毫秒数 */
  start: number;
  /** 持续耗时毫秒数 */
  duration: number;
  /** 耗时条语义色调 */
  tone?: WaterfallSpanTone;
  /** 附加指标文案（如 Token 用量、状态码或缓存命中标记） */
  meta?: string;
  /** 嵌套触发的子级调用步骤 */
  children?: WaterfallSpan[];
}

export interface WaterfallMilestone {
  /** 里程碑时刻（毫秒） */
  time: number;
  /** 里程碑标签（如首字到达 TTFT） */
  label: string;
}

export interface WaterfallProps {
  /** 顶层及嵌套追踪步骤数组 */
  items: WaterfallSpan[];
  /** 无障碍树表名称 */
  ariaLabel?: string;
  /** 可选顶部面板标题 */
  title?: string;
  /** 是否展示「全部展开 / 全部折叠」控制按钮 */
  showControls?: boolean;
  /** 步骤列标题，默认「调用步骤」 */
  nameHeader?: string;
  /** 附加指标列标题（传入或步骤含 meta 时显示该列） */
  metaHeader?: string;
  /** 时间轴列无障碍名称，默认「时间轴」 */
  timelineHeader?: string;
  /** 贯穿所有行的时间轴里程碑标记 */
  milestones?: WaterfallMilestone[];
  /** 可视时间范围 [start, end]（毫秒），用于缩放或平移时间窗口 */
  range?: [number, number];
  /** 时间轴最大刻度数，默认 5 */
  maxTicks?: number;
  /** 受控选中步骤 value */
  value?: string | null;
  /** 非受控初始选中步骤 value */
  defaultValue?: string | null;
  /** 选中步骤变化回调 */
  onValueChange?: (value: string | null, span?: WaterfallSpan) => void;
  /** 受控展开步骤 value 列表 */
  expanded?: string[];
  /** 非受控初始展开步骤 value 列表 */
  defaultExpanded?: string[];
  /** 展开步骤变化回调 */
  onExpandedChange?: (expanded: string[]) => void;
  /** 自定义耗时文案格式化函数 */
  formatDuration?: (ms: number) => string;
  className?: string;
}
const defaultFormatMs = (ms: number): string => {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
};

const toSdkSpan = (span: WaterfallSpan): WaterfallDataItem => ({
  value: span.value,
  label: span.label,
  start: span.start,
  duration: span.duration,
  children: span.children?.map(toSdkSpan),
});

const toSdkWaterfallData = (items: WaterfallSpan[]): WaterfallData => items.map(toSdkSpan);

const buildSpanLookup = (items: WaterfallSpan[]): Map<string, WaterfallSpan> => {
  const map = new Map<string, WaterfallSpan>();
  const visit = (list: WaterfallSpan[]) => {
    for (const item of list) {
      map.set(item.value, item);
      if (item.children) visit(item.children);
    }
  };
  visit(items);
  return map;
};

const hasAnySpanMeta = (items: WaterfallSpan[]): boolean => {
  for (const item of items) {
    if (item.meta) return true;
    if (item.children && hasAnySpanMeta(item.children)) return true;
  }
  return false;
};

const useWaterfallModel = (props: WaterfallProps) => {
  const [controller] = useState(() => createWaterfallController());
  const [innerExpanded, setInnerExpanded] = useState<string[]>(props.defaultExpanded ?? []);
  const activeExpanded = props.expanded ?? innerExpanded;
  const formatMs = props.formatDuration ?? defaultFormatMs;
  const sdkItems = useMemo(() => toSdkWaterfallData(props.items), [props.items]);
  const spanLookup = useMemo(() => buildSpanLookup(props.items), [props.items]);
  const hasMeta = useMemo(
    () => Boolean(props.metaHeader) || hasAnySpanMeta(props.items),
    [props.metaHeader, props.items],
  );
  const rows = useMemo(
    () => visibleWaterfallRows(sdkItems, activeExpanded),
    [sdkItems, activeExpanded],
  );

  return {
    controller,
    activeExpanded,
    setInnerExpanded,
    formatMs,
    sdkItems,
    spanLookup,
    hasMeta,
    rows,
  };
};
const WaterfallToolbar = ({
  title,
  showControls,
  controller,
}: {
  title?: string;
  showControls?: boolean;
  controller: WaterfallController;
}) => {
  if (!title && !showControls) return null;
  return (
    <div data-slot="waterfall-toolbar" className={WATERFALL_TOOLBAR_CLASS}>
      <span className="text-xs font-semibold text-foreground">{title ?? "调用追踪"}</span>
      {showControls && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => controller.expandAll()}
            className={WATERFALL_CONTROL_BTN_CLASS}
          >
            <ChevronsUpDown aria-hidden="true" className="size-3.5 text-muted-foreground" />
            全部展开
          </button>
          <button
            type="button"
            onClick={() => controller.collapseAll()}
            className={WATERFALL_CONTROL_BTN_CLASS}
          >
            <ChevronsDownUp aria-hidden="true" className="size-3.5 text-muted-foreground" />
            全部折叠
          </button>
        </div>
      )}
    </div>
  );
};

const WaterfallTableHeader = ({
  hasMeta,
  nameHeader,
  metaHeader,
  timelineHeader,
  maxTicks,
  milestones,
}: {
  hasMeta: boolean;
  nameHeader?: string;
  metaHeader?: string;
  timelineHeader?: string;
  maxTicks?: number;
  milestones?: WaterfallMilestone[];
}) => (
  <WaterfallHeaderRow
    className={cn(waterfallGridVariants({ hasMeta }), WATERFALL_HEADER_ROW_CLASS)}
  >
    <WaterfallColumnHeader className="px-3 py-2">{nameHeader ?? "调用步骤"}</WaterfallColumnHeader>
    {hasMeta && (
      <WaterfallColumnHeader className="border-x border-solid border-border/60 px-2.5 py-2 text-right">
        {metaHeader ?? "指标"}
      </WaterfallColumnHeader>
    )}
    <WaterfallColumnHeader
      className={cn(
        "relative overflow-hidden px-3 pr-14",
        milestones && milestones.length > 0 ? "h-10" : "h-7",
      )}
    >
      <span className="sr-only">{timelineHeader ?? "时间轴"}</span>
      <WaterfallAxis maxTicks={maxTicks ?? 4} className="relative h-full w-full">
        {(state) =>
          state.ticks.map((t) => (
            <WaterfallTick key={t.time} time={t.time} className={WATERFALL_TICK_CLASS} />
          ))
        }
      </WaterfallAxis>
      {milestones?.map((m) => (
        <WaterfallMark key={`${m.time}-${m.label}`} time={m.time} className={WATERFALL_MARK_CLASS}>
          {m.label}
        </WaterfallMark>
      ))}
    </WaterfallColumnHeader>
  </WaterfallHeaderRow>
);

const WaterfallFlameBar = ({
  tone,
  durationText,
}: {
  tone: WaterfallSpanTone;
  durationText: string;
}) => (
  <WaterfallBar className={WATERFALL_BAR_CELL_CLASS}>
    <span
      aria-hidden="true"
      className="pointer-events-none relative h-4 w-full rounded-sm bg-muted/50"
    >
      <span
        className={cn(
          "absolute inset-y-0.5 left-(--waterfall-start) w-(--waterfall-size) min-w-1 rounded-xs transition-all duration-(--ui-duration-fast)",
          WATERFALL_TONE_BAR_CLASS[tone],
        )}
      />
    </span>
    <span
      aria-hidden="true"
      className="ml-2 w-12 shrink-0 text-right font-mono text-[11px] text-muted-foreground"
    >
      {durationText}
    </span>
  </WaterfallBar>
);

const WaterfallSpanRow = ({
  span,
  hasMeta,
  formatMs,
}: {
  span: WaterfallSpan;
  hasMeta: boolean;
  formatMs: (ms: number) => string;
}) => {
  const hasChildren = Boolean(span.children && span.children.length > 0);
  return (
    <WaterfallRow
      value={span.value}
      className={cn(waterfallGridVariants({ hasMeta }), WATERFALL_ROW_CLASS)}
    >
      <WaterfallRowHeader className={WATERFALL_ROW_HEADER_CLASS}>
        {hasChildren ? (
          <WaterfallIndicator className={WATERFALL_INDICATOR_CLASS}>
            <ChevronRight aria-hidden="true" className="size-3.5" />
          </WaterfallIndicator>
        ) : (
          <span aria-hidden="true" className="inline-block size-4 shrink-0" />
        )}
        <span className="truncate">{span.label}</span>
      </WaterfallRowHeader>
      {hasMeta && (
        <WaterfallCell className={WATERFALL_META_CELL_CLASS}>{span.meta ?? "—"}</WaterfallCell>
      )}
      <WaterfallFlameBar tone={span.tone ?? "default"} durationText={formatMs(span.duration)} />
    </WaterfallRow>
  );
};

const WaterfallRowsList = ({
  rows,
  spanLookup,
  hasMeta,
  formatMs,
}: {
  rows: WaterfallDataRow[];
  spanLookup: Map<string, WaterfallSpan>;
  hasMeta: boolean;
  formatMs: (ms: number) => string;
}) => (
  <>
    {rows.map(({ item }) => {
      const span = spanLookup.get(item.value);
      if (!span) return null;
      return (
        <WaterfallSpanRow key={span.value} span={span} hasMeta={hasMeta} formatMs={formatMs} />
      );
    })}
  </>
);

export const Waterfall = (props: WaterfallProps) => {
  const m = useWaterfallModel(props);

  return (
    <div data-slot="waterfall-shell" className={cn(WATERFALL_SHELL_CLASS, props.className)}>
      <WaterfallToolbar
        title={props.title}
        showControls={props.showControls}
        controller={m.controller}
      />
      <SdkWaterfall
        aria-label={props.ariaLabel ?? props.title ?? "调用耗时瀑布流"}
        items={m.sdkItems}
        controller={m.controller}
        range={props.range}
        value={props.value}
        defaultValue={props.defaultValue}
        expanded={m.activeExpanded}
        format={m.formatMs}
        onValueChange={(next) =>
          props.onValueChange?.(next, next ? m.spanLookup.get(next) : undefined)
        }
        onExpandedChange={(next) => {
          if (props.expanded === undefined) m.setInnerExpanded(next);
          props.onExpandedChange?.(next);
        }}
        className="flex w-full flex-col outline-none"
      >
        <WaterfallTableHeader
          hasMeta={m.hasMeta}
          nameHeader={props.nameHeader}
          metaHeader={props.metaHeader}
          timelineHeader={props.timelineHeader}
          maxTicks={props.maxTicks}
          milestones={props.milestones}
        />
        <WaterfallRowsList
          rows={m.rows}
          spanLookup={m.spanLookup}
          hasMeta={m.hasMeta}
          formatMs={m.formatMs}
        />
      </SdkWaterfall>
    </div>
  );
};
