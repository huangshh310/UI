/**
 * LiquidRippleButton 的文档数据。
 */
import { LiquidRippleButtonBasic } from "@/demos/liquid-ripple-button/basic";
import type { ComponentDoc } from "./registry.types";

export const LIQUID_RIPPLE_BUTTON_DOC: ComponentDoc = {
  slug: "liquid-ripple-button",
  name: "Liquid Ripple Button",
  description: "按下时从指针位置扩散出一道波纹的按钮。",
  category: "buttons",
  registryName: "liquid-ripple-button",
  dependencies: ["clsx", "tailwind-merge"],
  usage: `import { LiquidRippleButton } from "@/components/ui/liquid-ripple-button";

export function Demo() {
  return <LiquidRippleButton onClick={() => console.log("run")}>运行</LiquidRippleButton>;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "liquid-ripple-button-basic",
      name: "指针起点的波纹",
      description: "波纹从点击的位置出发，盖满整个按钮后淡出。",
      file: "liquid-ripple-button/basic.tsx",
      Demo: LiquidRippleButtonBasic,
    },
  ],
  api: [
    {
      name: "children",
      type: "ReactNode",
      defaultValue: "-",
      description: "按钮内容。同时接受原生 button 的全部属性。",
    },
  ],
  accessibility: [
    "波纹是纯装饰，对辅助技术隐藏。",
    "用户要求减少动态效果时不生成波纹。",
    "键盘激活照常触发 onClick，不依赖波纹。",
  ],
};
