/**
 * Draw Checkbox 的文档数据。
 */
import { DrawCheckboxBasic } from "@/demos/draw-checkbox/basic";
import DrawCheckboxGroupDemo from "@/demos/draw-checkbox/group";
import type { ComponentDoc } from "./registry.types";

export const DRAW_CHECKBOX_DOC: ComponentDoc = {
  slug: "draw-checkbox",
  name: "Draw Checkbox",
  description: "基于 Base UI Checkbox，勾选时对勾沿 SVG 路径平滑绘制出来的复选框。",
  category: "forms",
  registryName: "draw-checkbox",
  dependencies: ["@base-ui/react", "clsx", "tailwind-merge"],
  usage: `import { DrawCheckbox } from "@/components/ui/draw-checkbox";

export function Demo() {
  return <DrawCheckbox label="同意服务条款" defaultChecked />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "draw-checkbox-basic",
      name: "路径绘制勾选",
      description: "支持默认墨色、信号色与半选（indeterminate）三种状态。",
      file: "draw-checkbox/basic.tsx",
      Demo: DrawCheckboxBasic,
    },
    {
      slug: "group",
      name: "半选态全选分组清单",
      description: "父级复选框随子项勾选自动在全选、半选与未选间切换，配钴蓝信号色。",
      file: "draw-checkbox/group.tsx",
      Demo: DrawCheckboxGroupDemo,
      directory: false,
    },
  ],
  api: [
    { name: "label", type: "string", defaultValue: "-", description: "复选框旁标签文字。" },
    { name: "description", type: "string", defaultValue: "-", description: "标签下方的补充说明。" },
    {
      name: "checked / defaultChecked",
      type: "boolean",
      defaultValue: "false",
      description: "受控或非受控勾选状态。",
    },
    {
      name: "indeterminate",
      type: "boolean",
      defaultValue: "false",
      description: '半选态，声明 aria-checked="mixed"。',
    },
    {
      name: "tone",
      type: `"primary" | "signal"`,
      defaultValue: `"primary"`,
      description: "勾选态底色。",
    },
    {
      name: "onCheckedChange",
      type: "(checked: boolean) => void",
      defaultValue: "-",
      description: "状态变化回调。",
    },
  ],
  accessibility: [
    "交互与隐藏表单输入由 Base UI Checkbox 提供，支持点击标签与空格键切换。",
    '半选状态正确声明 aria-checked="mixed"。',
    "减少动态效果时路径绘制时长自动压缩至接近零。",
  ],
};
