// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Inbox } from "lucide-react";
import { type ReactNode } from "react";

export const emptyStateVariants = cva(
  "flex w-full flex-col items-center justify-center text-center",
  {
    variants: {
      variant: {
        default: "rounded-2xl border border-solid border-transparent bg-transparent px-6 py-12",
        card: "rounded-2xl border border-solid border-border/90 bg-card px-6 py-11 shadow-xs dark:border-border/80",
        dashed: "rounded-2xl border border-dashed border-border bg-card/60 px-6 py-11",
        compact: "rounded-xl border border-dashed border-border/85 bg-muted/40 px-5 py-7",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export type EmptyStateVariant = "default" | "card" | "dashed" | "compact";

export interface EmptyStateProps {
  /** 容器视觉形态 */
  variant?: EmptyStateVariant;
  /** 顶部图标槽 */
  icon?: ReactNode;
  /** 自定义插画槽（传入时替代默认图标徽章） */
  illustration?: ReactNode;
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
const EmptyStateVisual = ({
  icon,
  illustration,
  isCompact,
}: {
  icon?: ReactNode;
  illustration?: ReactNode;
  isCompact: boolean;
}) => {
  if (illustration) {
    return (
      <div
        data-slot="empty-state-illustration"
        aria-hidden="true"
        className="flex items-center justify-center"
      >
        {illustration}
      </div>
    );
  }
  return (
    <div
      data-slot="empty-state-icon"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-solid border-border/90 bg-background text-muted-foreground shadow-sm ring-4 ring-foreground/[0.03] dark:border-foreground/12 dark:bg-card dark:ring-foreground/[0.04]",
        isCompact ? "size-10 rounded-xl" : "size-12",
      )}
    >
      {icon ?? <Inbox className={isCompact ? "size-4.5" : "size-5"} />}
    </div>
  );
};

const EmptyStateActions = ({
  action,
  secondaryAction,
  isCompact,
}: {
  action?: ReactNode;
  secondaryAction?: ReactNode;
  isCompact: boolean;
}) => {
  if (!action && !secondaryAction) return null;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        isCompact ? "mt-4" : "mt-5",
      )}
    >
      {action}
      {secondaryAction}
    </div>
  );
};

export const EmptyState = ({
  variant,
  icon,
  illustration,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) => {
  const resolvedVariant = variant ?? (compact ? "compact" : "default");
  const isCompact = compact || resolvedVariant === "compact";
  const compactOverride = compact && variant !== undefined && variant !== "compact";

  return (
    <div
      data-slot="empty-state"
      data-variant={resolvedVariant}
      className={cn(
        emptyStateVariants({ variant: resolvedVariant }),
        compactOverride && "px-5 py-7",
        className,
      )}
    >
      <EmptyStateVisual icon={icon} illustration={illustration} isCompact={isCompact} />
      <p
        className={cn(
          "m-0 font-sans font-semibold tracking-[-0.015em] text-foreground",
          isCompact ? "mt-3.5 text-sm" : "mt-4 text-[15px]",
        )}
      >
        {title}
      </p>
      {description && (
        <p className="m-0 mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <EmptyStateActions action={action} secondaryAction={secondaryAction} isCompact={isCompact} />
    </div>
  );
};
