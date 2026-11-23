"use client";

/**
 * AiAgentActivity 内部状态图标、明细抽屉与页头控制子部件。
 */
import { cn } from "@matt-ui/utils";
import { AlertCircle, Check, ChevronDown, Pause, RotateCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { AiAgentActivityDetails, AiAgentActivityStatus } from "./ai-agent-activity.types.js";
import { ACTIVITY_FOCUS_RING, ACTIVITY_SPRING } from "./ai-agent-activity.variants.js";

export const ActivityHeaderTitle = ({
  title,
  collapsible,
  collapsed,
  onToggle,
}: {
  title: string;
  collapsible: boolean;
  collapsed: boolean;
  onToggle: () => void;
}) => {
  if (!collapsible) {
    return (
      <span className="truncate text-sm font-medium tracking-tight text-foreground">{title}</span>
    );
  }
  return (
    <button
      type="button"
      aria-expanded={!collapsed}
      onClick={onToggle}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-solid border-transparent bg-transparent p-0 font-sans text-sm font-medium tracking-tight text-foreground",
        ACTIVITY_FOCUS_RING,
      )}
    >
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast)",
          collapsed && "-rotate-90",
        )}
      />
      <span className="truncate">{title}</span>
    </button>
  );
};

export const ActivityHeaderProgressLine = ({ visible, pct }: { visible: boolean; pct: number }) => {
  if (!visible || pct <= 0) return null;
  return (
    <span
      aria-hidden="true"
      style={{ width: `${pct}%` }}
      className="pointer-events-none absolute bottom-0 left-0 h-px bg-signal/65 transition-[width] duration-(--ui-duration-normal)"
    />
  );
};

export const ActivityHeaderStatus = ({
  isRunning,
  completedCount,
  total,
}: {
  isRunning: boolean;
  completedCount: number;
  total: number;
}) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
    {isRunning ? (
      <>
        <span
          aria-hidden="true"
          className="size-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none"
        />
        <span className="font-medium text-foreground">运行中</span>
      </>
    ) : (
      <span className="font-mono text-[11px] tabular-nums">
        已完成 {completedCount} / {total}
      </span>
    )}
  </span>
);

export const ActivityStatusGlyph = ({ status }: { status: AiAgentActivityStatus }) => {
  if (status === "running") {
    return (
      <RotateCw
        aria-hidden="true"
        className="size-3 animate-spin text-foreground motion-reduce:animate-none"
      />
    );
  }
  if (status === "error") {
    return <AlertCircle aria-hidden="true" className="size-3.5 text-destructive" />;
  }
  if (status === "cancelled") {
    return <Pause aria-hidden="true" className="size-3 text-muted-foreground" />;
  }
  if (status === "success") {
    return (
      <Check
        aria-hidden="true"
        className="size-3 stroke-[2.5] text-emerald-600 dark:text-emerald-400"
      />
    );
  }
  return <span aria-hidden="true" className="size-1.5 rounded-full bg-border dark:bg-white/25" />;
};

export const ActivityHeaderControls = ({
  onExpandAll,
  onCollapseAll,
}: {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) => (
  <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
    <button
      type="button"
      onClick={onExpandAll}
      className={cn(
        "cursor-pointer rounded-md border border-solid border-transparent bg-transparent px-1.5 py-0.5 font-sans text-xs text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground",
        ACTIVITY_FOCUS_RING,
      )}
    >
      全部展开
    </button>
    <span aria-hidden="true" className="text-border">
      /
    </span>
    <button
      type="button"
      onClick={onCollapseAll}
      className={cn(
        "cursor-pointer rounded-md border border-solid border-transparent bg-transparent px-1.5 py-0.5 font-sans text-xs text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground",
        ACTIVITY_FOCUS_RING,
      )}
    >
      全部收起
    </button>
  </div>
);

const formatPayload = (value: string | Record<string, unknown>) =>
  typeof value === "string" ? value : JSON.stringify(value, null, 2);

const PayloadBlock = ({
  label,
  body,
  mono = false,
}: {
  label: string;
  body: string;
  mono?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
    <pre
      className={cn(
        "m-0 overflow-x-auto rounded-xl border border-solid border-border/70 bg-secondary/55 p-2.5 text-xs leading-relaxed text-foreground select-text dark:border-white/8 dark:bg-white/5",
        mono ? "font-mono" : "font-sans whitespace-pre-wrap",
      )}
    >
      <code>{body}</code>
    </pre>
  </div>
);

const MetadataChips = ({ metadata }: { metadata?: Record<string, string | number | boolean> }) => {
  const entries = metadata ? Object.entries(metadata) : [];
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 pt-0.5">
      {entries.map(([k, v]) => (
        <span
          key={k}
          className="inline-flex items-center gap-1 rounded-md border border-solid border-border/70 bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground dark:border-white/10 dark:bg-white/6"
        >
          <span>{k}:</span>
          <span className="font-medium text-foreground">{String(v)}</span>
        </span>
      ))}
    </div>
  );
};

const DrawerBody = ({
  details,
  metadata,
}: {
  details?: AiAgentActivityDetails;
  metadata?: Record<string, string | number | boolean>;
}) => (
  <div className="flex flex-col gap-2.5 pt-1">
    {details?.input && <PayloadBlock label="调用参数" body={formatPayload(details.input)} mono />}
    {details?.codeSnippet && (
      <PayloadBlock label={details.language || "代码片段"} body={details.codeSnippet} mono />
    )}
    {details?.output && <PayloadBlock label="返回结果" body={formatPayload(details.output)} />}
    <MetadataChips metadata={metadata} />
  </div>
);

export const ActivityDetailsDrawer = ({
  open,
  details,
  metadata,
  reduced,
}: {
  open: boolean;
  details?: AiAgentActivityDetails;
  metadata?: Record<string, string | number | boolean>;
  reduced: boolean | null;
}) => (
  <AnimatePresence initial={false}>
    {open && (details || metadata) && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={reduced ? { duration: 0 } : ACTIVITY_SPRING}
        className="mt-2.5 overflow-hidden border-l border-solid border-border/80 pl-3 dark:border-white/12"
      >
        <DrawerBody details={details} metadata={metadata} />
      </motion.div>
    )}
  </AnimatePresence>
);
