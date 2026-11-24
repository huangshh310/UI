// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SpotlightSearch：磨砂聚焦搜索与分栏实时预览弹层，内置弹簧过渡与全键盘导航。
 */

import { cn } from "@/lib/utils";
import { Dialog } from "@base-ui/react/dialog";
import { Clock, CornerDownLeft, Search, X } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { type KeyboardEvent, type ReactNode, useEffect, useMemo, useState } from "react";

export const SPOTLIGHT_SIZE_MAP: Record<SpotlightSearchSize, string> = {
  md: "max-w-xl",
  lg: "max-w-2xl",
};

export const SPOTLIGHT_TRIGGER_CLASS =
  "inline-flex h-9 cursor-pointer items-center gap-2.5 rounded-xl border border-solid border-border/85 bg-background px-3 font-sans text-sm font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) hover:border-foreground/22 hover:bg-card focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/12 dark:bg-card/90 dark:hover:border-white/22 dark:hover:bg-card";

export const SPOTLIGHT_PANEL_CLASS =
  "fixed top-[13vh] left-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-solid border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl outline-none shadow-[0_24px_64px_-12px_rgba(0,0,0,0.2),0_4px_16px_-4px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_30px_80px_-14px_rgba(0,0,0,0.8)]";

export const SPOTLIGHT_KBD_CLASS =
  "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-solid border-border/85 bg-secondary/75 px-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:border-white/12 dark:bg-white/7 dark:shadow-[0_1px_0_rgba(0,0,0,0.35)]";
export type SpotlightSearchSize = "md" | "lg";

export interface SpotlightSearchItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  shortcut?: string;
  /** 可选条目前置图标 */
  icon?: ReactNode;
  /** 预览分栏底部的补充元信息 */
  meta?: string;
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
  /** 触发按钮右侧展示的快捷键键帽提示 */
  shortcutHint?: string;
  /** 是否注册全局快捷键打开（默认 false，避免多实例冲突） */
  enableGlobalShortcut?: boolean;
  /** 全局快捷键字母，默认 k */
  shortcutKey?: string;
  /** 搜索占位提示 */
  placeholder?: string;
  /** 弹窗宽度预设 */
  size?: SpotlightSearchSize;
  /** 是否显示底部键盘导航与结果计数栏 */
  showFooter?: boolean;
  /** 候选结果列表 */
  items: SpotlightSearchItem[];
  /** 最近搜索关键词胶囊 */
  recentQueries?: string[];
  /** 选中回调 */
  onSelect?: (item: SpotlightSearchItem) => void;
  /** 面板自定义类名 */
  className?: string;
}
const CategoryBar = ({
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

const RecentRow = ({
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

const SpotlightInputBar = ({
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

const SpotlightFooterBar = ({ count }: { count: number }) => (
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
const SPRING = { type: "spring" as const, stiffness: 390, damping: 32 };

const useGlobalSpotlightShortcut = (enabled: boolean, key: string, toggle: () => void) => {
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
};

interface SpotlightPopupContentProps {
  query: string;
  placeholder: string;
  size: SpotlightSearchSize;
  showFooter: boolean;
  categories: string[];
  category: string;
  recentQueries: string[];
  filtered: SpotlightSearchItem[];
  activeIndex: number;
  className?: string;
  onQueryChange: (next: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onCategoryChange: (cat: string) => void;
  onHover: (idx: number) => void;
  onChoose: (item: SpotlightSearchItem) => void;
}

const SpotlightPopupContent = (p: SpotlightPopupContentProps) => {
  const safeIndex = Math.min(p.activeIndex, Math.max(0, p.filtered.length - 1));
  return (
    <Dialog.Popup
      render={
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={SPRING}
          data-slot="spotlight-search"
          data-size={p.size}
          className={cn(SPOTLIGHT_PANEL_CLASS, SPOTLIGHT_SIZE_MAP[p.size], p.className)}
        />
      }
    >
      <Dialog.Title className="sr-only">聚焦搜索</Dialog.Title>
      <SpotlightInputBar
        query={p.query}
        placeholder={p.placeholder}
        onChange={p.onQueryChange}
        onKeyDown={p.onKeyDown}
      />
      <CategoryBar categories={p.categories} active={p.category} onSelect={p.onCategoryChange} />
      {!p.query && p.recentQueries.length > 0 && (
        <RecentRow recentQueries={p.recentQueries} onPick={p.onQueryChange} />
      )}
      <ResultSplitPane
        items={p.filtered}
        activeIndex={safeIndex}
        onHover={p.onHover}
        onChoose={p.onChoose}
      />
      {p.showFooter && <SpotlightFooterBar count={p.filtered.length} />}
    </Dialog.Popup>
  );
};

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

const handleInputNavigation = (
  event: KeyboardEvent<HTMLInputElement>,
  filtered: SpotlightSearchItem[],
  activeIndex: number,
  setActiveIndex: (next: number) => void,
  onChoose: (item: SpotlightSearchItem) => void,
) => {
  if (filtered.length === 0) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    setActiveIndex((activeIndex + 1) % filtered.length);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    setActiveIndex((activeIndex - 1 + filtered.length) % filtered.length);
  } else if (event.key === "Enter") {
    event.preventDefault();
    const target = filtered[Math.min(activeIndex, filtered.length - 1)];
    if (target) onChoose(target);
  }
};

const SpotlightTriggerButton = ({
  triggerLabel,
  shortcutHint,
}: {
  triggerLabel: string | null;
  shortcutHint?: string;
}) => {
  if (triggerLabel === null) return null;
  return (
    <Dialog.Trigger className={SPOTLIGHT_TRIGGER_CLASS}>
      <Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
      <span>{triggerLabel}</span>
      {shortcutHint && (
        <kbd aria-hidden="true" className={SPOTLIGHT_KBD_CLASS}>
          {shortcutHint}
        </kbd>
      )}
    </Dialog.Trigger>
  );
};

export const SpotlightSearch = (props: SpotlightSearchProps) => {
  const {
    triggerLabel = "聚焦搜索",
    shortcutHint,
    enableGlobalShortcut = false,
    shortcutKey = "k",
    placeholder = "搜索组件、文档或操作…",
    size = "md",
    showFooter = true,
    recentQueries = [],
  } = props;
  const s = useSpotlightState(props.items, props.open, props.defaultOpen, props.onOpenChange);
  useGlobalSpotlightShortcut(enableGlobalShortcut, shortcutKey, () => s.setOpen(!s.isOpen));
  const choose = (item: SpotlightSearchItem) => {
    props.onSelect?.(item);
    s.setOpen(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <Dialog.Root open={s.isOpen} onOpenChange={s.setOpen}>
        <SpotlightTriggerButton triggerLabel={triggerLabel} shortcutHint={shortcutHint} />
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[6px] dark:bg-black/65" />
          <SpotlightPopupContent
            query={s.query}
            placeholder={placeholder}
            size={size}
            showFooter={showFooter}
            categories={s.categories}
            category={s.category}
            recentQueries={recentQueries}
            filtered={s.filtered}
            activeIndex={s.activeIndex}
            className={props.className}
            onQueryChange={(next) => (s.setQuery(next), s.setActiveIndex(0))}
            onKeyDown={(e) =>
              handleInputNavigation(e, s.filtered, s.activeIndex, s.setActiveIndex, choose)
            }
            onCategoryChange={(cat) => (s.setCategory(cat), s.setActiveIndex(0))}
            onHover={s.setActiveIndex}
            onChoose={choose}
          />
        </Dialog.Portal>
      </Dialog.Root>
    </MotionConfig>
  );
};
