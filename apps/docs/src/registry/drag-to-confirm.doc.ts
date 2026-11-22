/**
 * Drag to Confirm 的文档数据。
 */
import { DragToConfirmBasic } from "@/demos/drag-to-confirm/basic";
import DragToConfirmReleaseDemo from "@/demos/drag-to-confirm/release";
import type { ComponentDoc } from "./registry.types";

export const DRAG_TO_CONFIRM_DOC: ComponentDoc = {
  slug: "drag-to-confirm",
  name: "Drag to Confirm",
  description: "必须把滑块拖到尽头才会确认的滑轨，用于删除、转账这类关键操作。",
  category: "buttons",
  registryName: "drag-to-confirm",
  dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { DragToConfirm } from "@/components/ui/drag-to-confirm";

export function Demo() {
  return <DragToConfirm label="滑动以删除项目" onConfirm={remove} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "drag-to-confirm-basic",
      name: "拖动确认",
      description: "拖过九成后松手即确认，否则弹回起点。",
      file: "drag-to-confirm/basic.tsx",
      Demo: DragToConfirmBasic,
    },
    {
      slug: "release",
      name: "生产回滚滑动确认与回调",
      description: "演示高危回滚场景的拖拽确认、完成回调与纯键盘 Enter 等效操作。",
      file: "drag-to-confirm/release.tsx",
      Demo: DragToConfirmReleaseDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "label",
      type: "string",
      defaultValue: `"Slide to confirm"`,
      description: "轨道上的提示，也是滑块的可访问名称。",
    },
    {
      name: "confirmedLabel",
      type: "string",
      defaultValue: `"Confirmed"`,
      description: "确认后的文字。",
    },
    { name: "onConfirm", type: "() => void", defaultValue: "-", description: "确认时调用。" },
    {
      name: "autoResetDelay",
      type: "number",
      defaultValue: "2500",
      description: "确认后多久自动复位，0 表示不复位。",
    },
    {
      name: "haptics",
      type: "boolean",
      defaultValue: "true",
      description: "跨过确认阈值与确认时触发设备震动反馈（支持 Vibration API 的设备生效）。",
    },
  ],
  accessibility: [
    "键盘用户聚焦滑块后按 Enter 或空格即可确认，不必拖动。",
    "确认结果通过播报区告知屏幕阅读器。",
    "用户要求减少动态效果时滑块直接到位。",
  ],
};
