/**
 * PressButton 的文档数据。
 */
import { PressButtonBasic } from "@/demos/press-button/basic";
import PressButtonVariantsDemo from "@/demos/press-button/variants";
import type { ComponentDoc } from "./registry.types";

export const PRESS_BUTTON_DOC: ComponentDoc = {
  slug: "press-button",
  name: "Press Button",
  description: "按下时轻微压缩、松开后带一点回弹的按钮，给出实体按键的触感。",
  category: "buttons",
  registryName: "press-button",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  usage: `import { PressButton } from "@/components/ui/press-button";

export function Demo() {
  return <PressButton pressStrength={0.05}>按住试试</PressButton>;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "press-button-basic",
      name: "按压回弹",
      description: "按住时缩小，松开后略微冲过原始大小再回落。",
      file: "press-button/basic.tsx",
      Demo: PressButtonBasic,
    },
    {
      slug: "variants",
      name: "多语义变体与按压深度",
      description: "对比 signal、secondary 与 destructive 搭配不同 pressStrength 的触感反馈。",
      file: "press-button/variants.tsx",
      Demo: PressButtonVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "pressStrength",
      type: "number",
      defaultValue: "0.04",
      description: "按下时缩小的比例，限制在 0.01 到 0.06 之间。",
    },
    {
      name: "fullWidth",
      type: "boolean",
      defaultValue: "false",
      description: "撑满父容器的宽度。",
    },
    {
      name: "elevation",
      type: '"raised" | "flat"',
      defaultValue: '"raised"',
      description: "按键立体层级，raised 在静置与按下时提供键帽般微浮压感。",
    },
    {
      name: "...ButtonProps",
      type: "ButtonProps",
      defaultValue: "-",
      description: "Button 的全部属性：variant、size、radius、loading 等。",
    },
  ],
  accessibility: ["沿用 Button 的全部键盘与焦点行为。", "用户要求减少动态效果时不做缩放。"],
};
