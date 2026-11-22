"use client";

/**
 * 组件目录的主体：搜索框、分类页签与示例网格。
 * 页签的键盘导航与 ARIA 语义由 Base UI 的 Tabs 提供。
 */
import { Tabs } from "@base-ui/react/tabs";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES } from "@/registry/registry";
import { SpecimenCard } from "./specimen-card";
import { useDirectoryFilter, type CategoryFilter } from "./use-directory-filter";

const TABS: { id: CategoryFilter; label: string }[] = [{ id: "all", label: "全部" }, ...CATEGORIES];

const TAB_CLASSES =
  "cursor-pointer border-b-2 border-transparent px-1 pb-3 text-sm text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:text-foreground focus-visible:underline aria-selected:border-signal aria-selected:text-foreground";

export const SpecimenDirectory = () => {
  const { query, setQuery, category, setCategory, entries } = useDirectoryFilter();

  return (
    <Tabs.Root value={category} onValueChange={(value) => setCategory(value as CategoryFilter)}>
      <div className="flex flex-col gap-5 border-b border-border md:flex-row md:items-end md:justify-between">
        <Tabs.List className="flex gap-6">
          {TABS.map(({ id, label }) => (
            <Tabs.Tab key={id} value={id} className={TAB_CLASSES}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <label className="mb-3 flex h-9 w-full items-center gap-2 rounded-md border border-input px-3 text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring md:w-64">
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
      <Tabs.Panel value={category} className="pt-8 outline-none">
        {entries.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">
            没有匹配的示例。换一个关键字，或者清空搜索框。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry, index) => (
              <SpecimenCard key={entry.specimen.slug} entry={entry} index={index} />
            ))}
          </div>
        )}
      </Tabs.Panel>
    </Tabs.Root>
  );
};
