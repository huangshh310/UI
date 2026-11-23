import { cn } from "@matt-ui/utils";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import type { EmptyStateProps } from "./empty-state.types.js";
import { emptyStateVariants } from "./empty-state.variants.js";

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
