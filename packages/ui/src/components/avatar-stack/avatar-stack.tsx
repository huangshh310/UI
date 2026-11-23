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
  "bg-zinc-900/10 text-zinc-900 dark:bg-zinc-100/15 dark:text-zinc-100",
  "bg-blue-500/14 text-blue-900 dark:bg-blue-400/20 dark:text-blue-100",
  "bg-emerald-500/14 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-100",
  "bg-amber-500/14 text-amber-900 dark:bg-amber-400/20 dark:text-amber-100",
  "bg-stone-500/16 text-stone-900 dark:bg-stone-400/20 dark:text-stone-100",
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
              "absolute right-0.5 bottom-0.5 z-10 size-2 rounded-full ring-2 ring-card",
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
