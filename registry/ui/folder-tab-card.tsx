// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type ReactNode, useId, useState } from "react";

export interface FolderTabItem {
  id: string;
  label: string;
  metric: string;
  caption?: string;
  content: ReactNode;
}

export interface FolderTabCardProps {
  /** 文件夹标签页数组 */
  tabs: FolderTabItem[];
  /** 初始激活项 id */
  defaultTabId?: string;
  /** 自定义类名 */
  className?: string;
}
const TabBar = ({
  tabs,
  activeId,
  uid,
  onSelect,
}: {
  tabs: FolderTabItem[];
  activeId: string;
  uid: string;
  onSelect: (id: string) => void;
}) => (
  <div role="tablist" aria-label="文件夹标签" className="flex items-end gap-1 px-1.5 pt-0.5">
    {tabs.map((tab) => {
      const selected = tab.id === activeId;
      return (
        <button
          key={tab.id}
          role="tab"
          type="button"
          aria-selected={selected}
          onClick={() => onSelect(tab.id)}
          className={cn(
            "relative cursor-pointer rounded-t-xl border-0 bg-transparent px-3.5 py-2 font-sans text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {selected && (
            <motion.span
              layoutId={`folder-tab-${uid}`}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="absolute inset-0 rounded-t-xl border border-b-0 border-solid border-border bg-card shadow-xs"
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      );
    })}
  </div>
);

const TabBody = ({ active }: { active: FolderTabItem }) => (
  <AnimatePresence mode="wait" initial={false}>
    <motion.div
      key={active.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative z-10 flex flex-col gap-4"
    >
      <div className="text-[13px] leading-relaxed text-foreground">{active.content}</div>
      <div className="flex items-end justify-between border-t border-solid border-border/75 pt-3.5">
        <div>
          <p className="m-0 font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {active.metric}
          </p>
          {active.caption && (
            <p className="m-0 mt-0.5 text-xs text-muted-foreground">{active.caption}</p>
          )}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-solid border-blue-600/20 bg-blue-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-blue-800 dark:border-blue-400/25 dark:bg-blue-400/15 dark:text-blue-200">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
          {active.label}
        </span>
      </div>
    </motion.div>
  </AnimatePresence>
);

export const FolderTabCard = ({ tabs, defaultTabId, className }: FolderTabCardProps) => {
  const uid = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id ?? "");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  if (!active) return null;

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-slot="folder-tab-card"
        className={cn(
          "w-full max-w-md overflow-hidden rounded-[22px] border border-solid border-border/90 bg-gradient-to-b from-secondary/75 to-secondary/45 p-2 shadow-md",
          className,
        )}
      >
        <TabBar tabs={tabs} activeId={active.id} uid={uid} onSelect={setActiveId} />
        <div
          role="tabpanel"
          className="relative overflow-hidden rounded-2xl border border-solid border-border/85 bg-card p-5 shadow-sm"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-signal/10 blur-2xl"
          />
          <TabBody active={active} />
        </div>
      </div>
    </MotionConfig>
  );
};
