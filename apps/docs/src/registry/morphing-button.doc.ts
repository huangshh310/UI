/**
 * Morphing Button 的文档数据。
 */
import { MorphingButtonBasic } from "@/demos/morphing-button/basic";
import MorphingButtonErrorDemo from "@/demos/morphing-button/error";
import MorphingButtonVariantsDemo from "@/demos/morphing-button/variants";
import type { ComponentDoc } from "./registry.types";

export const MORPHING_BUTTON_DOC: ComponentDoc = {
  slug: "morphing-button",
  name: "Morphing Button",
  description: "在待操作、处理中、成功、失败四个阶段之间平滑变形的按钮。",
  category: "buttons",
  registryName: "morphing-button",
  dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { MorphingButton } from "@/components/ui/morphing-button";

export function Demo() {
  return (
    <MorphingButton
      status={status}
      variant="signal"
      successTone="emerald"
      onClick={save}
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "morphing-button-basic",
      name: "阶段变形",
      description: "点击后依次经过处理中与成功，宽度平滑过渡。",
      file: "morphing-button/basic.tsx",
      Demo: MorphingButtonBasic,
    },
    {
      slug: "error",
      name: "加载失败态与重试流程",
      description: "演示 idle → loading → error 形态转换及一键重置闭环。",
      file: "morphing-button/error.tsx",
      Demo: MorphingButtonErrorDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "多变体、成功色调与前置图标",
      description: "结合 signal / outline 变体、emerald 成功态与 idleIcon 构建 C 端提交体验。",
      file: "morphing-button/variants.tsx",
      Demo: MorphingButtonVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "status",
      type: `"idle" | "loading" | "success" | "error"`,
      defaultValue: "-",
      description: "当前阶段，由调用方控制。",
    },
    {
      name: "labels",
      type: "Partial<Record<Status, string>>",
      defaultValue: "-",
      description: "各阶段的文字。",
    },
    {
      name: "variant",
      type: '"primary" | "signal" | "outline"',
      defaultValue: '"primary"',
      description: "待操作与处理中阶段的视觉变体。",
    },
    {
      name: "successTone",
      type: '"signal" | "emerald"',
      defaultValue: '"signal"',
      description: "成功阶段的色调，emerald 提供经典绿色勾选反馈。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "按钮尺寸。",
    },
    {
      name: "radius",
      type: '"pill" | "default"',
      defaultValue: '"pill"',
      description: "圆角风格：胶囊圆角或标准大圆角。",
    },
    {
      name: "idleIcon",
      type: "ReactNode",
      defaultValue: "-",
      description: "待操作阶段显示在文字前的图标。",
    },
  ],
  accessibility: [
    "可访问名称始终是当前阶段的文字，阶段变化会被播报。",
    "处理中声明 aria-busy 与 aria-disabled，并且不响应点击。",
    "用户要求减少动态效果时只做淡入淡出。",
  ],
};
