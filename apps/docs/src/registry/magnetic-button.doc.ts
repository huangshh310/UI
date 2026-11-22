/**
 * Magnetic Button 的文档数据。
 */
import { MagneticButtonBasic } from "@/demos/magnetic-button/basic";
import type { ComponentDoc } from "./registry.types";

export const MAGNETIC_BUTTON_DOC: ComponentDoc = {
  slug: "magnetic-button",
  name: "Magnetic Button",
  description: "指针靠近时被弹簧拉向指针，离开时弹回原位的按钮。",
  category: "buttons",
  registryName: "magnetic-button",
  dependencies: ["motion", "clsx", "tailwind-merge"],
  usage: `import { MagneticButton } from "@/components/ui/magnetic-button";

export function Demo() {
  return <MagneticButton strength={0.4}>启动控制台</MagneticButton>;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "magnetic-button-basic",
      name: "磁吸",
      description: "把指针移到按钮上，它会跟随指针轻微移动。",
      file: "magnetic-button/basic.tsx",
      Demo: MagneticButtonBasic,
    },
  ],
  api: [
    {
      name: "strength",
      type: "number",
      defaultValue: "0.35",
      description: "被吸过去的程度，0 到 1。",
    },
  ],
  accessibility: [
    "位移加在外层包裹元素上，按钮本身的键盘与焦点行为不受影响。",
    "用户要求减少动态效果时不移动。",
  ],
};
