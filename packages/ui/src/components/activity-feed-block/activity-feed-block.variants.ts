import type { ActivityCategory, ActivityEntry } from "./activity-feed-block.types.js";

export const ACTIVITY_DEFAULT_ITEMS: ActivityEntry[] = [
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

export const ACTIVITY_CATEGORY_META: Record<
  ActivityCategory,
  { label: string; variant: "soft" | "warning" | "outline"; nodeTone: string }
> = {
  deploy: {
    label: "部署",
    variant: "soft",
    nodeTone: "border-signal/30 bg-signal/10 text-blue-700 dark:text-blue-300",
  },
  security: {
    label: "安全",
    variant: "warning",
    nodeTone: "border-amber-600/30 bg-amber-500/12 text-amber-900 dark:text-amber-200",
  },
  team: {
    label: "协作",
    variant: "outline",
    nodeTone: "border-border/80 bg-secondary text-foreground dark:border-white/12",
  },
};
