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
      name: "分类通知中心与一键全部已读",
      description: "按全部/未读/部署/安全页签过滤动态，支持单条与批量标记已读并展示空态回退。",
      file: "activity-feed-block/basic.tsx",
      Demo: ActivityFeedBlockBasicDemo,
    },
    {
      slug: "security",
      name: "安全合规审计流",
      description: "传入自定义 initialItems 聚焦身份证书轮换与依赖版本锁事件。",
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
  ],
  accessibility: [
    "分类切换由 Base UI Tabs 驱动，支持左右方向键切换与焦点同步。",
    "所有未读状态均同时配有徽章文字与视觉指示点，不单纯依赖颜色表达。",
  ],
};
