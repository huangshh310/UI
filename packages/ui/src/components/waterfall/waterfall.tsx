"use client";

/**
 * Waterfall：智能体多步调用耗时火焰图与嵌套追踪瀑布流。
 * 遵循 WAI-ARIA treegrid 键盘导航规范，支持嵌套调用展开、里程碑标记与时间窗口缩放。
 */
import { cn } from "@matt-ui/utils";
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
  type WaterfallController,
  type WaterfallDataRow,
} from "@ui-sdk/react/waterfall";
import { ChevronRight, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useWaterfallModel } from "./waterfall-1-helpers.js";
import type {
  WaterfallMilestone,
  WaterfallProps,
  WaterfallSpan,
  WaterfallSpanTone,
} from "./waterfall.types.js";
import {
  WATERFALL_BAR_CELL_CLASS,
  WATERFALL_CONTROL_BTN_CLASS,
  WATERFALL_HEADER_ROW_CLASS,
  WATERFALL_INDICATOR_CLASS,
  WATERFALL_MARK_CLASS,
  WATERFALL_META_CELL_CLASS,
  WATERFALL_ROW_CLASS,
  WATERFALL_ROW_HEADER_CLASS,
  WATERFALL_SHELL_CLASS,
  WATERFALL_TICK_CLASS,
  WATERFALL_TOOLBAR_CLASS,
  WATERFALL_TONE_BAR_CLASS,
  waterfallGridVariants,
} from "./waterfall.variants.js";

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
