// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SpotlightSearch：基于 Base UI Dialog 与 motion 的聚焦搜索与分栏预览弹层。
 */

import { cn } from "@/lib/utils";
import { Dialog } from "@base-ui/react/dialog";
import { Clock, Search } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useMemo, useState } from "react";

export interface SpotlightSearchItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  shortcut?: string;
  /** 右侧预览分栏展示的摘要 */
  preview?: string;
}

export interface SpotlightSearchProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 初始打开状态 */
  defaultOpen?: boolean;
  /** 状态回调 */
  onOpenChange?: (open: boolean) => void;
  /** 触发按钮文案；传 null 时隐藏触发按钮 */
  triggerLabel?: string | null;
  /** 搜索占位提示 */
  placeholder?: string;
  /** 候选结果列表 */
  items: SpotlightSearchItem[];
  /** 最近搜索关键词胶囊 */
  recentQueries?: string[];
  /** 选中回调 */
  onSelect?: (item: SpotlightSearchItem) => void;
  /** 面板自定义类名 */
  className?: string;
}
const SPRING = { type: "spring" as const, stiffness: 380, damping: 30 };

const CategoryBar = ({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5 border-b border-solid border-border/75 bg-secondary/25 px-3.5 py-2">
    {["全部", ...categories].map((cat) => {
      const selected = active === cat;
      return (
        <button
          key={cat}
          type="button"
          aria-pressed={selected}
          onClick={() => onSelect(cat)}
          className={cn(
            "h-6 cursor-pointer rounded-full border border-solid px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {cat}
        </button>
      );
    })}
  </div>
);

const PreviewPane = ({ active }: { active?: SpotlightSearchItem }) =>
  active ? (
    <div className="hidden flex-col justify-between bg-secondary/20 p-4 sm:col-span-2 sm:flex">
      <div>
        <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-foreground">
          {active.category}
        </span>
        <p className="m-0 mt-2 text-sm font-semibold text-foreground">{active.title}</p>
        <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
          {active.preview ?? active.description ?? "按下回车打开详情"}
        </p>
      </div>
      {active.shortcut && (
        <span className="mt-4 font-mono text-[11px] text-muted-foreground">
          快捷键：{active.shortcut}
        </span>
      )}
    </div>
  ) : null;

const ResultSplitPane = ({
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
    <div className="grid grid-cols-1 divide-border/75 sm:grid-cols-5 sm:divide-x">
      <div className="max-h-72 overflow-y-auto p-1.5 sm:col-span-3">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => onHover(idx)}
            onClick={() => onChoose(item)}
            className={cn(
              "flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-xl border border-solid px-3 py-2 text-left transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
              idx === activeIndex
                ? "border-border bg-secondary text-foreground"
                : "border-transparent bg-transparent text-foreground hover:bg-accent/60",
            )}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="truncate text-sm font-medium">{item.title}</span>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                {item.category}
              </span>
            </div>
            {item.description && (
              <span className="truncate text-xs text-muted-foreground">{item.description}</span>
            )}
          </button>
        ))}
      </div>
      <PreviewPane active={items[activeIndex]} />
    </div>
  );
};

const RecentRow = ({
  recentQueries,
  onPick,
}: {
  recentQueries: string[];
  onPick: (term: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5 border-b border-solid border-border/75 px-3.5 py-2 text-xs text-muted-foreground">
    <Clock aria-hidden="true" className="size-3" />
    <span>最近：</span>
    {recentQueries.map((term) => (
      <button
        key={term}
        type="button"
        onClick={() => onPick(term)}
        className="cursor-pointer rounded-md border border-solid border-border bg-background px-2 py-0.5 text-xs text-foreground hover:bg-accent dark:bg-card"
      >
        {term}
      </button>
    ))}
  </div>
);

const SpotlightInputBar = ({
  query,
  placeholder,
  onChange,
}: {
  query: string;
  placeholder: string;
  onChange: (next: string) => void;
}) => (
  <div className="flex items-center gap-2.5 border-b border-solid border-border/80 px-4 py-3">
    <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    <input
      type="search"
      aria-label="聚焦搜索输入框"
      value={query}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-6 min-w-0 flex-1 border-0 bg-transparent font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground"
    />
    <kbd className="shrink-0 rounded border border-solid border-border bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      ESC
    </kbd>
  </div>
);

interface SpotlightPopupContentProps {
  query: string;
  placeholder: string;
  categories: string[];
  category: string;
  recentQueries: string[];
  filtered: SpotlightSearchItem[];
  activeIndex: number;
  className?: string;
  onQueryChange: (next: string) => void;
  onCategoryChange: (cat: string) => void;
  onHover: (idx: number) => void;
  onChoose: (item: SpotlightSearchItem) => void;
}

const SpotlightPopupContent = (p: SpotlightPopupContentProps) => (
  <Dialog.Popup
    render={
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={SPRING}
        data-slot="spotlight-search"
        className={cn(
          "fixed top-[14vh] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-solid border-border bg-popover text-popover-foreground shadow-lg outline-none",
          p.className,
        )}
      />
    }
  >
    <Dialog.Title className="sr-only">聚焦搜索</Dialog.Title>
    <SpotlightInputBar query={p.query} placeholder={p.placeholder} onChange={p.onQueryChange} />
    <CategoryBar categories={p.categories} active={p.category} onSelect={p.onCategoryChange} />
    {!p.query && p.recentQueries.length > 0 && (
      <RecentRow recentQueries={p.recentQueries} onPick={p.onQueryChange} />
    )}
    <ResultSplitPane
      items={p.filtered}
      activeIndex={Math.min(p.activeIndex, Math.max(0, p.filtered.length - 1))}
      onHover={p.onHover}
      onChoose={p.onChoose}
    />
  </Dialog.Popup>
);

const useSpotlightState = (
  items: SpotlightSearchItem[],
  open?: boolean,
  defaultOpen = false,
  onOpenChange?: (open: boolean) => void,
) => {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [activeIndex, setActiveIndex] = useState(0);
  const isOpen = open ?? innerOpen;
  const categories = useMemo(() => [...new Set(items.map((item) => item.category))], [items]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (category === "全部" || item.category === category) &&
        (!q ||
          `${item.title} ${item.description ?? ""} ${item.category}`.toLowerCase().includes(q)),
    );
  }, [items, category, query]);

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    if (!next) {
      setQuery("");
      setCategory("全部");
      setActiveIndex(0);
    }
    onOpenChange?.(next);
  };

  return {
    isOpen,
    setOpen,
    query,
    setQuery,
    category,
    setCategory,
    activeIndex,
    setActiveIndex,
    categories,
    filtered,
  };
};

export const SpotlightSearch = (props: SpotlightSearchProps) => {
  const {
    triggerLabel = "聚焦搜索",
    placeholder = "搜索组件、文档或操作…",
    recentQueries = [],
  } = props;
  const s = useSpotlightState(props.items, props.open, props.defaultOpen, props.onOpenChange);

  return (
    <MotionConfig reducedMotion="user">
      <Dialog.Root open={s.isOpen} onOpenChange={s.setOpen}>
        {triggerLabel !== null && (
          <Dialog.Trigger className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-solid border-border bg-background px-3 font-sans text-sm font-medium text-foreground shadow-sm transition-colors hover:border-foreground/22 hover:bg-accent/50 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 dark:bg-card">
            <Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
            <span>{triggerLabel}</span>
          </Dialog.Trigger>
        )}
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm dark:bg-black/60" />
          <SpotlightPopupContent
            query={s.query}
            placeholder={placeholder}
            categories={s.categories}
            category={s.category}
            recentQueries={recentQueries}
            filtered={s.filtered}
            activeIndex={s.activeIndex}
            className={props.className}
            onQueryChange={(next) => {
              s.setQuery(next);
              s.setActiveIndex(0);
            }}
            onCategoryChange={(cat) => {
              s.setCategory(cat);
              s.setActiveIndex(0);
            }}
            onHover={s.setActiveIndex}
            onChoose={(item) => {
              props.onSelect?.(item);
              s.setOpen(false);
            }}
          />
        </Dialog.Portal>
      </Dialog.Root>
    </MotionConfig>
  );
};
