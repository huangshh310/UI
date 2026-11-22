/**
 * Liquid Toggle 的文档数据。
 */
import { LiquidToggleBasic } from "@/demos/liquid-toggle/basic";
import type { ComponentDoc } from "./registry.types";

export const LIQUID_TOGGLE_DOC: ComponentDoc = {
  slug: "liquid-toggle",
  name: "Liquid Toggle",
  description: "滑块移动时像液滴一样拉长、到位后回弹成圆形的开关。",
  category: "buttons",
  registryName: "liquid-toggle",
  dependencies: ["motion", "clsx", "tailwind-merge"],
  usage: `import { LiquidToggle } from "@/components/ui/liquid-toggle";

export function Demo() {
  return <LiquidToggle aria-label="推送通知" onCheckedChange={setEnabled} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "liquid-toggle-basic",
      name: "液滴开关",
      description: "切换时滑块沿移动方向拉伸。",
      file: "liquid-toggle/basic.tsx",
      Demo: LiquidToggleBasic,
    },
  ],
  api: [
    { name: "checked", type: "boolean", defaultValue: "-", description: "受控的开关状态。" },
    {
      name: "defaultChecked",
      type: "boolean",
      defaultValue: "false",
      description: "非受控时的初始状态。",
    },
    {
      name: "onCheckedChange",
      type: "(checked: boolean) => void",
      defaultValue: "-",
      description: "状态变化时调用。",
    },
  ],
  accessibility: [
    `语义上是 role="switch" 的按钮，空格与 Enter 切换。`,
    "没有可见标签时需要提供 aria-label。",
    "用户要求减少动态效果时滑块直接到位，不做形变。",
  ],
};
