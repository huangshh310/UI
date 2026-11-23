import ShimmerBasicDemo from "@/demos/shimmer/basic";
import ShimmerLinesDemo from "@/demos/shimmer/lines";
import type { ComponentDoc } from "./registry.types";

export const SHIMMER_DOC: ComponentDoc = {
  slug: "shimmer",
  name: "Shimmer",
  description: "面向 AI 流式等待态的微光扫掠文字与首字到达前多行骨架原语。",
  category: "ai",
  registryName: "shimmer",
  dependencies: ["clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import { Shimmer, ShimmerLines } from "@/components/ui/shimmer";

export function Example() {
  return <Shimmer>正在深度推理…</Shimmer>;
}`,
  specimens: [
    {
      slug: "basic",
      name: "流式微光状态文案",
      description: "底层保持实色对比度，表层扫掠柔和光泽，完美契合推理与检索等待提示。",
      file: "shimmer/basic.tsx",
      Demo: ShimmerBasicDemo,
    },
    {
      slug: "lines",
      name: "多行流式段落骨架",
      description: "首字 Token 尚未到达时的多行错落流式骨架，内置忙碌播报语义。",
      file: "shimmer/lines.tsx",
      Demo: ShimmerLinesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "as",
      type: '"span" | "p" | "div"',
      defaultValue: '"span"',
      description: "渲染的语义元素标签。",
    },
    {
      name: "active",
      type: "boolean",
      defaultValue: "true",
      description: "是否启用微光扫掠动画；关闭时退化为静态次要文本。",
    },
    {
      name: "lines (ShimmerLines)",
      type: "number",
      defaultValue: "3",
      description: "流式段落占位行数（1–8）。",
    },
  ],
  accessibility: [
    "光泽装饰层标记 aria-hidden，屏幕阅读器仅读取一次真实文本，避免重复播报且保障双主题 >= 4.5:1 对比度。",
    "ShimmerLines 声明 role='status' 与 aria-busy='true'，开启减少动态效果时自动停用脉冲。",
  ],
};
