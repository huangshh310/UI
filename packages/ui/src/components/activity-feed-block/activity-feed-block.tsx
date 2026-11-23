"use client";

/**
 * ActivityFeedBlock：由 Card、Tabs、Badge、EmptyState 与 Button 组合的团队通知与系统审计动态流区块。
 */
import { cn } from "@matt-ui/utils";
import { CheckCheck } from "lucide-react";
import { useState } from "react";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card/index.js";
import { EmptyState } from "../empty-state/index.js";
import { Tabs } from "../tabs/index.js";
import type {
  ActivityEntry,
  ActivityFeedBlockProps,
  ActivityFeedVariant,
} from "./activity-feed-block.types.js";
import { ACTIVITY_CATEGORY_META, ACTIVITY_DEFAULT_ITEMS } from "./activity-feed-block.variants.js";

const FeedAvatar = ({ item, isTimeline }: { item: ActivityEntry; isTimeline: boolean }) => {
  const meta = ACTIVITY_CATEGORY_META[item.category];
  return (
    <div className="relative flex flex-col items-center self-stretch">
      <span
        className={cn(
          "relative z-10 mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-solid text-xs font-semibold",
          meta.nodeTone,
        )}
      >
        {item.initials}
        {item.unread && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-signal ring-2 ring-card"
          />
        )}
      </span>
      {isTimeline && (
        <span
          aria-hidden="true"
          className="mt-1.5 w-px flex-1 bg-border/80 group-last/feed:hidden dark:bg-white/10"
        />
      )}
    </div>
  );
};

const FeedRowMeta = ({
  item,
  onMarkRead,
}: {
  item: ActivityEntry;
  onMarkRead: (id: string) => void;
}) => (
  <div className="flex shrink-0 items-center gap-2">
    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{item.time}</span>
    {item.unread && (
      <Button size="sm" variant="ghost" radius="pill" onClick={() => onMarkRead(item.id)}>
        标为已读
      </Button>
    )}
  </div>
);

const FeedItemRow = ({
  item,
  variant,
  compact,
  onMarkRead,
}: {
  item: ActivityEntry;
  variant: ActivityFeedVariant;
  compact: boolean;
  onMarkRead: (id: string) => void;
}) => {
  const meta = ACTIVITY_CATEGORY_META[item.category];
  return (
    <div
      className={cn(
        "group/feed flex flex-wrap items-start justify-between gap-3 border-b border-solid border-border/75 transition-colors last:border-b-0 hover:bg-secondary/35 dark:border-white/10 dark:hover:bg-secondary/25",
        compact ? "px-3.5 py-2.5" : "px-4 py-3.5",
        item.unread ? "bg-signal/[0.04] dark:bg-signal/[0.08]" : "bg-transparent",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <FeedAvatar item={item} isTimeline={variant === "timeline"} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{item.actor}</span>
            <Badge variant={meta.variant} size="sm">
              {meta.label}
            </Badge>
            {item.unread && (
              <Badge variant="outline" size="sm" dot>
                未读
              </Badge>
            )}
          </div>
          <p className="m-0 mt-1 text-sm font-medium text-foreground">{item.title}</p>
          <p className="m-0 mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
        </div>
      </div>
      <FeedRowMeta item={item} onMarkRead={onMarkRead} />
    </div>
  );
};

const FeedList = ({
  items,
  emptyTitle,
  variant,
  compact,
  onMarkRead,
}: {
  items: ActivityEntry[];
  emptyTitle: string;
  variant: ActivityFeedVariant;
  compact: boolean;
  onMarkRead: (id: string) => void;
}) => {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description="所有工作区动态均已处理完毕，有新事件时会实时出现在这里。"
      />
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-solid border-border/80 bg-card/60 dark:border-white/10">
      {items.map((item) => (
        <FeedItemRow
          key={item.id}
          item={item}
          variant={variant}
          compact={compact}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
};

const buildFeedTabs = (
  items: ActivityEntry[],
  variant: ActivityFeedVariant,
  compact: boolean,
  onMarkRead: (id: string) => void,
) => {
  const unread = items.filter((item) => item.unread);
  const defs = [
    {
      value: "all",
      label: "全部",
      badge: String(items.length),
      list: items,
      empty: "暂无工作区动态",
    },
    {
      value: "unread",
      label: "未读",
      badge: String(unread.length),
      list: unread,
      empty: "暂无未读通知",
    },
    {
      value: "deploy",
      label: "部署",
      list: items.filter((i) => i.category === "deploy"),
      empty: "暂无部署动态",
    },
    {
      value: "security",
      label: "安全",
      list: items.filter((i) => i.category === "security"),
      empty: "暂无安全事件",
    },
  ];
  return defs.map(({ value, label, badge, list, empty }) => ({
    value,
    label,
    badge,
    content: (
      <FeedList
        items={list}
        emptyTitle={empty}
        variant={variant}
        compact={compact}
        onMarkRead={onMarkRead}
      />
    ),
  }));
};

const FeedHeader = ({
  title,
  description,
  unreadCount,
  onMarkAll,
}: {
  title: string;
  description: string;
  unreadCount: number;
  onMarkAll: () => void;
}) => (
  <CardHeader className="flex flex-col gap-3 border-b border-solid border-border/75 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <CardTitle>{title}</CardTitle>
        <Badge variant={unreadCount > 0 ? "soft" : "success"} size="sm" dot>
          {unreadCount > 0 ? `${unreadCount} 条未读` : "已全部阅读"}
        </Badge>
      </div>
      <CardDescription className="mt-1">{description}</CardDescription>
    </div>
    <Button
      size="sm"
      variant="outline"
      radius="pill"
      disabled={unreadCount === 0}
      onClick={onMarkAll}
    >
      <CheckCheck className="size-3.5" />
      <span>全部已读</span>
    </Button>
  </CardHeader>
);

export const ActivityFeedBlock = (props: ActivityFeedBlockProps) => {
  const [items, setItems] = useState(props.initialItems ?? ACTIVITY_DEFAULT_ITEMS);
  const variant = props.variant ?? "timeline";
  const unreadCount = items.filter((item) => item.unread).length;
  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
    props.onMarkRead?.(id);
  };
  const handleMarkAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
    props.onMarkAllRead?.();
  };

  return (
    <Card
      data-slot="activity-feed-block"
      data-variant={variant}
      className={cn("w-full border-border/80 dark:border-white/10", props.className)}
    >
      <FeedHeader
        title={props.title ?? "通知中心与审计动态"}
        description={props.description ?? "集中追踪生产部署、安全审计与团队配置变更。"}
        unreadCount={unreadCount}
        onMarkAll={handleMarkAll}
      />
      <CardContent className="pt-5 pb-6">
        <Tabs
          items={buildFeedTabs(items, variant, props.compact ?? false, handleMarkRead)}
          defaultValue="all"
          variant="pill"
        />
      </CardContent>
    </Card>
  );
};
