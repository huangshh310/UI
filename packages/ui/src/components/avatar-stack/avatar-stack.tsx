"use client";

/**
 * AvatarStack：基于 Base UI Avatar 并复用 DirectionalTooltip 的叠放头像组。
 */
import { Avatar } from "@base-ui/react/avatar";
import { cn } from "@matt-ui/utils";
import { DirectionalTooltip, DirectionalTooltipProvider } from "../directional-tooltip/index.js";
import type { AvatarStackItem, AvatarStackProps, AvatarStackSize } from "./avatar-stack.types.js";

const SIZE_MAP: Record<AvatarStackSize, { avatar: string; overlap: string; text: string }> = {
  sm: { avatar: "size-8", overlap: "-space-x-2", text: "text-[11px]" },
  md: { avatar: "size-10", overlap: "-space-x-2.5", text: "text-xs" },
  lg: { avatar: "size-12", overlap: "-space-x-3", text: "text-sm" },
};

const AVATAR_TONES = [
  "bg-gradient-to-br from-blue-500/20 to-indigo-500/25 text-blue-900 dark:from-blue-400/25 dark:to-indigo-400/30 dark:text-blue-100",
  "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/25 text-violet-900 dark:from-violet-400/25 dark:to-fuchsia-400/30 dark:text-violet-100",
  "bg-gradient-to-br from-emerald-500/20 to-teal-500/25 text-emerald-900 dark:from-emerald-400/25 dark:to-teal-400/30 dark:text-emerald-100",
  "bg-gradient-to-br from-amber-500/20 to-orange-500/25 text-amber-900 dark:from-amber-400/25 dark:to-orange-400/30 dark:text-amber-100",
  "bg-gradient-to-br from-rose-500/20 to-pink-500/25 text-rose-900 dark:from-rose-400/25 dark:to-pink-400/30 dark:text-rose-100",
];

const STATUS_DOT: Record<NonNullable<AvatarStackItem["status"]>, string> = {
  online: "bg-emerald-500",
  busy: "bg-rose-500",
  offline: "bg-muted-foreground/60",
};

const getInitials = (item: AvatarStackItem) =>
  item.initials ?? item.name.trim().slice(0, 2).toUpperCase();

const AvatarGraphic = ({
  item,
  tone,
  textClass,
}: {
  item: AvatarStackItem;
  tone?: string;
  textClass: string;
}) => (
  <Avatar.Root
    className={cn(
      "inline-flex size-full items-center justify-center overflow-hidden rounded-full border border-solid border-foreground/10 font-semibold",
      tone,
      textClass,
    )}
  >
    {item.src && <Avatar.Image src={item.src} alt={item.name} className="size-full object-cover" />}
    <Avatar.Fallback className="inline-flex size-full items-center justify-center">
      {getInitials(item)}
    </Avatar.Fallback>
  </Avatar.Root>
);

const AvatarCell = ({
  item,
  index,
  size,
  tooltipDelay,
}: {
  item: AvatarStackItem;
  index: number;
  size: AvatarStackSize;
  tooltipDelay: number;
}) => {
  const styles = SIZE_MAP[size];
  const tone = AVATAR_TONES[index % AVATAR_TONES.length];
  const tip = item.role ? `${item.name} · ${item.role}` : item.name;
  return (
    <DirectionalTooltip content={tip} side="top" delay={tooltipDelay}>
      <button
        type="button"
        aria-label={item.name}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-card p-0 ring-2 ring-card shadow-sm outline-none transition-transform duration-(--ui-duration-fast) ease-(--ui-ease-out) hover:z-20 hover:-translate-y-1 hover:scale-110 focus-visible:z-20 focus-visible:ring-ring motion-reduce:transition-none",
          styles.avatar,
        )}
      >
        <AvatarGraphic item={item} tone={tone} textClass={styles.text} />
        {item.status && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute right-0 bottom-0 z-10 size-2.5 rounded-full ring-2 ring-card",
              STATUS_DOT[item.status],
            )}
          />
        )}
      </button>
    </DirectionalTooltip>
  );
};

export const AvatarStack = ({
  items,
  max = 4,
  size = "md",
  tooltipDelay = 160,
  className,
}: AvatarStackProps) => {
  const visible = items.slice(0, max);
  const overflow = Math.max(0, items.length - visible.length);
  const styles = SIZE_MAP[size];

  return (
    <DirectionalTooltipProvider delay={tooltipDelay}>
      <div
        data-slot="avatar-stack"
        className={cn("inline-flex items-center", styles.overlap, className)}
      >
        {visible.map((item, index) => (
          <AvatarCell
            key={item.id}
            item={item}
            index={index}
            size={size}
            tooltipDelay={tooltipDelay}
          />
        ))}
        {overflow > 0 && (
          <span
            aria-label={`还有 ${overflow} 位成员`}
            className={cn(
              "relative z-10 inline-flex shrink-0 items-center justify-center rounded-full border border-solid border-border bg-card font-mono font-semibold text-foreground ring-2 ring-card shadow-sm tabular-nums",
              styles.avatar,
              styles.text,
            )}
          >
            +{overflow}
          </span>
        )}
      </div>
    </DirectionalTooltipProvider>
  );
};
