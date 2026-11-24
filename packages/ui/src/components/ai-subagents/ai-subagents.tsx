"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleSlash2,
  Loader2,
  Square,
  XCircle,
} from "lucide-react";
import { cn } from "@matt-ui/utils";
import type { AiSubagentItem, AiSubagentStatus, AiSubagentsProps } from "./ai-subagents.types.js";
import { SUBAGENTS_DEFAULT_ITEMS, aiSubagentsContainerVariants } from "./ai-subagents.variants.js";

function StatusOrb({ status }: { status: AiSubagentStatus }) {
  if (status === "running") {
    return (
      <span
        aria-hidden="true"
        className="mt-0.5 inline-block size-3.5 shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#e0f2fe_0%,#7dd3fc_38%,#3b82f6_72%,#1e3a8a_100%)] shadow-[0_0_8px_rgba(59,130,246,0.32)]"
      />
    );
  }
  if (status === "queued") {
    return (
      <span
        aria-hidden="true"
        className="mt-0.5 inline-block size-3.5 shrink-0 rounded-full border border-dashed border-muted-foreground/60"
      />
    );
  }
  if (status === "completed") {
    return (
      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
    );
  }
  if (status === "failed") {
    return <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />;
  }
  return <CircleSlash2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />;
}

function SubagentDetails({ agent }: { agent: AiSubagentItem }) {
  if (!agent.steps?.length && !agent.summary) return null;
  return (
    <div className="mt-2 ml-6 space-y-1.5 border-l border-border/80 pl-3.5 text-xs">
      {agent.steps?.map((step) => (
        <div key={step.id} className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-foreground/85">{step.label}</p>
            {step.detail ? (
              <p className="text-[11px] text-muted-foreground">{step.detail}</p>
            ) : null}
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {step.status === "done" ? "完成" : "进行中"}
          </span>
        </div>
      ))}
      {agent.summary ? <p className="pt-0.5 text-muted-foreground">{agent.summary}</p> : null}
    </div>
  );
}

function SubagentRowActions({
  agent,
  expanded,
  onToggle,
  onStop,
}: {
  agent: AiSubagentItem;
  expanded: boolean;
  onToggle: () => void;
  onStop: () => void;
}) {
  const canStop = agent.status === "running" || agent.status === "queued";
  const hasDetails = Boolean(agent.steps?.length || agent.summary);

  return (
    <div className="flex shrink-0 items-center gap-2 pt-0.5">
      {agent.toolUses ? (
        <span className="hidden text-[11px] tabular-nums text-muted-foreground sm:inline">
          {agent.toolUses} 次工具调用
        </span>
      ) : null}
      <span className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[11px] font-medium text-foreground">
        {agent.model}
      </span>
      {hasDetails ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={`${expanded ? "收起" : "展开"}子代理 ${agent.task}`}
          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      ) : null}
      {canStop ? (
        <button
          type="button"
          onClick={onStop}
          aria-label={`停止子代理 ${agent.task}`}
          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Square className="size-2.5 fill-current" />
        </button>
      ) : null}
    </div>
  );
}

function SubagentRow({
  agent,
  expanded,
  onToggle,
  onStop,
}: {
  agent: AiSubagentItem;
  expanded: boolean;
  onToggle: () => void;
  onStop: () => void;
}) {
  return (
    <div className="py-2.5 first:pt-2 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <StatusOrb status={agent.status} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] leading-snug">
              <span className="font-semibold text-foreground">{agent.role}</span>
              <span className="text-foreground/90">{agent.task}</span>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{agent.activity}</p>
          </div>
        </div>
        <SubagentRowActions agent={agent} expanded={expanded} onToggle={onToggle} onStop={onStop} />
      </div>
      {expanded ? <SubagentDetails agent={agent} /> : null}
    </div>
  );
}

function getHeaderHeadline(running: number, done: number, total: number, hasActive: boolean) {
  if (running > 0) return `正在运行 ${running} 个子代理`;
  if (hasActive) return `队列中有 ${total - done} 个子代理`;
  return `已完成 ${done} / ${total} 个子代理`;
}

function SubagentsHeader(p: {
  running: number;
  done: number;
  total: number;
  hasActive: boolean;
  elapsed: string;
  open: boolean;
  onToggleOpen: () => void;
  onStopAll: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-2.5">
      <div className="flex items-center gap-2 text-xs">
        {p.running > 0 ? (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
        )}
        <span className="font-medium text-foreground">
          {getHeaderHeadline(p.running, p.done, p.total, p.hasActive)}
        </span>
        <span className="tabular-nums text-muted-foreground">
          已完成 {p.done} / {p.total}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="tabular-nums text-muted-foreground">{p.elapsed}</span>
        <button
          type="button"
          onClick={p.onToggleOpen}
          aria-expanded={p.open}
          aria-label={p.open ? "折叠子代理列表" : "展开子代理列表"}
          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {p.open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
        {p.hasActive ? (
          <button
            type="button"
            onClick={p.onStopAll}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Square className="size-2.5 fill-current" aria-hidden="true" />
            全部停止
          </button>
        ) : null}
      </div>
    </div>
  );
}

const stopAgentById = (items: AiSubagentItem[], id: string) =>
  items.map((a) =>
    a.id === id ? { ...a, status: "stopped" as const, activity: "已手动停止" } : a,
  );

const stopAllActive = (items: AiSubagentItem[]) =>
  items.map((a) =>
    a.status === "running" || a.status === "queued"
      ? { ...a, status: "stopped" as const, activity: "已批量停止" }
      : a,
  );

const DEFAULT_SUBAGENTS_CFG = {
  initialAgents: SUBAGENTS_DEFAULT_ITEMS,
  elapsed: "1s",
  defaultOpen: true,
  variant: "card" as const,
};

/**
 * 并行子代理监控列表，对标 HextaUI Subagents：
 * 展示运行态发光微球、队列态虚线圈、模型标识、工具调用次数与逐条/批量中止控制。
 */
export function AiSubagents(props: AiSubagentsProps) {
  const cfg = { ...DEFAULT_SUBAGENTS_CFG, ...props };
  const [internalAgents, setInternalAgents] = useState<AiSubagentItem[]>(cfg.initialAgents);
  const [open, setOpen] = useState(cfg.defaultOpen);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const list = props.agents ?? internalAgents;
  const running = list.filter((a) => a.status === "running").length;
  const done = list.filter((a) => a.status === "completed").length;
  const hasActive = list.some((a) => a.status === "running" || a.status === "queued");

  const handleStopOne = (id: string) => {
    if (!props.agents) setInternalAgents((prev) => stopAgentById(prev, id));
    props.onStopAgent?.(id);
  };
  const handleStopAll = () => {
    if (!props.agents) setInternalAgents((prev) => stopAllActive(prev));
    props.onStopAll?.();
  };

  return (
    <div className={cn(aiSubagentsContainerVariants({ variant: cfg.variant }), props.className)}>
      <SubagentsHeader
        running={running}
        done={done}
        total={list.length}
        hasActive={hasActive}
        elapsed={cfg.elapsed}
        open={open}
        onToggleOpen={() => setOpen((v) => !v)}
        onStopAll={handleStopAll}
      />
      {open ? (
        <div className="divide-y divide-border/50 pt-1">
          {list.map((agent) => (
            <SubagentRow
              key={agent.id}
              agent={agent}
              expanded={Boolean(expandedIds[agent.id])}
              onToggle={() => setExpandedIds((prev) => ({ ...prev, [agent.id]: !prev[agent.id] }))}
              onStop={() => handleStopOne(agent.id)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
