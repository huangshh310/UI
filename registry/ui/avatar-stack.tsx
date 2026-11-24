// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AvatarStack：支持在线状态指示、溢出计数与方向感知悬停提示的叠放头像组。
 */

import {
  DirectionalTooltip,
  DirectionalTooltipProvider,
} from "@/components/ui/directional-tooltip";
import { cn } from "@/lib/utils";
import { Avatar } from "@base-ui/react/avatar";
import { cva } from "class-variance-authority";

export const avatarStackGroupVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
    },
    spacing: {
      tight: "",
      normal: "",
      loose: "",
    },
  },
  compoundVariants: [
    { size: "xs", spacing: "tight", class: "-space-x-2" },
    { size: "xs", spacing: "normal", class: "-space-x-1.5" },
    { size: "xs", spacing: "loose", class: "-space-x-0.5" },
    { size: "sm", spacing: "tight", class: "-space-x-2.5" },
    { size: "sm", spacing: "normal", class: "-space-x-2" },
    { size: "sm", spacing: "loose", class: "-space-x-1" },
    { size: "md", spacing: "tight", class: "-space-x-3.5" },
    { size: "md", spacing: "normal", class: "-space-x-2.5" },
    { size: "md", spacing: "loose", class: "-space-x-1.5" },
    { size: "lg", spacing: "tight", class: "-space-x-4" },
    { size: "lg", spacing: "normal", class: "-space-x-3" },
    { size: "lg", spacing: "loose", class: "-space-x-1.5" },
  ],
  defaultVariants: {
    size: "md",
    spacing: "normal",
  },
});

export const avatarStackItemVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 p-0 shadow-[0_1px_3px_rgba(0,0,0,0.08)] outline-none transition-[transform,box-shadow] duration-(--ui-duration-fast) ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-[11px]",
        md: "size-10 text-xs",
        lg: "size-12 text-sm",
      },
      ring: {
        card: "bg-card ring-2 ring-card",
        background: "bg-background ring-2 ring-background",
        none: "bg-card ring-0",
      },
      interactive: {
        true: "hover:z-20 hover:-translate-y-1 hover:scale-108 hover:shadow-[0_6px_14px_-4px_rgba(0,0,0,0.18)]",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      ring: "card",
      interactive: true,
    },
  },
);

export const avatarStackStatusVariants = cva("absolute z-10 rounded-full", {
  variants: {
    status: {
      online: "bg-emerald-500",
      busy: "bg-rose-500",
      away: "bg-amber-500",
      offline: "bg-muted-foreground/60",
    },
    size: {
      xs: "right-0 bottom-0 size-1.5 ring-[1.5px]",
      sm: "right-0 bottom-0 size-2 ring-2",
      md: "right-0.5 bottom-0.5 size-2.5 ring-2",
      lg: "right-0.5 bottom-0.5 size-3 ring-2",
    },
    ring: {
      card: "ring-card",
      background: "ring-background",
      none: "ring-card",
    },
  },
  defaultVariants: {
    status: "online",
    size: "md",
    ring: "card",
  },
});
export type AvatarStackSize = "xs" | "sm" | "md" | "lg";
export type AvatarStackRing = "card" | "background" | "none";
export type AvatarStackSpacing = "tight" | "normal" | "loose";
export type AvatarStackStatus = "online" | "busy" | "away" | "offline";

export interface AvatarStackItem {
  id: string;
  name: string;
  role?: string;
  src?: string;
  initials?: string;
  status?: AvatarStackStatus;
}

export interface AvatarStackProps {
  /** 成员头像列表 */
  items: AvatarStackItem[];
  /** 最多展示几个头像，超出部分折叠为 +N */
  max?: number;
  /** 尺寸预设 */
  size?: AvatarStackSize;
  /** 描边圆环底色（匹配所在容器背景） */
  ring?: AvatarStackRing;
  /** 头像叠放紧密度 */
  spacing?: AvatarStackSpacing;
  /** 是否启用悬停浮起交互 */
  interactive?: boolean;
  /** 点击单个头像时的回调 */
  onItemClick?: (item: AvatarStackItem) => void;
  /** 点击 +N 溢出计数徽章时的回调 */
  onOverflowClick?: () => void;
  /** 提示浮层触发延迟（毫秒） */
  tooltipDelay?: number;
  /** 自定义容器类名 */
  className?: string;
}
const AVATAR_TONES = [
  "bg-zinc-900/10 text-zinc-900 dark:bg-zinc-100/15 dark:text-zinc-100",
  "bg-blue-500/14 text-blue-900 dark:bg-blue-400/20 dark:text-blue-100",
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
