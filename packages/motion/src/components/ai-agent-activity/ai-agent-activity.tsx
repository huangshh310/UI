"use client";

/**
 * AiAgentActivity：极简克制的 AI 智能体工具调用轨迹与推理时间线，支持卡片/无框/毛玻璃变体、整板折叠与单步明细抽屉。
 */
import { cn } from "@matt-ui/utils";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { createContext, useContext, useState } from "react";
import {
  ActivityDetailsDrawer,
  ActivityHeaderControls,
  ActivityHeaderProgressLine,
  ActivityHeaderStatus,
  ActivityHeaderTitle,
  ActivityStatusGlyph,
} from "./ai-agent-activity-parts.js";
import type {
  AiAgentActivityHeaderProps,
  AiAgentActivityItemData,
  AiAgentActivityItemProps,
  AiAgentActivityProps,
  AiAgentActivityTimelineProps,
  AiAgentActivityVariant,
} from "./ai-agent-activity.types.js";
import {
  ACTIVITY_FOCUS_RING,
  ACTIVITY_SHELL_VARIANT,
  ACTIVITY_SPRING,
  ACTIVITY_STATUS_CIRCLE,
  ACTIVITY_TYPE_LABELS,
} from "./ai-agent-activity.variants.js";

interface ActivityContextValue {
  activities: AiAgentActivityItemData[];
  isRunning: boolean;
  variant: AiAgentActivityVariant;
  compact: boolean;
  showTypeBadge: boolean;
  collapsible: boolean;
  collapsed: boolean;
  toggleCollapsed: () => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

const ActivityCtx = createContext<ActivityContextValue | null>(null);

export const useAiAgentActivity = () => {
  const ctx = useContext(ActivityCtx);
  if (!ctx) throw new Error("AiAgentActivity 子部件必须置于 <AiAgentActivity> 内部使用");
  return ctx;
};

const calcCompletionPct = (activities: AiAgentActivityItemData[]) => {
  if (activities.length === 0) return 0;
  const done = activities.filter((a) => a.status === "success").length;
  return Math.round((done / activities.length) * 100);
};

export const AiAgentActivityHeader = (props: AiAgentActivityHeaderProps) => {
  const ctx = useAiAgentActivity();
  const completedCount = ctx.activities.filter((a) => a.status === "success").length;
  const pct = calcCompletionPct(ctx.activities);
  const showDivider = ctx.variant !== "ghost" && !ctx.collapsed;
  const showCtrl = (props.showControls ?? true) && !ctx.collapsed;

  return (
    <div
      className={cn(
        "relative flex flex-wrap items-center justify-between gap-2.5 select-none",
        showDivider && "border-b border-solid border-border/75 dark:border-white/10",
        ctx.compact ? "px-3.5 py-2.5" : "px-5 py-3.5",
        props.className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <ActivityHeaderTitle
          title={props.title ?? "执行轨迹"}
          collapsible={ctx.collapsible}
          collapsed={ctx.collapsed}
          onToggle={ctx.toggleCollapsed}
        />
        {props.agentName && (
          <span className="truncate rounded-md border border-solid border-border/70 bg-secondary/65 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground dark:border-white/10 dark:bg-white/7">
            {props.agentName}
          </span>
        )}
        <ActivityHeaderStatus
          isRunning={ctx.isRunning}
          completedCount={completedCount}
          total={ctx.activities.length}
        />
      </div>
      {showCtrl && (
        <ActivityHeaderControls onExpandAll={ctx.expandAll} onCollapseAll={ctx.collapseAll} />
      )}
      <ActivityHeaderProgressLine visible={showDivider} pct={pct} />
    </div>
  );
};

const ItemTitleRow = ({
  activity,
  hasDetails,
  expanded,
  showTypeBadge,
  reduced,
}: {
  activity: AiAgentActivityItemData;
  hasDetails: boolean;
  expanded: boolean;
  showTypeBadge: boolean;
  reduced: boolean | null;
}) => (
  <>
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-1.5">
        <span
          className={cn(
            "truncate text-[13px] tracking-tight",
            activity.status === "running" ? "font-medium text-foreground" : "text-foreground/90",
          )}
        >
          {activity.title}
        </span>
        {showTypeBadge && (
          <span className="shrink-0 rounded bg-secondary/85 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground dark:bg-white/8">
            {ACTIVITY_TYPE_LABELS[activity.type]}
          </span>
        )}
      </div>
      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
        {activity.duration && <span>{activity.duration}</span>}
        {hasDetails && (
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : ACTIVITY_SPRING}
            className="inline-flex text-muted-foreground"
          >
            <ChevronDown aria-hidden="true" className="size-3.5" />
          </motion.span>
        )}
      </span>
    </div>
    {activity.description && (
      <p className="m-0 mt-1 text-xs leading-relaxed text-muted-foreground">
        {activity.description}
      </p>
    )}
  </>
);

const ItemContentShell = ({
  activity,
  hasDetails,
  expanded,
  showTypeBadge,
  reduced,
  onToggle,
}: {
  activity: AiAgentActivityItemData;
  hasDetails: boolean;
  expanded: boolean;
  showTypeBadge: boolean;
  reduced: boolean | null;
  onToggle: () => void;
}) => {
  const row = (
    <ItemTitleRow
      activity={activity}
      hasDetails={hasDetails}
      expanded={expanded}
      showTypeBadge={showTypeBadge}
      reduced={reduced}
    />
  );
  if (!hasDetails) return <div>{row}</div>;
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onToggle}
      className={cn(
        "flex w-full cursor-pointer flex-col rounded-lg border border-solid border-transparent bg-transparent p-0 text-left font-sans",
        ACTIVITY_FOCUS_RING,
      )}
    >
      {row}
    </button>
  );
};

export const AiAgentActivityItem = ({
  activity,
  isLast = false,
  className,
}: AiAgentActivityItemProps) => {
  const { expandedIds, toggleExpand, compact, showTypeBadge } = useAiAgentActivity();
  const expanded = expandedIds.has(activity.id);
  const hasDetails = Boolean(activity.details || activity.metadata);
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative flex items-start gap-3", className)}>
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute top-6 bottom-[-14px] left-[9.5px] w-px bg-border/75 dark:bg-white/10"
        />
      )}
      <span
        className={cn(
          "relative z-10 mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
          ACTIVITY_STATUS_CIRCLE[activity.status],
        )}
      >
        <ActivityStatusGlyph status={activity.status} />
      </span>
      <div className={cn("min-w-0 flex-1 last:pb-0", compact ? "pb-3" : "pb-4")}>
        <ItemContentShell
          activity={activity}
          hasDetails={hasDetails}
          expanded={expanded}
          showTypeBadge={showTypeBadge}
          reduced={reduced}
          onToggle={() => toggleExpand(activity.id)}
        />
        <ActivityDetailsDrawer
          open={expanded}
          details={activity.details}
          metadata={activity.metadata}
          reduced={reduced}
        />
      </div>
    </div>
  );
};

export const AiAgentActivityTimeline = ({ className }: AiAgentActivityTimelineProps) => {
  const { activities, compact, collapsed } = useAiAgentActivity();
  if (collapsed) return null;
  if (activities.length === 0) {
    return <p className="m-0 py-10 text-center text-xs text-muted-foreground">暂无执行轨迹</p>;
  }
  return (
    <div className={cn("flex flex-col gap-1", compact ? "px-3.5 py-3" : "px-5 py-4", className)}>
      {activities.map((item, idx) => (
        <AiAgentActivityItem key={item.id} activity={item} isLast={idx === activities.length - 1} />
      ))}
    </div>
  );
};

const useActivityController = (props: AiAgentActivityProps) => {
  const activities = props.activities ?? [];
  const collapsible = props.collapsible ?? false;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(props.defaultExpandedIds ?? []),
  );
  const [collapsed, setCollapsed] = useState(
    collapsible ? (props.defaultCollapsed ?? false) : false,
  );

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return {
    activities,
    isRunning: props.isRunning ?? false,
    variant: props.variant ?? "card",
    compact: props.compact ?? false,
    showTypeBadge: props.showTypeBadge ?? false,
    collapsible,
    collapsed,
    toggleCollapsed: () => setCollapsed((c) => !c),
    expandedIds,
    toggleExpand,
    expandAll: () => setExpandedIds(new Set(activities.map((a) => a.id))),
    collapseAll: () => setExpandedIds(new Set()),
  };
};

export const AiAgentActivity = (props: AiAgentActivityProps) => {
  const value = useActivityController(props);

  return (
    <ActivityCtx.Provider value={value}>
      <div
        data-slot="ai-agent-activity"
        data-variant={value.variant}
        className={cn(
          "w-full max-w-xl overflow-hidden font-sans text-card-foreground",
          ACTIVITY_SHELL_VARIANT[value.variant],
          props.className,
        )}
      >
        {props.children ?? (
          <>
            <AiAgentActivityHeader title={props.title} agentName={props.agentName} />
            <AiAgentActivityTimeline />
          </>
        )}
      </div>
    </ActivityCtx.Provider>
  );
};
