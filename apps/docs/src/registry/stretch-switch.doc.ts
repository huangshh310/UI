/**
 * Stretch Switch 的文档数据。
 */
import { StretchSwitchBasic } from "@/demos/stretch-switch/basic";
import StretchSwitchSettingsDemo from "@/demos/stretch-switch/settings";
import StretchSwitchVariantsDemo from "@/demos/stretch-switch/variants";
import type { ComponentDoc } from "./registry.types";

export const STRETCH_SWITCH_DOC: ComponentDoc = {
  slug: "stretch-switch",
  name: "Stretch Switch",
  description:
    "按压时滑块沿目标方向弹性拉伸、松手以弹簧物理回弹到位的开关，支持设置卡片、胶囊、设置行、三档尺寸与滑块微图标。",
  category: "forms",
  registryName: "stretch-switch",
  dependencies: ["@base-ui/react", "motion", "clsx", "tailwind-merge"],
  usage: `import { StretchSwitch } from "@/components/ui/stretch-switch";

export function Demo() {
  return (
    <StretchSwitch
      variant="card"
      tone="signal"
      label="自动部署预览"
      description="每次合并后自动生成独立预览环境。"
      defaultChecked
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "stretch-switch-basic",
      name: "按压拉伸开关",
      description: "结合按压拉伸物理弹簧反馈，展示 primary / signal / success 三种触感色调。",
      file: "stretch-switch/basic.tsx",
      Demo: StretchSwitchBasic,
    },
    {
      slug: "variants",
      name: "多形态、尺寸与滑块微图标",
      description: "展示 sm / md / lg 尺寸、胶囊 pill、设置卡 card 与日夜滑块图标。",
      file: "stretch-switch/variants.tsx",
      Demo: StretchSwitchVariantsDemo,
      directory: false,
    },
    {
      slug: "settings",
      name: "工作区偏好开关列表与禁用态",
      description: "在设置面板中组合 row 变体、图标徽章与组织策略锁定的禁用开关。",
      file: "stretch-switch/settings.tsx",
      Demo: StretchSwitchSettingsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: `"default" | "card" | "pill" | "row"`,
      defaultValue: `"default"`,
      description: "视觉形态：行内开关、独立设置卡、胶囊快捷开关或全宽设置行。",
    },
    {
      name: "size / tone",
      type: `"sm" | "md" | "lg" / "primary" | "signal" | "success"`,
      defaultValue: `"md" / "primary"`,
      description: "三档尺寸（拉伸距离按比例缩放）与开启态轨道色调。",
    },
    {
      name: "controlPosition",
      type: `"left" | "right"`,
      defaultValue: `"left"（card/row 默认 "right"）`,
      description: "开关相对标签文字的位置。",
    },
    {
      name: "label / description",
      type: "string",
      defaultValue: "-",
      description: "开关标签与下方补充说明文字。",
    },
    {
      name: "icon / badge / thumbIcon",
      type: "ReactNode / string / { checked?, unchecked? }",
      defaultValue: "-",
      description: "标签前置图标、紧凑徽章与滑块内部的动态微图标。",
    },
    {
      name: "checked / defaultChecked / onCheckedChange",
      type: "boolean / (checked: boolean) => void",
      defaultValue: "false",
      description: "受控或非受控开关状态及变更回调。",
    },
  ],
  accessibility: [
    "内置标准 switch 无障碍角色，完整支持空格与回车切换及原生表单提交。",
    "用户要求减少动态效果时关闭拉伸形变与弹簧过渡，直接切换状态。",
  ],
};
