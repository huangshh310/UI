// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AgentScreen：对标 BeautifulUI 21 Agent Screen 的智能体实时操作屏幕视口容器，
 * 支持连接中态加载、实况工作画面承载与底栏状态控制。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type ComponentProps, type ReactNode } from "react";

export const AGENT_SCREEN_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const agentScreenViewportVariants = cva(
  "relative w-full overflow-hidden rounded-2xl border border-solid border-border bg-[#09090b] text-neutral-100 shadow-xs dark:border-white/10",
);

export const agentScreenTabVariants = cva(
  "cursor-pointer rounded-full border border-solid px-2.5 py-0.5 font-sans text-[11px] font-medium transition-colors",
  {
    variants: {
      active: {
        true: "border-border bg-card text-foreground shadow-2xs dark:border-white/14 dark:bg-white/12 dark:text-white",
        false: "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
/** 智能体屏幕运行状态：working 实况工作中、loading 建立连接中 */
export type AgentScreenStatus = "working" | "loading";

export interface AgentScreenProps extends Omit<ComponentProps<"section">, "title"> {
  /** 当前屏幕状态，默认 "loading" */
  status?: AgentScreenStatus;
  /** 底部标题，默认 "智能体屏幕" */
  title?: string;
  /** 连接中态的居中提示文案，默认 "正在连接智能体屏幕" */
  loadingLabel?: string;
  /** 工作态左上角可选实况步骤说明（如正在浏览的页面或动作） */
  activityLabel?: string;
  /** 视口宽高比，默认 "16 / 10" */
  aspectRatio?: string;
  /** 右侧可选扩展操作按钮（如接管控制、全屏打开） */
  actions?: ReactNode;
  /** 点击底栏状态切换胶囊时的回调；传入时显示「运行中 / 连接中」切换器 */
  onStatusChange?: (status: AgentScreenStatus) => void;
}
const STATUS_ITEMS: { id: AgentScreenStatus; label: string }[] = [
  { id: "working", label: "运行中" },
  { id: "loading", label: "连接中" },
];

const AgentScreenLoadingView = ({ label }: { label: string }) => (
  <div className="flex size-full flex-col items-center justify-center gap-3.5 px-6 text-center">
    <span
      aria-hidden="true"
      className="size-6 animate-spin rounded-full border-[1.75px] border-solid border-white/15 border-t-white/90"
    />
    <span className="text-xs font-medium tracking-tight text-neutral-300">{label}</span>
  </div>
);

const AgentScreenFooter = ({
  title,
  status,
  actions,
  onStatusChange,
}: {
  title: string;
  status: AgentScreenStatus;
  actions?: ReactNode;
  onStatusChange?: (status: AgentScreenStatus) => void;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-medium tracking-tight text-foreground">{title}</span>
      {onStatusChange && (
        <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border bg-muted/70 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
          {STATUS_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={status === item.id}
              onClick={() => onStatusChange(item.id)}
              className={cn(
                agentScreenTabVariants({ active: status === item.id }),
                AGENT_SCREEN_FOCUS_RING,
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
    {actions && <div className="flex items-center gap-1.5">{actions}</div>}
  </div>
);

export const AgentScreen = ({
  status = "loading",
  title = "智能体屏幕",
  loadingLabel = "正在连接智能体屏幕",
  activityLabel,
  aspectRatio = "16 / 10",
  actions,
  onStatusChange,
  children,
  className,
  ...props
}: AgentScreenProps) => (
  <section
    aria-label={title}
    data-slot="agent-screen"
    data-status={status}
    className={cn("flex w-full flex-col gap-2.5", className)}
    {...props}
  >
    <div style={{ aspectRatio }} className={agentScreenViewportVariants()}>
      {status === "loading" ? (
        <AgentScreenLoadingView label={loadingLabel} />
      ) : (
        <div className="relative size-full overflow-hidden">
          {children}
          {activityLabel && (
            <div className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-solid border-white/12 bg-neutral-950/75 px-2.5 py-1 text-[11px] font-medium text-neutral-200 backdrop-blur-md">
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-emerald-400"
              />
              <span>{activityLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
    <AgentScreenFooter
      title={title}
      status={status}
      actions={actions}
      onStatusChange={onStatusChange}
    />
  </section>
);
