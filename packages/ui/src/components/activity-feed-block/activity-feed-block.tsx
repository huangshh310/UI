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
  ActivityCategory,
  ActivityEntry,
  ActivityFeedBlockProps,
} from "./activity-feed-block.types.js";

const DEFAULT_ITEMS: ActivityEntry[] = [
  {
    id: "a1",
    actor: "林知远",
    initials: "林",
    title: "发布了 edge-gateway v2.4.1 至东京与新加坡节点",
    detail: "构建耗时 28s，双主题 axe 巡检 0 违规。",
    time: "3 分钟前",
    category: "deploy",
    unread: true,
  },
  {
    id: "a2",
    actor: "安全策略引擎",
    initials: "安",
    title: "检测到新的 SSH 公钥已添加到 CI 发布环境",
    detail: "指纹 SHA256:9f2a…4c8e，已通过 SSO 二次校验。",
    time: "24 分钟前",
    category: "security",
    unread: true,
  },
  {
    id: "a3",
    actor: "陈屿",
    initials: "陈",
    title: "更新了 Cobalt Blue 信号色对比度审计基线",
    detail: "主色对比度维持 4.95:1，焦点环对背景 3.4:1。",
    time: "2 小时前",
    category: "team",
  },
  {
    id: "a4",
    actor: "周宁",
    initials: "周",
    title: "同步了 71 个 Registry 条目至私有分发仓",
    detail: "全量 shadcn CLI 安装与 Vite 构建通过。",
    time: "昨天 18:40",
    category: "deploy",
  },
];

const CATEGORY_META: Record<
  ActivityCategory,
  { label: string; variant: "secondary" | "warning" | "outline" }
> = {
  deploy: { label: "部署", variant: "secondary" },
  security: { label: "安全", variant: "warning" },
  team: { label: "协作", variant: "outline" },
};

const FeedItemRow = ({
  item,
  onMarkRead,
}: {
  item: ActivityEntry;
  onMarkRead: (id: string) => void;
}) => {
  const meta = CATEGORY_META[item.category];
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-solid border-border/75 px-4 py-3.5 transition-colors last:border-b-0",
        item.unread ? "bg-secondary/45" : "bg-transparent",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-solid border-border bg-secondary text-xs font-semibold text-foreground">
          {item.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{item.actor}</span>
            <Badge variant={meta.variant}>{meta.label}</Badge>
            {item.unread && (
              <Badge variant="outline" dot>
                未读
              </Badge>
            )}
          </div>
          <p className="m-0 mt-1 text-sm text-foreground">{item.title}</p>
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">{item.time}</span>
        {item.unread && (
          <Button size="sm" variant="ghost" onClick={() => onMarkRead(item.id)}>
            标为已读
          </Button>
        )}
      </div>
    </div>
  );
};

const FeedList = ({
  items,
  emptyTitle,
  onMarkRead,
}: {
  items: ActivityEntry[];
  emptyTitle: string;
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
    <div className="overflow-hidden rounded-xl border border-solid border-border">
      {items.map((item) => (
        <FeedItemRow key={item.id} item={item} onMarkRead={onMarkRead} />
      ))}
    </div>
  );
};

const buildFeedTabs = (items: ActivityEntry[], onMarkRead: (id: string) => void) => {
  const unread = items.filter((item) => item.unread);
  return [
    {
      value: "all",
      label: "全部",
      badge: String(items.length),
      content: <FeedList items={items} emptyTitle="暂无工作区动态" onMarkRead={onMarkRead} />,
    },
    {
      value: "unread",
      label: "未读",
      badge: String(unread.length),
      content: <FeedList items={unread} emptyTitle="暂无未读通知" onMarkRead={onMarkRead} />,
    },
    {
      value: "deploy",
      label: "部署",
      content: (
        <FeedList
          items={items.filter((i) => i.category === "deploy")}
          emptyTitle="暂无部署动态"
          onMarkRead={onMarkRead}
        />
      ),
    },
    {
      value: "security",
      label: "安全",
      content: (
        <FeedList
          items={items.filter((i) => i.category === "security")}
          emptyTitle="暂无安全事件"
          onMarkRead={onMarkRead}
        />
      ),
    },
  ];
};

export const ActivityFeedBlock = ({
  initialItems = DEFAULT_ITEMS,
  className,
}: ActivityFeedBlockProps) => {
  const [items, setItems] = useState(initialItems);
  const unreadCount = items.filter((item) => item.unread).length;
  const markRead = (id: string) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));

  return (
    <Card data-slot="activity-feed-block" className={cn("w-full", className)}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>通知中心与审计动态</CardTitle>
          <CardDescription>集中追踪生产部署、安全审计与团队配置变更。</CardDescription>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={unreadCount === 0}
          onClick={() => setItems((prev) => prev.map((item) => ({ ...item, unread: false })))}
        >
          <CheckCheck className="size-3.5" />
          <span>全部已读</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs items={buildFeedTabs(items, markRead)} defaultValue="all" variant="pill" />
      </CardContent>
    </Card>
  );
};
