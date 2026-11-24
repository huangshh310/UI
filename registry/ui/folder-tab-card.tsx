// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * FolderTabCard：立体多层文件夹标签切换卡片。
 * 结合共享 layoutId 弹簧文件夹页签、顶部微指示条与底部等宽指标凹槽，支持键盘方向键导航与图标徽标。
 */

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";

export const FOLDER_TAB_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.75,
};

export const FOLDER_CONTENT_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.72,
};

export const FOLDER_SHELL_BASE =
  "w-full max-w-md overflow-hidden rounded-[24px] border border-solid p-1.5";

export const FOLDER_SHELL_VARIANTS: Record<FolderTabCardVariant, string> = {
  default: "border-border/85 bg-secondary/90 shadow-sm dark:bg-secondary/75",
  elevated:
    "border-border/80 bg-muted shadow-md dark:border-foreground/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_30px_-12px_rgba(0,0,0,0.48)]",
  tinted: "border-signal/22 bg-signal/[0.06] shadow-sm dark:border-signal/28 dark:bg-signal/[0.11]",
};

export const FOLDER_PANEL_VARIANTS: Record<FolderTabCardVariant, string> = {
  default: "border-border/80 bg-card shadow-xs",
  elevated: "border-border/75 bg-card shadow-sm dark:border-foreground/[0.08]",
  tinted: "border-signal/18 bg-card shadow-xs dark:border-signal/24",
};

export const FOLDER_INDICATOR_VARIANTS: Record<FolderTabCardVariant, string> = {
  default: "bg-foreground/75",
  elevated: "bg-foreground/85",
  tinted: "bg-signal dark:bg-info",
};

export const FOLDER_BADGE_ACTIVE: Record<FolderTabCardVariant, string> = {
  default: "bg-secondary text-foreground",
  elevated: "bg-secondary text-foreground",
  tinted: "bg-signal/12 text-info dark:bg-signal/24",
};

export const FOLDER_BADGE_INACTIVE = "bg-card/80 text-muted-foreground dark:bg-card/60";

export const FOLDER_TAB_BUTTON_BASE =
  "relative inline-flex cursor-pointer items-center gap-1.5 rounded-t-[14px] border-0 bg-transparent px-3.5 py-2 font-sans text-xs font-medium tracking-[-0.01em] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5 [&_svg]:shrink-0";
/** 文件夹卡片外框与材质变体 */
export type FolderTabCardVariant = "default" | "elevated" | "tinted";

export interface FolderTabItem {
  /** 标签唯一标识 */
  id: string;
  /** 标签标题 */
  label: string;
  /** 底部突出展示的等宽统计指标 */
  metric?: string;
  /** 统计指标辅助说明 */
  caption?: string;
  /** 可选标签前置图标 */
  icon?: ReactNode;
  /** 可选标签右侧徽标文本（如 NEW、46） */
  badge?: string;
  /** 标签对应的主体内容 */
  content: ReactNode;
}

export interface FolderTabCardProps {
  /** 文件夹标签页数组 */
  tabs: FolderTabItem[];
  /** 非受控初始激活项 id */
  defaultTabId?: string;
  /** 受控当前激活项 id */
  activeTabId?: string;
  /** 标签切换回调 */
  onTabChange?: (tabId: string) => void;
  /** 材质与层级风格：默认 / 抬升 / 钴蓝微染 */
  variant?: FolderTabCardVariant;
  /** 自定义类名 */
  className?: string;
}
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
