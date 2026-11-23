"use client";

/**
 * SpotlightSearch 的内部子视图：分类筛选栏、历史胶囊、搜索栏、左右分栏与底部键盘提示栏。
 */
import { cn } from "@matt-ui/utils";
import { Clock, CornerDownLeft, Search, X } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { SpotlightSearchItem } from "./spotlight-search.types.js";
import { SPOTLIGHT_KBD_CLASS } from "./spotlight-search.variants.js";

export const CategoryBar = ({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5 border-b border-solid border-border/75 bg-secondary/25 px-3.5 py-2 dark:border-white/8 dark:bg-white/[0.02]">
    {["全部", ...categories].map((cat) => {
      const selected = active === cat;
      return (
        <button
          key={cat}
          type="button"
          aria-pressed={selected}
          onClick={() => onSelect(cat)}
          className={cn(
            "h-6.5 cursor-pointer rounded-full border border-solid px-2.5 font-sans text-xs font-medium outline-none transition-colors duration-(--ui-duration-fast) focus-visible:ring-2 focus-visible:ring-ring",
            selected
              ? "border-primary bg-primary text-primary-foreground shadow-xs"
              : "border-transparent bg-transparent text-muted-foreground hover:bg-accent/80 hover:text-foreground dark:hover:bg-white/10",
          )}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

export const RecentRow = ({
  recentQueries,
  onPick,
}: {
  recentQueries: string[];
  onPick: (term: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5 border-b border-solid border-border/75 px-3.5 py-2 text-xs text-muted-foreground dark:border-white/8">
    <Clock aria-hidden="true" className="size-3" />
    <span>最近：</span>
    {recentQueries.map((term) => (
      <button
        key={term}
        type="button"
        onClick={() => onPick(term)}
        className="cursor-pointer rounded-lg border border-solid border-border/80 bg-background px-2 py-0.5 text-xs font-medium text-foreground outline-none transition-colors hover:border-foreground/22 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10 dark:bg-card"
      >
        {term}
      </button>
    ))}
  </div>
);

export const SpotlightInputBar = ({
  query,
  placeholder,
  onChange,
  onKeyDown,
}: {
  query: string;
  placeholder: string;
  onChange: (next: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex items-center gap-2.5 border-b border-solid border-border/75 px-4 py-3 dark:border-white/8">
    <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    <input
      type="search"
      aria-label="聚焦搜索输入框"
      value={query}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="h-6 min-w-0 flex-1 border-0 bg-transparent font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground"
    />
    {query && (
      <button
        type="button"
        aria-label="清空搜索"
        onClick={() => onChange("")}
        className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    )}
    <kbd className={SPOTLIGHT_KBD_CLASS}>ESC</kbd>
  </div>
);

const PreviewPane = ({ active }: { active?: SpotlightSearchItem }) =>
  active ? (
    <div className="hidden flex-col justify-between bg-secondary/20 p-4 dark:bg-white/[0.02] sm:col-span-2 sm:flex">
      <div>
        <div className="flex items-center gap-2">
          {active.icon && (
            <span
              aria-hidden="true"
              className="inline-flex size-7 items-center justify-center rounded-lg border border-solid border-border/80 bg-background text-foreground dark:border-white/10 dark:bg-card"
            >
              {active.icon}
            </span>
          )}
          <span className="inline-flex items-center rounded-full border border-solid border-border/80 bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-foreground dark:border-white/10 dark:bg-white/8">
            {active.category}
          </span>
        </div>
        <p className="m-0 mt-3 text-sm font-semibold tracking-tight text-foreground">
          {active.title}
        </p>
        <p className="m-0 mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {active.preview ?? active.description ?? "按下回车打开详情"}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-solid border-border/75 pt-2.5 dark:border-white/8">
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {active.meta ?? "回车打开"}
        </span>
        {active.shortcut && <kbd className={SPOTLIGHT_KBD_CLASS}>{active.shortcut}</kbd>}
      </div>
    </div>
  ) : null;

const ResultItemRow = ({
  item,
  selected,
  onHover,
  onChoose,
}: {
  item: SpotlightSearchItem;
  selected: boolean;
  onHover: () => void;
  onChoose: () => void;
}) => (
  <button
    type="button"
    onMouseEnter={onHover}
    onClick={onChoose}
    className={cn(
      "flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-solid px-2.5 py-2 text-left outline-none transition-colors duration-(--ui-duration-instant) focus-visible:ring-2 focus-visible:ring-ring",
      selected
        ? "border-border/85 bg-accent/85 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-white/10"
        : "border-transparent bg-transparent text-foreground hover:bg-accent/55 dark:hover:bg-white/6",
    )}
  >
    {item.icon && (
      <span
        aria-hidden="true"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-solid border-border/75 bg-background text-muted-foreground dark:border-white/10 dark:bg-card"
      >
        {item.icon}
      </span>
    )}
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium">{item.title}</span>
        <span className="shrink-0 rounded-full bg-secondary/85 px-2 py-0.5 text-[10px] font-medium text-muted-foreground dark:bg-white/8">
          {item.category}
        </span>
      </span>
      {item.description && (
        <span className="truncate text-xs text-muted-foreground">{item.description}</span>
      )}
    </span>
    {selected && (
      <CornerDownLeft aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
    )}
  </button>
);

export const ResultSplitPane = ({
  items,
  activeIndex,
  onHover,
  onChoose,
}: {
  items: SpotlightSearchItem[];
  activeIndex: number;
  onHover: (index: number) => void;
  onChoose: (item: SpotlightSearchItem) => void;
}) => {
  if (items.length === 0) {
    return <p className="m-0 py-10 text-center text-xs text-muted-foreground">未找到匹配结果</p>;
  }
  return (
    <div className="grid grid-cols-1 divide-border/75 dark:divide-white/8 sm:grid-cols-5 sm:divide-x">
      <div className="max-h-72 overflow-y-auto p-1.5 sm:col-span-3">
        {items.map((item, idx) => (
          <ResultItemRow
            key={item.id}
            item={item}
            selected={idx === activeIndex}
            onHover={() => onHover(idx)}
            onChoose={() => onChoose(item)}
          />
        ))}
      </div>
      <PreviewPane active={items[activeIndex]} />
    </div>
  );
};

export const SpotlightFooterBar = ({ count }: { count: number }) => (
  <div className="flex items-center justify-between gap-3 border-t border-solid border-border/75 bg-secondary/35 px-4 py-2 text-[11px] text-muted-foreground dark:border-white/8 dark:bg-white/[0.03]">
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5">
        <kbd className={SPOTLIGHT_KBD_CLASS}>↑↓</kbd>
        <span>切换</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <kbd className={SPOTLIGHT_KBD_CLASS}>↵</kbd>
        <span>打开</span>
      </span>
    </div>
    <span className="font-mono tabular-nums">{count} 项结果</span>
  </div>
);
