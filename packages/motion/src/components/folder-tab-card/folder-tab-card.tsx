"use client";

import { cn } from "@matt-ui/utils";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useId, useState } from "react";
import type { FolderTabCardProps, FolderTabItem } from "./folder-tab-card.types.js";

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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-foreground/60" />
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
          "w-full max-w-md overflow-hidden rounded-[24px] border border-solid border-border/80 bg-secondary p-1.5 shadow-sm",
          className,
        )}
      >
        <TabBar tabs={tabs} activeId={active.id} uid={uid} onSelect={setActiveId} />
        <div
          role="tabpanel"
          className="relative overflow-hidden rounded-[18px] border border-solid border-border/75 bg-card p-5 shadow-xs"
        >
          <TabBody active={active} />
        </div>
      </div>
    </MotionConfig>
  );
};
