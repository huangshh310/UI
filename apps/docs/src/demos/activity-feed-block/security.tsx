"use client";

import { ActivityFeedBlock } from "@matt-ui/ui";

const SECURITY_EVENTS = [
  {
    id: "s1",
    actor: "身份治理中心",
    initials: "身",
    title: "完成了季度 SAML 2.0 证书轮换",
    detail: "所有子工作区已无缝切换至新证书。",
    time: "10 分钟前",
    category: "security" as const,
    unread: true,
  },
  {
    id: "s2",
    actor: "合规巡检",
    initials: "合",
    title: "发布锁已锁定 @ui-sdk/react@0.1.0-beta.13",
    detail: "依赖哈希校验一致，允许进入生产流水线。",
    time: "1 小时前",
    category: "deploy" as const,
  },
];

export default function ActivityFeedBlockSecurityDemo() {
  return <ActivityFeedBlock initialItems={SECURITY_EVENTS} />;
}
