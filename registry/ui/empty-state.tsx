// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { type ReactNode } from "react";

export interface EmptyStateProps {
  /** 顶部图标槽 */
  icon?: ReactNode;
  /** 空态标题 */
  title: string;
  /** 空态补充说明 */
  description?: string;
  /** 主操作按钮 */
  action?: ReactNode;
  /** 次操作按钮 */
  secondaryAction?: ReactNode;
  /** 紧凑模式（用于表格或侧边栏内嵌） */
  compact?: boolean;
  /** 自定义类名 */
  className?: string;
}
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) => (
  <div
    data-slot="empty-state"
    className={cn(
      "flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 text-center",
      compact ? "px-5 py-7" : "px-6 py-11",
      className,
    )}
  >
    <div
      aria-hidden="true"
      className="inline-flex size-11 items-center justify-center rounded-xl border border-solid border-border bg-background text-muted-foreground shadow-sm dark:bg-card"
    >
      {icon ?? <Inbox className="size-5" />}
    </div>
    <p className="m-0 mt-4 font-sans text-sm font-semibold text-foreground">{title}</p>
    {description && (
      <p className="m-0 mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    )}
    {(action || secondaryAction) && (
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {action}
        {secondaryAction}
      </div>
    )}
  </div>
);
