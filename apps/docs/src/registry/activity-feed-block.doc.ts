import ActivityFeedBlockBasicDemo from "@/demos/activity-feed-block/basic";
import ActivityFeedBlockSecurityDemo from "@/demos/activity-feed-block/security";
import type { ComponentDoc } from "./registry.types";

export const ACTIVITY_FEED_BLOCK_DOC: ComponentDoc = {
  slug: "activity-feed-block",
  name: "Activity Feed Block",
  description:
    "由 Card、Tabs、Badge、EmptyState 与 Button 组合的分类通知中心与系统审计动态流区块。",
  category: "blocks",
  registryName: "activity-feed-block",
  dependencies: ["@base-ui/react", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { ActivityFeedBlock } from "@/components/ui/activity-feed-block";

export function Example() {
  return <ActivityFeedBlock />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "时间线通知中心与一键全部已读",
      description:
        "默认以垂直时间线串联全部/未读/部署/安全动态，支持单条与批量标记已读并展示空态回退。",
      file: "activity-feed-block/basic.tsx",
      Demo: ActivityFeedBlockBasicDemo,
    },
    {
      slug: "security",
      name: "紧凑列表型安全合规审计流",
      description: '组合 variant="list"、compact 与自定义 initialItems，聚焦证书轮换与依赖锁事件。',
      file: "activity-feed-block/security.tsx",
      Demo: ActivityFeedBlockSecurityDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "initialItems",
      type: "ActivityEntry[]",
      defaultValue: "内置示例",
      description: "初始动态条目",
    },
    {
      name: "title",
      type: "string",
      defaultValue: '"通知中心与审计动态"',
      description: "区块主标题",
    },
    {
      name: "description",
      type: "string",
      defaultValue: '"集中追踪生产部署、安全审计与团队配置变更。"',
      description: "区块副标题说明",
    },
    {
      name: "variant",
      type: '"timeline" | "list"',
      defaultValue: '"timeline"',
      description: "事件流视觉排布：时间线或平铺列表",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "是否启用紧凑行间距",
    },
    {
      name: "onMarkRead",
      type: "(id: string) => void",
      defaultValue: "—",
      description: "单条标为已读时触发",
    },
    {
      name: "onMarkAllRead",
      type: "() => void",
      defaultValue: "—",
      description: "点击全部已读时触发",
    },
  ],
  accessibility: [
    "顶部分类页签完整支持左右方向键切换与焦点同步。",
    "所有未读状态均同时配有徽章文字与视觉指示点，不单纯依赖颜色表达。",
  ],
};
