"use client";

/**
 * 组件目录的主体：轻盈胶囊分类页签、极简搜索框与无缝单体画廊网格。
 * 页签的键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供。
 */
import { Tabs } from "@base-ui/react/tabs";
import { CaretLeftIcon, CaretRightIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, DIRECTORY } from "@/registry/registry";
import type { DirectoryFilter } from "@/registry/registry.types";
import { SpecimenCard } from "./specimen-card";
import { useDirectoryFilter } from "./use-directory-filter";

const WIDE_SLUGS = new Set(["data-table", "advanced-data-table"]);

const TABS: { id: DirectoryFilter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "recent", label: "最近" },
  ...CATEGORIES,
];

const TAB_CLASSES =
  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap scroll-mx-10 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring aria-selected:bg-(--site-surface) aria-selected:text-foreground aria-selected:shadow-xs";

const SCROLL_BUTTON_CLASSES =
  "pointer-events-auto inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-(--site-surface) text-foreground shadow-xs ring-1 ring-border/70 transition-colors duration-(--ui-duration-fast) hover:bg-(--site-canvas)";

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

const revealTab = (target: HTMLElement) => {
  target.scrollIntoView({ behavior: scrollBehavior(), inline: "nearest", block: "nearest" });
};

const countFor = (id: DirectoryFilter, recentSlugs: string[]): number => {
  if (id === "all") return DIRECTORY.length;
  if (id === "recent") {
    return DIRECTORY.filter(({ component }) => recentSlugs.includes(component.slug)).length;
  }
  return DIRECTORY.filter(({ component }) => component.category === id).length;
};

/** 追踪横向滚动容器的左右溢出状态，并提供平滑步进滚动方法 */
const useHorizontalScroll = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ left: false, right: false });

  const syncOverflow = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setOverflow((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    syncOverflow();
    const observer = new ResizeObserver(syncOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncOverflow]);

  const scrollTabs = (direction: -1 | 1) => {
    const el = listRef.current;
    if (!el) return;
    const distance = Math.max(160, Math.round(el.clientWidth * 0.55));
    el.scrollBy({ left: direction * distance, behavior: scrollBehavior() });
  };

  return { listRef, overflow, syncOverflow, scrollTabs };
};

const ScrollEdgeButton = ({ side, onClick }: { side: "left" | "right"; onClick: () => void }) => (
  <div
    className={
      side === "left"
        ? "pointer-events-none absolute inset-y-0 left-0 flex items-center bg-linear-to-r from-(--site-stage) from-55% to-transparent pr-5 pl-1"
        : "pointer-events-none absolute inset-y-0 right-0 flex items-center bg-linear-to-l from-(--site-stage) from-55% to-transparent pr-1 pl-5"
    }
  >
    <button
      type="button"
      tabIndex={-1}
      aria-label={side === "left" ? "向左滚动分类" : "向右滚动分类"}
      onClick={onClick}
      className={SCROLL_BUTTON_CLASSES}
    >
      {side === "left" ? (
        <CaretLeftIcon weight="bold" className="size-3.5" aria-hidden="true" />
      ) : (
        <CaretRightIcon weight="bold" className="size-3.5" aria-hidden="true" />
      )}
    </button>
  </div>
);

/** 单行可横向滚动的分类胶囊：宽度不足时保持胶囊形态，边缘渐隐并提供左右滚动按钮 */
const CategoryTabs = ({ recentSlugs }: { recentSlugs: string[] }) => {
  const { listRef, overflow, syncOverflow, scrollTabs } = useHorizontalScroll();

  return (
    <div className="relative inline-flex max-w-full min-w-0 items-center overflow-hidden rounded-full bg-(--site-stage)">
      <Tabs.List
        ref={listRef}
        onScroll={syncOverflow}
        className="flex flex-nowrap items-center gap-1 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map(({ id, label }) => (
          <Tabs.Tab
            key={id}
            value={id}
            onFocus={(event) => revealTab(event.currentTarget)}
            onClick={(event) => revealTab(event.currentTarget)}
            className={TAB_CLASSES}
          >
            <span>{label}</span>
            <span
              aria-hidden="true"
              className="font-mono text-[11px] text-muted-foreground tabular-nums"
            >
              {countFor(id, recentSlugs)}
            </span>
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {overflow.left && <ScrollEdgeButton side="left" onClick={() => scrollTabs(-1)} />}
      {overflow.right && <ScrollEdgeButton side="right" onClick={() => scrollTabs(1)} />}
    </div>
  );
};

const DirectoryToolbar = ({
  recentSlugs,
  query,
  onQueryChange,
}: {
  recentSlugs: string[];
  query: string;
  onQueryChange: (value: string) => void;
}) => (
  <div className="flex flex-col-reverse items-start gap-3 pb-2 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
    <CategoryTabs recentSlugs={recentSlugs} />
    <label className="flex h-10 w-full shrink-0 items-center gap-2.5 rounded-full bg-(--site-stage) px-4 text-sm transition-colors focus-within:bg-(--site-surface) focus-within:ring-2 focus-within:ring-ring focus-within:ring-inset sm:w-80 xl:w-64 2xl:w-72">
      <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        aria-label="搜索组件"
        placeholder="搜索组件或示例…"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </label>
  </div>
);

export const SpecimenDirectory = ({ recentSlugs }: { recentSlugs: string[] }) => {
  const { query, setQuery, filter, setFilter, entries } = useDirectoryFilter(recentSlugs);

  return (
    <Tabs.Root value={filter} onValueChange={(value) => setFilter(value as DirectoryFilter)}>
      <DirectoryToolbar recentSlugs={recentSlugs} query={query} onQueryChange={setQuery} />
      <Tabs.Panel value={filter} className="pt-6 outline-none">
        {entries.length === 0 ? (
          <div className="rounded-[26px] bg-(--site-stage) py-20 text-center">
            <p className="text-sm text-muted-foreground">
              没有匹配的示例。换一个关键字，或者清空搜索框。
            </p>
          </div>
        ) : (
          <div
            className={
              filter === "blocks"
                ? "grid grid-cols-1 gap-6"
                : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            }
          >
            {entries.map((entry, index) => (
              <SpecimenCard
                key={`${entry.component.slug}/${entry.specimen.slug}`}
                entry={entry}
                index={index}
                isNew={recentSlugs.includes(entry.component.slug)}
                wide={
                  filter === "blocks" ||
                  entry.component.category === "blocks" ||
                  WIDE_SLUGS.has(entry.component.slug)
                }
              />
            ))}
          </div>
        )}
      </Tabs.Panel>
    </Tabs.Root>
  );
};
