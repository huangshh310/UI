/**
 * Drag to Confirm 的文档数据。
 */
import { DragToConfirmBasic } from "@/demos/drag-to-confirm/basic";
import DragToConfirmReleaseDemo from "@/demos/drag-to-confirm/release";
import DragToConfirmVariantsDemo from "@/demos/drag-to-confirm/variants";
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
  return (
    <DragToConfirm
      tone="destructive"
      label="滑动以删除项目"
      confirmedLabel="已删除"
      onConfirm={remove}
    />
  );
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
      description: "演示高危回滚场景的警示色调拖拽确认、完成回调与纯键盘 Enter 等效操作。",
      file: "drag-to-confirm/release.tsx",
      Demo: DragToConfirmReleaseDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "语义色调、毛玻璃材质与尺寸",
      description: "对比 emerald 支付场景与 destructive 高危注销场景的材质与尺寸组合。",
      file: "drag-to-confirm/variants.tsx",
      Demo: DragToConfirmVariantsDemo,
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
    {
      name: "tone",
      type: '"signal" | "destructive" | "emerald"',
      defaultValue: '"signal"',
      description: "语义色调，决定拖尾填充与确认后滑块的高亮色。",
    },
    {
      name: "variant",
      type: '"subtle" | "glass"',
      defaultValue: '"subtle"',
      description: "滑轨材质：内凹柔和轨道或毛玻璃浮层轨道。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "滑轨与滑块尺寸。",
    },
    {
      name: "icon",
      type: "ReactNode",
      defaultValue: "ArrowRight",
      description: "自定义滑块未确认时的图标。",
    },
    { name: "onConfirm", type: "() => void", defaultValue: "-", description: "确认时调用。" },
    { name: "onReset", type: "() => void", defaultValue: "-", description: "自动复位时调用。" },
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
