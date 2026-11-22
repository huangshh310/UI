import SettingsBlockBasicDemo from "@/demos/settings-block/basic";
import SettingsBlockProductionDemo from "@/demos/settings-block/production";
import type { ComponentDoc } from "./registry.types";

export const SETTINGS_BLOCK_DOC: ComponentDoc = {
  slug: "settings-block",
  name: "Settings Block",
  description: "由 Card、SpringSelect、DrawCheckbox、AvatarStack 与 Button 组合的工作区设置区块。",
  category: "blocks",
  registryName: "settings-block",
  dependencies: [],
  usage: `import { SettingsBlock } from "@/components/ui/settings-block";

<SettingsBlock onSave={(state) => console.log(state)} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "工作区偏好设置面板",
      description: "清晰发丝分节、区域下拉选择、协作成员头像叠放与手绘复选通知开关。",
      file: "settings-block/basic.tsx",
      Demo: SettingsBlockBasicDemo,
    },
    {
      slug: "production",
      name: "监听保存回调的生产偏好面板",
      description: "通过 onSave 实时捕获区域与告警开关变更并回显保存摘要。",
      file: "settings-block/production.tsx",
      Demo: SettingsBlockProductionDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "onSave",
      type: "(state: WorkspaceSettingsState) => void",
      defaultValue: "—",
      description: "点击保存按钮回调",
    },
  ],
  accessibility: ["完整继承 SpringSelect、DrawCheckbox 与 AvatarStack 的键盘与屏幕阅读器语义。"],
};
