import TeamMembersBlockBasicDemo from "@/demos/team-members-block/basic";
import TeamMembersBlockCompactDemo from "@/demos/team-members-block/compact";
import type { ComponentDoc } from "./registry.types";

export const TEAM_MEMBERS_BLOCK_DOC: ComponentDoc = {
  slug: "team-members-block",
  name: "Team Members Block",
  description:
    "由 Card、AvatarStack、SpringSelect、SettleModal 与 EmptyState 组合的团队成员与角色权限管理区块。",
  category: "blocks",
  registryName: "team-members-block",
  dependencies: ["@base-ui/react", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { TeamMembersBlock } from "@/components/ui/team-members-block";

export function Example() {
  return <TeamMembersBlock />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "团队成员筛选、角色切换与邀请弹窗",
      description: "支持按姓名/邮箱与角色筛选、行内变更成员权限以及弹出 SettleModal 邀请新成员。",
      file: "team-members-block/basic.tsx",
      Demo: TeamMembersBlockBasicDemo,
    },
    {
      slug: "compact",
      name: "精简设计小组列表",
      description: "通过 initialMembers 传入自定义初始成员数据，适合小型项目工作区。",
      file: "team-members-block/compact.tsx",
      Demo: TeamMembersBlockCompactDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "initialMembers",
      type: "TeamMember[]",
      defaultValue: "内置示例",
      description: "初始成员数组",
    },
    {
      name: "onInvite",
      type: "(payload) => void",
      defaultValue: "—",
      description: "邀请新成员提交回调",
    },
  ],
  accessibility: [
    "搜索输入框、角色选择下拉框与移除按钮均带有独立可访问标签。",
    "邀请弹窗由 SettleModal 提供完整焦点陷阱与 Escape 关闭恢复焦点。",
  ],
};
