"use client";

/**
 * 组件目录的主体：分类页签、搜索框与示例网格。
 * 页签的键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供。
 */
import { Tabs } from "@base-ui/react/tabs";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES } from "@/registry/registry";
import type { DirectoryFilter } from "@/registry/registry.types";
import { SpecimenCard } from "./specimen-card";
import { useDirectoryFilter } from "./use-directory-filter";

const TABS: { id: DirectoryFilter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "recent", label: "最近" },
  ...CATEGORIES,
];

const TAB_CLASSES =
  "cursor-pointer border-b-2 border-transparent px-0.5 pb-3 text-sm text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:text-foreground focus-visible:underline aria-selected:border-foreground aria-selected:text-foreground";

export const SpecimenDirectory = ({ recentSlugs }: { recentSlugs: string[] }) => {
  const { query, setQuery, filter, setFilter, entries } = useDirectoryFilter(recentSlugs);

  return (
    <Tabs.Root value={filter} onValueChange={(value) => setFilter(value as DirectoryFilter)}>
      <div className="flex flex-col-reverse gap-6 md:flex-row md:items-end md:justify-between">
        <Tabs.List className="flex gap-7">
          {TABS.map(({ id, label }) => (
            <Tabs.Tab key={id} value={id} className={TAB_CLASSES}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <label className="flex h-10 w-full items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring md:mb-3 md:w-64">
          <MagnifyingGlassIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            aria-label="搜索组件"
            placeholder="搜索组件"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>
      <Tabs.Panel value={filter} className="pt-9 outline-none">
        {entries.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">
            没有匹配的示例。换一个关键字，或者清空搜索框。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry, index) => (
              <SpecimenCard
                key={entry.specimen.slug}
                entry={entry}
                index={index}
                isNew={recentSlugs.includes(entry.component.slug)}
              />
            ))}
          </div>
        )}
      </Tabs.Panel>
    </Tabs.Root>
  );
};
