import AiLoadingStateBasicDemo from "@/demos/ai-loading-state/basic";
import type { ComponentDoc } from "./registry.types";

export const AI_LOADING_STATE_DOC: ComponentDoc = {
  slug: "ai-loading-state",
  name: "AiLoadingState",
  description:
    "对标 BeautifulUI 01 Loading State 的 3×3 像素矩阵智能体加载指示器，支持 drive、dots、orbit、surfer 四种单色编排与实时等宽计时器。",
  category: "ai",
  registryName: "ai-loading-state",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  createdAt: "2026-11-24",
  usage: `import { AiLoadingState } from "@/components/ui/ai-loading-state";

export function Example() {
  return <AiLoadingState pattern="orbit" label="推演中" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "像素矩阵编排与实时计时",
      description: "在 Drive、Dots、Orbit、Surfer 四种 3×3 矩阵韵律间切换，对比内联与胶囊形态。",
      file: "ai-loading-state/basic.tsx",
      Demo: AiLoadingStateBasicDemo,
    },
  ],
  api: [
    {
      name: "pattern",
      type: '"drive" | "dots" | "orbit" | "surfer"',
      defaultValue: '"drive"',
      description: "3×3 像素矩阵的运动编排模式。",
    },
    {
      name: "variant / size",
      type: '"inline" | "pill" / "sm" | "md" | "lg"',
      defaultValue: '"inline" / "md"',
      description: "无框内联或圆角微边框胶囊外观与尺寸阶梯。",
    },
    {
      name: "label / showElapsed / elapsedSeconds",
      type: "string / boolean / number",
      defaultValue: '"思考中" / true / 自动递增',
      description: "状态动词文案、是否显示等宽计时器与受控耗时秒数。",
    },
    {
      name: "paused",
      type: "boolean",
      defaultValue: "false",
      description: "暂停像素矩阵动效与耗时计时。",
    },
  ],
  accessibility: [
    '使用语义化 <output aria-live="polite"> 播报加载状态，像素矩阵标记 aria-hidden。',
    "计时数字采用 tabular-nums 等宽字形，避免实时刷新引起横向抖动。",
  ],
};
