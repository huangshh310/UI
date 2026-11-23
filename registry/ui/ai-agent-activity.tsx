// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiAgentActivity：Cursor / Linear 风格的 AI 智能体工具调用轨迹与推理时间线，支持卡片/无框/毛玻璃变体、整板平滑折叠与单步明细抽屉。
 */

import { cn } from "@/lib/utils";
import { AlertCircle, Check, ChevronDown, Loader2, Pause } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, useContext, useState } from "react";

export const ACTIVITY_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const ACTIVITY_COLLAPSE_TRANSITION = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const ACTIVITY_SHELL_VARIANT: Record<AiAgentActivityVariant, string> = {
  card: "rounded-xl border border-solid border-border bg-card shadow-xs dark:border-white/10",
  ghost: "border-0 bg-transparent",
  glass:
    "rounded-xl border border-solid border-border bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/85",
};

export const ACTIVITY_STATUS_CIRCLE: Record<AiAgentActivityStatus, string> = {
  running:
    "border border-solid border-signal/35 bg-signal/10 text-signal dark:border-signal/40 dark:bg-signal/15",
  success:
    "border border-solid border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-400",
  error:
    "border border-solid border-destructive/35 bg-destructive/10 text-destructive dark:border-destructive/45 dark:bg-destructive/15",
  cancelled:
    "border border-solid border-border bg-muted/60 text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]",
  pending: "border border-solid border-border bg-card text-muted-foreground dark:border-white/12",
};

export const ACTIVITY_TYPE_LABELS: Record<AiAgentActivityType, string> = {
  thinking: "思考",
  searching: "检索",
  reading: "读取",
  writing: "写入",
  tool_execution: "工具",
  api_request: "请求",
  database_query: "查询",
  code_execution: "代码",
  completed: "完成",
  failed: "失败",
  cancelled: "取消",
};
export type AiAgentActivityType =
  | "thinking"
  | "searching"
  | "reading"
  | "writing"
  | "tool_execution"
  | "api_request"
  | "database_query"
  | "code_execution"
  | "completed"
  | "failed"
  | "cancelled";

export type AiAgentActivityStatus = "pending" | "running" | "success" | "error" | "cancelled";

export type AiAgentActivityVariant = "card" | "ghost" | "glass";

export interface AiAgentActivityDetails {
  input?: string | Record<string, unknown>;
  output?: string | Record<string, unknown>;
  codeSnippet?: string;
  language?: string;
}

export interface AiAgentActivityItemData {
  id: string;
  type: AiAgentActivityType;
  title: string;
  description?: string;
  status: AiAgentActivityStatus;
  duration?: string;
  timestamp?: string;
  metadata?: Record<string, string | number | boolean>;
  details?: AiAgentActivityDetails;
}

export interface AiAgentActivityProps {
  /** 智能体执行步骤列表 */
  activities: AiAgentActivityItemData[];
  /** 是否正处于运行中（页头展示脉动状态） */
  isRunning?: boolean;
  /** 外观变体：card 发丝卡片、ghost 无框内联轨迹、glass 毛玻璃面板，默认 card */
  variant?: AiAgentActivityVariant;
  /** 紧凑排版密度，默认 false */
  compact?: boolean;
  /** 是否在步骤标题旁显示动作类型等宽微徽章，默认 false */
  showTypeBadge?: boolean;
  /** 是否允许折叠整条时间线为单行摘要，默认 false */
  collapsible?: boolean;
  /** collapsible=true 时的初始折叠状态，默认 false */
  defaultCollapsed?: boolean;
  /** 面板标题，默认「执行轨迹」 */
  title?: string;
  /** 可选智能体名称标识 */
  agentName?: string;
  /** 默认展开明细的步骤 ID 列表 */
  defaultExpandedIds?: string[];
  className?: string;
  children?: ReactNode;
}

export interface AiAgentActivityHeaderProps {
  title?: string;
  agentName?: string;
  showControls?: boolean;
  className?: string;
}

export interface AiAgentActivityTimelineProps {
  className?: string;
}

export interface AiAgentActivityItemProps {
  activity: AiAgentActivityItemData;
  isLast?: boolean;
  className?: string;
}
const ActivityHeaderTitle = ({
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
      <span className="truncate text-[13px] font-medium tracking-tight text-foreground">
        {title}
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-expanded={!collapsed}
      onClick={onToggle}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-solid border-transparent bg-transparent px-1 py-0.5 font-sans text-[13px] font-medium tracking-tight text-foreground transition-colors hover:bg-muted/60 dark:hover:bg-white/[0.05]",
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

const ActivityHeaderProgressLine = ({ visible, pct }: { visible: boolean; pct: number }) => {
  if (!visible || pct <= 0) return null;
  return (
    <span
      aria-hidden="true"
      style={{ width: `${pct}%` }}
      className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-signal/60 transition-[width] duration-(--ui-duration-normal)"
    />
  );
};

const ActivityHeaderStatus = ({
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
        <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
        <span className="font-medium text-foreground">运行中</span>
      </>
    ) : (
      <span className="font-mono text-[11px] tabular-nums">
        已完成 {completedCount} / {total}
      </span>
    )}
  </span>
);

const ActivityStatusGlyph = ({ status }: { status: AiAgentActivityStatus }) => {
  if (status === "running") {
    return (
      <Loader2
        aria-hidden="true"
        className="size-3 animate-spin text-signal motion-reduce:animate-none"
      />
    );
  }
  if (status === "error") {
    return <AlertCircle aria-hidden="true" className="size-3 text-destructive" />;
  }
  if (status === "cancelled") {
    return <Pause aria-hidden="true" className="size-2.5 text-muted-foreground" />;
  }
  if (status === "success") {
    return <Check aria-hidden="true" className="size-3 stroke-[2.25]" />;
  }
  return <span aria-hidden="true" className="size-1.5 rounded-full bg-border dark:bg-white/25" />;
};

const ActivityHeaderControls = ({
  onExpandAll,
  onCollapseAll,
}: {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) => (
  <div className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
    <button
      type="button"
      onClick={onExpandAll}
      className={cn(
        "cursor-pointer rounded-md border border-solid border-transparent bg-transparent px-1.5 py-0.5 font-sans text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground dark:hover:bg-white/[0.06]",
        ACTIVITY_FOCUS_RING,
      )}
    >
      全部展开
    </button>
    <span aria-hidden="true" className="text-border dark:text-white/15">
      /
    </span>
    <button
      type="button"
      onClick={onCollapseAll}
      className={cn(
        "cursor-pointer rounded-md border border-solid border-transparent bg-transparent px-1.5 py-0.5 font-sans text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground dark:hover:bg-white/[0.06]",
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
        "m-0 overflow-x-auto rounded-lg bg-muted/55 px-3 py-2 text-xs leading-relaxed text-foreground select-text dark:bg-white/[0.04]",
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
          className="inline-flex items-center gap-1 rounded-md bg-muted/65 px-2 py-0.5 font-mono text-[11px] text-muted-foreground dark:bg-white/[0.06]"
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

const ActivityDetailsDrawer = ({
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
        initial={reduced ? false : { opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
        transition={reduced ? { duration: 0 } : ACTIVITY_COLLAPSE_TRANSITION}
        className="mt-2 overflow-hidden"
      >
        <DrawerBody details={details} metadata={metadata} />
      </motion.div>
    )}
  </AnimatePresence>
);

const ActivityItemTitleRow = ({
  activity,
  hasDetails,
  expanded,
  showTypeBadge,
}: {
  activity: AiAgentActivityItemData;
  hasDetails: boolean;
  expanded: boolean;
  showTypeBadge: boolean;
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
          <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground dark:bg-white/[0.07]">
            {ACTIVITY_TYPE_LABELS[activity.type]}
          </span>
        )}
      </div>
      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
        {activity.duration && <span>{activity.duration}</span>}
        {hasDetails && (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast)",
              expanded && "rotate-180",
            )}
          />
        )}
      </span>
    </div>
    {activity.description && (
      <p className="m-0 mt-0.5 text-xs leading-relaxed text-muted-foreground">
        {activity.description}
      </p>
    )}
  </>
);
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
        "relative flex flex-wrap items-center justify-between gap-2 select-none",
        showDivider && "border-b border-solid border-border/75 dark:border-white/10",
        ctx.variant === "ghost" ? "px-1 py-1.5" : ctx.compact ? "px-3.5 py-2.5" : "px-4 py-3",
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
          <span className="truncate font-mono text-[11px] text-muted-foreground">
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

const ItemContentShell = ({
  activity,
  hasDetails,
  expanded,
  showTypeBadge,
  onToggle,
}: {
  activity: AiAgentActivityItemData;
  hasDetails: boolean;
  expanded: boolean;
  showTypeBadge: boolean;
  onToggle: () => void;
}) => {
  const row = (
    <ActivityItemTitleRow
      activity={activity}
      hasDetails={hasDetails}
      expanded={expanded}
      showTypeBadge={showTypeBadge}
    />
  );
  if (!hasDetails) return <div>{row}</div>;
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onToggle}
      className={cn(
        "flex w-full cursor-pointer flex-col rounded-md border border-solid border-transparent bg-transparent p-0 text-left font-sans transition-colors hover:text-foreground",
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
    <div className={cn("flex gap-3", className)}>
      <div className="flex w-5 shrink-0 flex-col items-center">
        <span
          className={cn(
            "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
            ACTIVITY_STATUS_CIRCLE[activity.status],
          )}
        >
          <ActivityStatusGlyph status={activity.status} />
        </span>
        {!isLast && (
          <span aria-hidden="true" className="my-1 w-px flex-1 bg-border/80 dark:bg-white/10" />
        )}
      </div>
      <div className={cn("min-w-0 flex-1", !isLast && (compact ? "pb-3" : "pb-4"))}>
        <ItemContentShell
          activity={activity}
          hasDetails={hasDetails}
          expanded={expanded}
          showTypeBadge={showTypeBadge}
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
  const { activities, variant, compact, collapsed } = useAiAgentActivity();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {!collapsed && (
        <motion.div
          key="activity-timeline"
          initial={reduced ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={reduced ? { duration: 0 } : ACTIVITY_COLLAPSE_TRANSITION}
          className="overflow-hidden"
        >
          {activities.length === 0 ? (
            <p className="m-0 py-10 text-center text-xs text-muted-foreground">暂无执行轨迹</p>
          ) : (
            <div
              className={cn(
                "flex flex-col",
                variant === "ghost" ? "px-1 pt-2 pb-1" : compact ? "px-3.5 py-3" : "px-4 py-3.5",
                className,
              )}
            >
              {activities.map((item, idx) => (
                <AiAgentActivityItem
                  key={item.id}
                  activity={item}
                  isLast={idx === activities.length - 1}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
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
          "w-full overflow-hidden font-sans text-card-foreground",
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
