"use client";

/**
 * FolderTabCard：立体多层文件夹标签切换卡片。
 * 结合共享 layoutId 弹簧文件夹页签、顶部微指示条与底部等宽指标凹槽，支持键盘方向键导航与图标徽标。
 */
import { cn } from "@matt-ui/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type {
  FolderTabCardProps,
  FolderTabCardVariant,
  FolderTabItem,
} from "./folder-tab-card.types.js";
import {
  FOLDER_BADGE_ACTIVE,
  FOLDER_BADGE_INACTIVE,
  FOLDER_CONTENT_SPRING,
  FOLDER_INDICATOR_VARIANTS,
  FOLDER_PANEL_VARIANTS,
  FOLDER_SHELL_BASE,
  FOLDER_SHELL_VARIANTS,
  FOLDER_TAB_BUTTON_BASE,
  FOLDER_TAB_SPRING,
} from "./folder-tab-card.variants.js";

const ActiveTabSurface = ({
  uid,
  variant,
  reduced,
}: {
  uid: string;
  variant: FolderTabCardVariant;
  reduced: boolean;
}) => (
  <motion.span
    layoutId={`folder-tab-${uid}`}
    transition={reduced ? { duration: 0 } : FOLDER_TAB_SPRING}
    className="absolute inset-0 rounded-t-[14px] border border-b-0 border-solid border-border/85 bg-card shadow-[0_-1px_4px_rgba(0,0,0,0.03)]"
  >
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-x-3.5 top-0 h-[2px] rounded-full",
        FOLDER_INDICATOR_VARIANTS[variant],
      )}
    />
  </motion.span>
);

interface FolderTabButtonProps {
  tab: FolderTabItem;
  selected: boolean;
  uid: string;
  variant: FolderTabCardVariant;
  reduced: boolean;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  setButtonRef: (el: HTMLButtonElement | null) => void;
}

const FolderTabButton = ({
  tab,
  selected,
  uid,
  variant,
  reduced,
  onSelect,
  onKeyDown,
  setButtonRef,
}: FolderTabButtonProps) => (
  <button
    ref={setButtonRef}
    id={`folder-tab-${uid}-${tab.id}`}
    role="tab"
    type="button"
    aria-selected={selected}
    aria-controls={`folder-panel-${uid}`}
    tabIndex={selected ? 0 : -1}
    onClick={onSelect}
    onKeyDown={onKeyDown}
    className={cn(
      FOLDER_TAB_BUTTON_BASE,
      selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    )}
  >
    {selected && <ActiveTabSurface uid={uid} variant={variant} reduced={reduced} />}
    <span className="relative z-10 inline-flex items-center gap-1.5">
      {tab.icon && (
        <span aria-hidden="true" className="inline-flex items-center">
          {tab.icon}
        </span>
      )}
      <span>{tab.label}</span>
      {tab.badge && (
        <span
          className={cn(
            "rounded-full px-1.5 py-px font-mono text-[10px] leading-tight font-medium",
            selected ? FOLDER_BADGE_ACTIVE[variant] : FOLDER_BADGE_INACTIVE,
          )}
        >
          {tab.badge}
        </span>
      )}
    </span>
  </button>
);

const resolveNextIndex = (key: string, current: number, total: number): number | null => {
  if (key === "ArrowRight") return (current + 1) % total;
  if (key === "ArrowLeft") return (current + total - 1) % total;
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  return null;
};

interface TabBarProps {
  tabs: FolderTabItem[];
  activeId: string;
  uid: string;
  variant: FolderTabCardVariant;
  reduced: boolean;
  onSelect: (id: string) => void;
}

const TabBar = ({ tabs, activeId, uid, variant, reduced, onSelect }: TabBarProps) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const current = tabs.findIndex((t) => t.id === activeId);
    const nextIdx = resolveNextIndex(event.key, current, tabs.length);
    if (nextIdx === null) return;
    const target = tabs[nextIdx];
    if (!target) return;
    event.preventDefault();
    onSelect(target.id);
    refs.current[nextIdx]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="文件夹标签"
      className="flex items-end gap-1 overflow-x-auto px-1.5 pt-0.5"
    >
      {tabs.map((tab, idx) => (
        <FolderTabButton
          key={tab.id}
          tab={tab}
          selected={tab.id === activeId}
          uid={uid}
          variant={variant}
          reduced={reduced}
          onSelect={() => onSelect(tab.id)}
          onKeyDown={handleKeyDown}
          setButtonRef={(el) => {
            refs.current[idx] = el;
          }}
        />
      ))}
    </div>
  );
};

const TabMetricFooter = ({
  active,
  variant,
}: {
  active: FolderTabItem;
  variant: FolderTabCardVariant;
}) => (
  <div className="flex items-end justify-between gap-3 border-t border-solid border-border/75 pt-3.5">
    <div>
      {active.metric && (
        <p className="m-0 font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {active.metric}
        </p>
      )}
      {active.caption && (
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">{active.caption}</p>
      )}
    </div>
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", FOLDER_INDICATOR_VARIANTS[variant])}
      />
      {active.label}
    </span>
  </div>
);

const TabBody = ({
  active,
  variant,
  reduced,
}: {
  active: FolderTabItem;
  variant: FolderTabCardVariant;
  reduced: boolean;
}) => (
  <AnimatePresence mode="wait" initial={false}>
    <motion.div
      key={active.id}
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -4 }}
      transition={reduced ? { duration: 0 } : FOLDER_CONTENT_SPRING}
      className="relative z-10 flex flex-col gap-4"
    >
      <div className="text-[13px] leading-relaxed text-foreground">{active.content}</div>
      {(active.metric || active.caption) && <TabMetricFooter active={active} variant={variant} />}
    </motion.div>
  </AnimatePresence>
);

export const FolderTabCard = ({
  tabs,
  defaultTabId,
  activeTabId,
  onTabChange,
  variant = "default",
  className,
}: FolderTabCardProps) => {
  const uid = useId();
  const reduced = Boolean(useReducedMotion());
  const [internalId, setInternalId] = useState(defaultTabId ?? tabs[0]?.id ?? "");
  const currentId = activeTabId ?? internalId;
  const active = tabs.find((t) => t.id === currentId) ?? tabs[0];
  if (!active) return null;

  const handleSelect = (id: string) => {
    if (activeTabId === undefined) setInternalId(id);
    onTabChange?.(id);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-slot="folder-tab-card"
        data-variant={variant}
        className={cn(FOLDER_SHELL_BASE, FOLDER_SHELL_VARIANTS[variant], className)}
      >
        <TabBar
          tabs={tabs}
          activeId={active.id}
          uid={uid}
          variant={variant}
          reduced={reduced}
          onSelect={handleSelect}
        />
        <div
          id={`folder-panel-${uid}`}
          role="tabpanel"
          aria-labelledby={`folder-tab-${uid}-${active.id}`}
          className={cn(
            "relative overflow-hidden rounded-[18px] border border-solid p-5",
            FOLDER_PANEL_VARIANTS[variant],
          )}
        >
          <TabBody active={active} variant={variant} reduced={reduced} />
        </div>
      </div>
    </MotionConfig>
  );
};
