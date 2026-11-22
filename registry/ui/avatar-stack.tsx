// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * AvatarStack：基于 Base UI Avatar 并复用 DirectionalTooltip 的叠放头像组。
 */

import {
  DirectionalTooltip,
  DirectionalTooltipProvider,
} from "@/components/ui/directional-tooltip";
import { cn } from "@/lib/utils";
import { Avatar } from "@base-ui/react/avatar";

export type AvatarStackSize = "sm" | "md" | "lg";

export interface AvatarStackItem {
  id: string;
  name: string;
  role?: string;
  src?: string;
  initials?: string;
  status?: "online" | "busy" | "offline";
}

export interface AvatarStackProps {
  /** 成员头像列表 */
  items: AvatarStackItem[];
  /** 最多展示几个头像，超出部分折叠为 +N */
  max?: number;
  /** 尺寸预设 */
  size?: AvatarStackSize;
  /** 提示浮层触发延迟（毫秒） */
  tooltipDelay?: number;
  /** 自定义容器类名 */
  className?: string;
}
const SIZE_MAP: Record<AvatarStackSize, { avatar: string; overlap: string; text: string }> = {
  sm: { avatar: "size-7", overlap: "-space-x-2", text: "text-[11px]" },
  md: { avatar: "size-9", overlap: "-space-x-2.5", text: "text-xs" },
  lg: { avatar: "size-11", overlap: "-space-x-3", text: "text-sm" },
};

const STATUS_DOT: Record<NonNullable<AvatarStackItem["status"]>, string> = {
  online: "bg-signal",
  busy: "bg-destructive",
  offline: "bg-muted-foreground/50",
};

const getInitials = (item: AvatarStackItem) =>
  item.initials ?? item.name.trim().slice(0, 2).toUpperCase();

const AvatarCell = ({
  item,
  size,
  tooltipDelay,
}: {
  item: AvatarStackItem;
  size: AvatarStackSize;
  tooltipDelay: number;
}) => {
  const styles = SIZE_MAP[size];
  const tip = item.role ? `${item.name} · ${item.role}` : item.name;
  return (
    <DirectionalTooltip content={tip} side="top" delay={tooltipDelay}>
      <button
        type="button"
        aria-label={item.name}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 ring-2 ring-background outline-none",
          "transition-transform duration-(--ui-duration-fast) ease-(--ui-ease-out) hover:z-20 hover:-translate-y-1 hover:scale-110 focus-visible:z-20 focus-visible:ring-ring motion-reduce:transition-none",
          styles.avatar,
        )}
      >
        <Avatar.Root
          className={cn(
            "inline-flex size-full items-center justify-center overflow-hidden rounded-full border border-solid border-border bg-secondary font-medium text-foreground",
            styles.text,
          )}
        >
          {item.src && (
            <Avatar.Image src={item.src} alt={item.name} className="size-full object-cover" />
          )}
          <Avatar.Fallback className="inline-flex size-full items-center justify-center bg-secondary text-foreground">
            {getInitials(item)}
          </Avatar.Fallback>
        </Avatar.Root>
        {item.status && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-background",
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
        {visible.map((item) => (
          <AvatarCell key={item.id} item={item} size={size} tooltipDelay={tooltipDelay} />
        ))}
        {overflow > 0 && (
          <span
            aria-label={`还有 ${overflow} 位成员`}
            className={cn(
              "relative z-10 inline-flex shrink-0 items-center justify-center rounded-full border border-solid border-border bg-secondary font-mono font-medium text-muted-foreground ring-2 ring-background tabular-nums",
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
