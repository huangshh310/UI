"use client";

/**
 * AvatarStack：支持在线状态指示、溢出计数与方向感知悬停提示的叠放头像组。
 */
import { Avatar } from "@base-ui/react/avatar";
import { cn } from "@matt-ui/utils";
import { DirectionalTooltip, DirectionalTooltipProvider } from "../directional-tooltip/index.js";
import type {
  AvatarStackItem,
  AvatarStackProps,
  AvatarStackRing,
  AvatarStackSize,
} from "./avatar-stack.types.js";
import {
  avatarStackGroupVariants,
  avatarStackItemVariants,
  avatarStackStatusVariants,
} from "./avatar-stack.variants.js";

const AVATAR_TONES = [
  "bg-zinc-900/10 text-zinc-900 dark:bg-zinc-100/15 dark:text-zinc-100",
  "bg-signal/14 text-info dark:bg-signal/22",
  "bg-emerald-500/14 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-100",
  "bg-amber-500/15 text-amber-900 dark:bg-amber-400/20 dark:text-amber-100",
  "bg-violet-500/14 text-violet-900 dark:bg-violet-400/20 dark:text-violet-100",
];

const getInitials = (item: AvatarStackItem) =>
  item.initials ?? item.name.trim().slice(0, 2).toUpperCase();

const AvatarGraphic = ({ item, tone }: { item: AvatarStackItem; tone?: string }) => (
  <Avatar.Root
    className={cn(
      "inline-flex size-full items-center justify-center overflow-hidden rounded-full border border-solid border-foreground/10 font-semibold dark:border-white/15",
      tone,
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
  ring,
  interactive,
  tooltipDelay,
  onItemClick,
}: {
  item: AvatarStackItem;
  index: number;
  size: AvatarStackSize;
  ring: AvatarStackRing;
  interactive: boolean;
  tooltipDelay: number;
  onItemClick?: (item: AvatarStackItem) => void;
}) => {
  const tone = AVATAR_TONES[index % AVATAR_TONES.length];
  const tip = item.role ? `${item.name} · ${item.role}` : item.name;
  return (
    <DirectionalTooltip content={tip} side="top" delay={tooltipDelay}>
      <button
        type="button"
        aria-label={item.name}
        onClick={() => onItemClick?.(item)}
        className={avatarStackItemVariants({ size, ring, interactive })}
      >
        <AvatarGraphic item={item} tone={tone} />
        {item.status && (
          <span
            aria-hidden="true"
            className={avatarStackStatusVariants({ status: item.status, size, ring })}
          />
        )}
      </button>
    </DirectionalTooltip>
  );
};

const OverflowPill = ({
  hiddenItems,
  size,
  ring,
  interactive,
  tooltipDelay,
  onOverflowClick,
}: {
  hiddenItems: AvatarStackItem[];
  size: AvatarStackSize;
  ring: AvatarStackRing;
  interactive: boolean;
  tooltipDelay: number;
  onOverflowClick?: () => void;
}) => {
  const names = hiddenItems.map((m) => m.name).join("、");
  return (
    <DirectionalTooltip content={names} side="top" delay={tooltipDelay}>
      <button
        type="button"
        aria-label={`还有 ${hiddenItems.length} 位成员`}
        onClick={onOverflowClick}
        className={cn(
          avatarStackItemVariants({ size, ring, interactive }),
          "z-10 border border-solid border-border/85 bg-secondary font-mono font-semibold text-foreground tabular-nums dark:border-white/12 dark:bg-popover",
        )}
      >
        +{hiddenItems.length}
      </button>
    </DirectionalTooltip>
  );
};

export const AvatarStack = ({
  items,
  max = 4,
  size = "md",
  ring = "card",
  spacing = "normal",
  interactive = true,
  onItemClick,
  onOverflowClick,
  tooltipDelay = 160,
  className,
}: AvatarStackProps) => {
  const visible = items.slice(0, max);
  const hidden = items.slice(max);

  return (
    <DirectionalTooltipProvider delay={tooltipDelay}>
      <div
        data-slot="avatar-stack"
        data-size={size}
        className={cn(avatarStackGroupVariants({ size, spacing }), className)}
      >
        {visible.map((item, index) => (
          <AvatarCell
            key={item.id}
            item={item}
            index={index}
            size={size}
            ring={ring}
            interactive={interactive}
            tooltipDelay={tooltipDelay}
            onItemClick={onItemClick}
          />
        ))}
        {hidden.length > 0 && (
          <OverflowPill
            hiddenItems={hidden}
            size={size}
            ring={ring}
            interactive={interactive}
            tooltipDelay={tooltipDelay}
            onOverflowClick={onOverflowClick}
          />
        )}
      </div>
    </DirectionalTooltipProvider>
  );
};
