import ShimmerBasicDemo from "@/demos/shimmer/basic";
import ShimmerLinesDemo from "@/demos/shimmer/lines";
import ShimmerVariantsDemo from "@/demos/shimmer/variants";
import type { ComponentDoc } from "./registry.types";

export const SHIMMER_DOC: ComponentDoc = {
  slug: "shimmer",
  name: "Shimmer",
  description: "面向 AI 流式等待态的微光扫掠文字与首字到达前多行骨架原语，支持胶囊与卡片变体。",
  category: "ai",
  registryName: "shimmer",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import { Shimmer, ShimmerLines } from "@/components/ui/shimmer";

export function Example() {
  return <Shimmer variant="pill" tone="signal">正在深度推理…</Shimmer>;
}`,
  specimens: [
    {
      slug: "basic",
      name: "流式微光状态文案",
      description: "底层保持实色对比度，表层扫掠柔和光泽，支持随时切回静态展示。",
      file: "shimmer/basic.tsx",
      Demo: ShimmerBasicDemo,
    },
    {
      slug: "lines",
      name: "多行流式段落骨架",
      description: "首字 Token 尚未到达时的多行错落流式骨架，支持 card 发丝容器与内置忙碌播报。",
      file: "shimmer/lines.tsx",
      Demo: ShimmerLinesDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "胶囊形态与色调组合",
      description: "组合 pill 形态、muted / foreground / signal 色调与紧凑骨架条。",
      file: "shimmer/variants.tsx",
      Demo: ShimmerVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "as / speed / active",
      type: '"span" | "p" | "div" / "slow" | "normal" | "fast" / boolean',
      defaultValue: '"span" / "normal" / true',
      description: "渲染的语义元素标签、扫掠节奏与是否开启微光。",
    },
    {
      name: "size / tone / variant",
      type: '"xs" | "sm" | "md" / "muted" | "foreground" | "signal" / "default" | "pill"',
      defaultValue: '"xs" / "muted" / "default"',
      description: "字号阶梯、语义色调与是否包裹发丝边框胶囊。",
    },
    {
      name: "lines / size / variant / tone (ShimmerLines)",
      type: 'number / "sm" | "md" | "lg" / "default" | "card" / "muted" | "subtle"',
      defaultValue: '3 / "md" / "default" / "muted"',
      description: "流式段落占位行数（1–8）、条纹粗细密度、卡片包裹与明暗层次。",
    },
  ],
  accessibility: [
    "光泽装饰层标记 aria-hidden，屏幕阅读器仅读取一次真实文本，避免重复播报且保障双主题 >= 4.5:1 对比度。",
    "ShimmerLines 声明 role='status' 与 aria-busy='true'，开启减少动态效果时自动停用脉冲。",
  ],
};
