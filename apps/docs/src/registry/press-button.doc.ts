/**
 * PressButton 的文档数据。
 */
import { PressButtonBasic } from "@/demos/press-button/basic";
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
      name: "...ButtonProps",
      type: "ButtonProps",
      defaultValue: "-",
      description: "Button 的全部属性：variant、size、loading 等。",
    },
  ],
  accessibility: ["沿用 Button 的全部键盘与焦点行为。", "用户要求减少动态效果时不做缩放。"],
};
