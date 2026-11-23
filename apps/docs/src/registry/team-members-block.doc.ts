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
      description:
        "支持席位统计、按姓名/邮箱与角色计数筛选、行内变更成员权限以及弹出 SettleModal 邀请新成员。",
      file: "team-members-block/basic.tsx",
      Demo: TeamMembersBlockBasicDemo,
    },
    {
      slug: "compact",
      name: "精简设计小组列表",
      description: '组合 compact、variant="subtle" 与 maxSeats，适合小型项目工作区与子空间设置。',
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
      name: "title",
      type: "string",
      defaultValue: '"团队成员与权限"',
      description: "区块主标题",
    },
    {
      name: "description",
      type: "string",
      defaultValue: '"管理工作区协作成员、角色策略与发布权限。"',
      description: "区块副标题说明",
    },
    {
      name: "variant",
      type: '"default" | "elevated" | "subtle"',
      defaultValue: '"default"',
      description: "外层卡片容器变体",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "是否启用紧凑成员行布局",
    },
    {
      name: "maxSeats",
      type: "number",
      defaultValue: "—",
      description: "最大可用席位数，传入后在标题旁展示席位占比",
    },
    {
      name: "onInvite",
      type: "(payload) => void",
      defaultValue: "—",
      description: "邀请新成员提交回调",
    },
    {
      name: "onRoleChange",
      type: "(id: string, role: TeamRole) => void",
      defaultValue: "—",
      description: "切换成员角色时触发",
    },
    {
      name: "onRemove",
      type: "(id: string) => void",
      defaultValue: "—",
      description: "移除成员时触发",
    },
  ],
  accessibility: [
    "搜索输入框、角色筛选按钮组（aria-pressed）、角色选择下拉框与移除按钮均带有独立可访问标签。",
    "成员在线状态同时通过头像角标圆点与文字状态呈现，避免纯色表达。",
    "邀请弹窗由 SettleModal 提供完整焦点陷阱与 Escape 关闭恢复焦点。",
  ],
};
