// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AiAgentActivity：极简克制的 AI 智能体工具调用轨迹与推理时间线，支持复合子部件拼装、单步明细抽屉与一键全部展开/收起。
 */

import { cn } from "@/lib/utils";
import { AlertCircle, Check, ChevronDown, Pause, RotateCw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, useContext, useState } from "react";

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
  /** 是否正处于运行中（页头展示绿色脉动状态） */
  isRunning?: boolean;
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
const ACTIVITY_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
  mass: 0.6,
};

const ActivityStatusGlyph = ({ status }: { status: AiAgentActivityStatus }) => {
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
  return <span aria-hidden="true" className="size-1.5 rounded-full bg-border" />;
};

const statusCircleClass = (status: AiAgentActivityStatus) => {
  if (status === "running") {
    return "border border-solid border-border bg-card ring-2 ring-emerald-500/20";
  }
  if (status === "success") return "bg-emerald-500/12 dark:bg-emerald-500/18";
  if (status === "error") return "bg-destructive/12";
  return "border border-solid border-border bg-card";
};

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
        "m-0 overflow-x-auto rounded-xl border border-solid border-border/70 bg-secondary/55 p-2.5 text-xs leading-relaxed text-foreground select-text",
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
          className="inline-flex items-center gap-1 rounded-md border border-solid border-border/70 bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
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
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={reduced ? { duration: 0 } : ACTIVITY_SPRING}
        className="mt-2.5 overflow-hidden border-l border-solid border-border/80 pl-3"
      >
        <DrawerBody details={details} metadata={metadata} />
      </motion.div>
    )}
  </AnimatePresence>
);
interface ActivityContextValue {
  activities: AiAgentActivityItemData[];
  isRunning: boolean;
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

const HeaderControls = ({
  onExpandAll,
  onCollapseAll,
}: {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) => (
  <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
    <button
      type="button"
      onClick={onExpandAll}
      className="cursor-pointer border-0 bg-transparent p-0 font-sans text-xs text-muted-foreground transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      全部展开
    </button>
    <span aria-hidden="true" className="text-border">
      /
    </span>
    <button
      type="button"
      onClick={onCollapseAll}
      className="cursor-pointer border-0 bg-transparent p-0 font-sans text-xs text-muted-foreground transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      全部收起
    </button>
  </div>
);

export const AiAgentActivityHeader = ({
  title = "执行轨迹",
  agentName,
  showControls = true,
  className,
}: AiAgentActivityHeaderProps) => {
  const { activities, isRunning, expandAll, collapseAll } = useAiAgentActivity();
  const completedCount = activities.filter((a) => a.status === "success").length;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2.5 border-b border-solid border-border/75 px-5 py-3.5 select-none",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="truncate text-sm font-medium tracking-tight text-foreground">{title}</span>
        {agentName && <span className="truncate text-xs text-muted-foreground">— {agentName}</span>}
        <span aria-hidden="true" className="hidden size-1 rounded-full bg-border sm:inline-block" />
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          {isRunning ? (
            <>
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-emerald-500"
              />
              <span className="text-foreground">运行中</span>
            </>
          ) : (
            <span className="tabular-nums">
              已完成 {completedCount} / {activities.length}
            </span>
          )}
        </span>
      </div>
      {showControls && <HeaderControls onExpandAll={expandAll} onCollapseAll={collapseAll} />}
    </div>
  );
};

const ItemTitleRow = ({
  activity,
  hasDetails,
  expanded,
  reduced,
}: {
  activity: AiAgentActivityItemData;
  hasDetails: boolean;
  expanded: boolean;
  reduced: boolean | null;
}) => (
  <>
    <div className="flex w-full items-center justify-between gap-3">
      <span
        className={cn(
          "truncate text-[13px] tracking-tight",
          activity.status === "running" ? "font-medium text-foreground" : "text-foreground/90",
        )}
      >
        {activity.title}
      </span>
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
  reduced,
  onToggle,
}: {
  activity: AiAgentActivityItemData;
  hasDetails: boolean;
  expanded: boolean;
  reduced: boolean | null;
  onToggle: () => void;
}) => {
  const row = (
    <ItemTitleRow
      activity={activity}
      hasDetails={hasDetails}
      expanded={expanded}
      reduced={reduced}
    />
  );
  if (!hasDetails) return <div>{row}</div>;
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onToggle}
      className="flex w-full cursor-pointer flex-col border-0 bg-transparent p-0 text-left font-sans outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
  const { expandedIds, toggleExpand } = useAiAgentActivity();
  const expanded = expandedIds.has(activity.id);
  const hasDetails = Boolean(activity.details || activity.metadata);
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative flex items-start gap-3.5", className)}>
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute top-6 bottom-[-14px] left-[9.5px] w-px bg-border/75"
        />
      )}
      <span
        className={cn(
          "relative z-10 mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
          statusCircleClass(activity.status),
        )}
      >
        <ActivityStatusGlyph status={activity.status} />
      </span>
      <div className="min-w-0 flex-1 pb-4 last:pb-0">
        <ItemContentShell
          activity={activity}
          hasDetails={hasDetails}
          expanded={expanded}
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
  const { activities } = useAiAgentActivity();
  if (activities.length === 0) {
    return <p className="m-0 py-10 text-center text-xs text-muted-foreground">暂无执行轨迹</p>;
  }
  return (
    <div className={cn("flex flex-col gap-1 px-5 py-4", className)}>
      {activities.map((item, idx) => (
        <AiAgentActivityItem key={item.id} activity={item} isLast={idx === activities.length - 1} />
      ))}
    </div>
  );
};

export const AiAgentActivity = ({
  activities = [],
  isRunning = false,
  title,
  agentName,
  defaultExpandedIds = [],
  className,
  children,
}: AiAgentActivityProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(defaultExpandedIds));

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ActivityCtx.Provider
      value={{
        activities,
        isRunning,
        expandedIds,
        toggleExpand,
        expandAll: () => setExpandedIds(new Set(activities.map((a) => a.id))),
        collapseAll: () => setExpandedIds(new Set()),
      }}
    >
      <div
        data-slot="ai-agent-activity"
        className={cn(
          "w-full max-w-xl overflow-hidden rounded-[22px] border border-solid border-border bg-card font-sans text-card-foreground shadow-xs",
          className,
        )}
      >
        {children ?? (
          <>
            <AiAgentActivityHeader title={title} agentName={agentName} />
            <AiAgentActivityTimeline />
          </>
        )}
      </div>
    </ActivityCtx.Provider>
  );
};
