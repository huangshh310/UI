import { cva } from "class-variance-authority";
import type { AiSubagentItem } from "./ai-subagents.types.js";

export const aiSubagentsContainerVariants = cva("w-full text-foreground", {
  variants: {
    variant: {
      card: "rounded-2xl border border-border bg-card/95 p-4 shadow-sm sm:p-5",
      seamless: "bg-transparent p-0",
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export const SUBAGENTS_DEFAULT_ITEMS: AiSubagentItem[] = [
  {
    id: "sub-1",
    role: "Explore",
    task: "追踪会话创建链路",
    activity: '正在检索 "createSession"',
    status: "running",
    model: "Haiku 4.5",
    toolUses: 1,
    duration: "1.2s",
    steps: [
      {
        id: "s1",
        label: "读取 src/auth/session.ts",
        detail: "定位 Cookie 写入与 TTL 设置",
        status: "done",
      },
      {
        id: "s2",
        label: '搜索引用 "createSession"',
        detail: "匹配到 4 处调用入口",
        status: "running",
      },
    ],
  },
  {
    id: "sub-2",
    role: "Explore",
    task: "映射令牌刷新流程",
    activity: '正在检索 "/auth/refresh"',
    status: "running",
    model: "Haiku 4.5",
    toolUses: 1,
    duration: "0.9s",
    steps: [
      {
        id: "s3",
        label: "扫描 middleware/refresh.ts",
        detail: "检查并发刷新锁与 401 重试",
        status: "running",
      },
    ],
  },
  {
    id: "sub-3",
    role: "General",
    task: "排查近期鉴权变更",
    activity: "等待开始",
    status: "queued",
    model: "Sonnet 4.5",
    steps: [
      {
        id: "s4",
        label: "等待前序探索结果汇总",
        detail: "将比对最近 10 次 auth 目录提交",
        status: "running",
      },
    ],
  },
];
