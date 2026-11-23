import SettingsBlockBasicDemo from "@/demos/settings-block/basic";
import SettingsBlockProductionDemo from "@/demos/settings-block/production";
import SettingsBlockSectionedDemo from "@/demos/settings-block/sectioned";
import type { ComponentDoc } from "./registry.types";

export const SETTINGS_BLOCK_DOC: ComponentDoc = {
  slug: "settings-block",
  name: "Settings Block",
  description:
    "由 Card、SpringSelect、DrawCheckbox、AvatarStack 与 Button 组合的工作区设置区块，内置脏状态追踪与一键重置。",
  category: "blocks",
  registryName: "settings-block",
  dependencies: ["class-variance-authority", "lucide-react"],
  usage: `import { SettingsBlock } from "@/components/ui/settings-block";

<SettingsBlock variant="sectioned" onSave={(state) => console.log(state)} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "工作区偏好设置面板",
      description: "清晰发丝分节、带节点延迟的边缘区域选择、在线成员头像叠放与右侧复选通知开关。",
      file: "settings-block/basic.tsx",
      Demo: SettingsBlockBasicDemo,
    },
    {
      slug: "production",
      name: "监听保存回调的生产偏好面板",
      description: "通过 onSave 实时捕获区域与告警开关变更并回显保存摘要，修改后自动出现重置入口。",
      file: "settings-block/production.tsx",
      Demo: SettingsBlockProductionDemo,
      directory: false,
    },
    {
      slug: "sectioned",
      name: "分节卡片组与自定义默认区域",
      description:
        '通过 variant="sectioned" 将区域、成员与通知拆分为层次清晰的子卡片组，适配复杂控制台设置页。',
      file: "settings-block/sectioned.tsx",
      Demo: SettingsBlockSectionedDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"default" | "elevated" | "sectioned"',
      defaultValue: '"default"',
      description: "面板表面与分节卡片样式",
    },
    {
      name: "title",
      type: "string",
      defaultValue: '"工作区偏好设置"',
      description: "设置面板标题",
    },
    {
      name: "description",
      type: "string",
      defaultValue: "内置描述",
      description: "设置面板副标题说明",
    },
    {
      name: "defaultRegion",
      type: "string",
      defaultValue: '"ap-northeast-1"',
      description: "初始默认部署区域",
    },
    {
      name: "defaultReleaseAlert",
      type: "boolean",
      defaultValue: "true",
      description: "初始发布状态告警开关",
    },
    {
      name: "defaultAuditAlert",
      type: "boolean",
      defaultValue: "true",
      description: "初始无障碍回归巡检开关",
    },
    {
      name: "compact",
      type: "boolean",
      defaultValue: "false",
      description: "紧凑密度模式",
    },
    {
      name: "onSave",
      type: "(state: WorkspaceSettingsState) => void",
      defaultValue: "—",
      description: "点击保存按钮回调",
    },
    {
      name: "onReset",
      type: "() => void",
      defaultValue: "—",
      description: "点击重置按钮恢复上次已保存状态的回调",
    },
  ],
  accessibility: [
    "完整继承 SpringSelect、DrawCheckbox 与 AvatarStack 的键盘与屏幕阅读器语义。",
    "所有复选通知行保持完整标签关联与双主题 WCAG AA 对比度。",
  ],
};
