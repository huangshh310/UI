/**
 * NeonEdgeButton 的文档数据。
 */
import { NeonEdgeButtonBasic } from "@/demos/neon-edge-button/basic";
import NeonEdgeButtonSizesDemo from "@/demos/neon-edge-button/sizes";
import NeonEdgeButtonVariantsDemo from "@/demos/neon-edge-button/variants";
import type { ComponentDoc } from "./registry.types";

export const NEON_EDGE_BUTTON_DOC: ComponentDoc = {
  slug: "neon-edge-button",
  name: "Neon Edge Button",
  description: "一束信号色的光沿着边框绕行的按钮，文字始终是主角。",
  category: "buttons",
  registryName: "neon-edge-button",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  usage: `import { NeonEdgeButton } from "@/components/ui/neon-edge-button";

export function Demo() {
  return (
    <NeonEdgeButton variant="surface" tone="signal" speed={1.5}>
      部署预览
    </NeonEdgeButton>
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "neon-edge-button-basic",
      name: "绕行的边缘光",
      description: "光沿边框匀速绕行，约三秒一圈。",
      file: "neon-edge-button/basic.tsx",
      Demo: NeonEdgeButtonBasic,
    },
    {
      slug: "sizes",
      name: "三档尺寸流光描边按钮",
      description: "并排展示 sm / md / lg 三种尺寸与不同绕行速度的边框微光流动效果。",
      file: "neon-edge-button/sizes.tsx",
      Demo: NeonEdgeButtonSizesDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "表面质感与流光色调",
      description: "支持卡片表面、圆角造型与多语义流光色调，适配深浅主题。",
      file: "neon-edge-button/variants.tsx",
      Demo: NeonEdgeButtonVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"primary" | "surface" | "signal"',
      defaultValue: '"primary"',
      description: "内层按钮的表面视觉变体。",
    },
    {
      name: "tone",
      type: '"signal" | "emerald" | "amber" | "violet"',
      defaultValue: '"signal"',
      description: "绕行边缘光与外晕的色调。",
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
      name: "speed",
      type: "number",
      defaultValue: "1",
      description: "绕行速度的倍数。",
    },
    {
      name: "glow",
      type: "boolean",
      defaultValue: "true",
      description: "是否带一圈静态的微光。",
    },
  ],
  accessibility: ["边缘光是纯装饰，对辅助技术隐藏。", "用户要求减少动态效果时光停止绕行。"],
};
