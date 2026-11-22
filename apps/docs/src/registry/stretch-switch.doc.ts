/**
 * Stretch Switch 的文档数据。
 */
import { StretchSwitchBasic } from "@/demos/stretch-switch/basic";
import type { ComponentDoc } from "./registry.types";

export const STRETCH_SWITCH_DOC: ComponentDoc = {
  slug: "stretch-switch",
  name: "Stretch Switch",
  description: "按压时滑块沿目标方向弹性拉伸、松手以弹簧物理回弹到位的开关组件。",
  category: "forms",
  registryName: "stretch-switch",
  dependencies: ["@base-ui/react", "motion", "clsx", "tailwind-merge"],
  usage: `import { StretchSwitch } from "@/components/ui/stretch-switch";

export function Demo() {
  return <StretchSwitch label="自动部署预览" defaultChecked />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "stretch-switch-basic",
      name: "按压拉伸开关",
      description: "基于 Base UI Switch 与 motion 弹簧，兼顾原生表单参与与触感回弹。",
      file: "stretch-switch/basic.tsx",
      Demo: StretchSwitchBasic,
    },
  ],
  api: [
    { name: "label", type: "string", defaultValue: "-", description: "开关旁标签文字。" },
    { name: "description", type: "string", defaultValue: "-", description: "补充说明文字。" },
    {
      name: "checked / defaultChecked",
      type: "boolean",
      defaultValue: "false",
      description: "受控或非受控开关状态。",
    },
    {
      name: "tone",
      type: `"primary" | "signal"`,
      defaultValue: `"primary"`,
      description: "开启态轨道底色。",
    },
    {
      name: "onCheckedChange",
      type: "(checked: boolean) => void",
      defaultValue: "-",
      description: "切换回调。",
    },
  ],
  accessibility: [
    "语义与键盘操作由 Base UI Switch 提供，支持空格与回车切换及原生表单提交。",
    "用户要求减少动态效果时关闭拉伸形变与弹簧过渡，直接切换状态。",
  ],
};
