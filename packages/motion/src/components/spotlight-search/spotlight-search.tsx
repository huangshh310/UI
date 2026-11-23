"use client";

/**
 * SpotlightSearch：基于 Base UI Dialog 与 motion 的磨砂聚焦搜索与分栏预览弹层。
 */
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@matt-ui/utils";
import { Search } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { type KeyboardEvent, useEffect, useMemo, useState } from "react";
import {
  CategoryBar,
  RecentRow,
  ResultSplitPane,
  SpotlightFooterBar,
  SpotlightInputBar,
} from "./spotlight-search-parts.js";
import type {
  SpotlightSearchItem,
  SpotlightSearchProps,
  SpotlightSearchSize,
} from "./spotlight-search.types.js";
import {
  SPOTLIGHT_KBD_CLASS,
  SPOTLIGHT_PANEL_CLASS,
  SPOTLIGHT_SIZE_MAP,
  SPOTLIGHT_TRIGGER_CLASS,
} from "./spotlight-search.variants.js";

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
