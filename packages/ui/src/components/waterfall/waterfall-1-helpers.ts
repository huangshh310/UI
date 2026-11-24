/**
 * Waterfall 数据映射与索引工具：将公开追踪树映射为底座数据结构并构建快速查找表。
 */
import {
  createWaterfallController,
  visibleWaterfallRows,
  type WaterfallData,
  type WaterfallDataItem,
} from "@ui-sdk/react/waterfall";
import { useMemo, useState } from "react";
import type { WaterfallProps, WaterfallSpan } from "./waterfall.types.js";

export const defaultFormatMs = (ms: number): string => {
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

export const toSdkWaterfallData = (items: WaterfallSpan[]): WaterfallData => items.map(toSdkSpan);

export const buildSpanLookup = (items: WaterfallSpan[]): Map<string, WaterfallSpan> => {
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

export const hasAnySpanMeta = (items: WaterfallSpan[]): boolean => {
  for (const item of items) {
    if (item.meta) return true;
    if (item.children && hasAnySpanMeta(item.children)) return true;
  }
  return false;
};

export const useWaterfallModel = (props: WaterfallProps) => {
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
