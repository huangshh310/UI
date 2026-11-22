"use client";

/**
 * 组件目录的主体：带数量提示的胶囊分类页签、搜索框与双层示例网格。
 * 页签的键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供。
 */
import { Tabs } from "@base-ui/react/tabs";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
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
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-transparent px-3.5 py-1.5 text-sm font-medium text-muted-foreground outline-none transition-all duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:border-border aria-selected:bg-card aria-selected:text-foreground aria-selected:shadow-xs";

const countFor = (id: DirectoryFilter, recentSlugs: string[]): number => {
  if (id === "all") return DIRECTORY.length;
  if (id === "recent") {
    return DIRECTORY.filter(({ component }) => recentSlugs.includes(component.slug)).length;
  }
  return DIRECTORY.filter(({ component }) => component.category === id).length;
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
  <div className="flex flex-col-reverse gap-4 border-b border-border/70 pb-6 md:flex-row md:items-center md:justify-between">
    <Tabs.List className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border/75 bg-secondary/60 p-1">
      {TABS.map(({ id, label }) => (
        <Tabs.Tab key={id} value={id} className={TAB_CLASSES}>
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
    <label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-border bg-(--site-surface) px-4 text-sm shadow-xs transition-colors focus-within:border-foreground/30 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring md:w-72">
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
      <Tabs.Panel value={filter} className="pt-8 outline-none">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-(--site-stage)/50 py-20 text-center">
            <p className="text-sm text-muted-foreground">
              没有匹配的示例。换一个关键字，或者清空搜索框。
            </p>
          </div>
        ) : (
          <div
            className={
              filter === "blocks"
                ? "grid grid-cols-1 gap-7"
                : "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
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
