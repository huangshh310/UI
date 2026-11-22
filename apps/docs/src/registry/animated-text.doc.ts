import AnimatedTextBasicDemo from "@/demos/animated-text/basic";
import AnimatedTextHeadlineDemo from "@/demos/animated-text/headline";
import type { ComponentDoc } from "./registry.types";

export const ANIMATED_TEXT_DOC: ComponentDoc = {
  slug: "animated-text",
  name: "Animated Text",
  description: "克制的排版微动效组件，支持逐段显现、短语轮播切换与 AI 思考流光。",
  category: "motion",
  registryName: "animated-text",
  dependencies: ["motion"],
  usage: `import { AnimatedText } from "@/components/ui/animated-text";

<AnimatedText mode="cycle" phrases={["设计系统", "AI 工作台"]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "显现、轮播与流光",
      description: "三种排版动效模式，自动响应系统减弱动效设置。",
      file: "animated-text/basic.tsx",
      Demo: AnimatedTextBasicDemo,
    },
    {
      slug: "headline",
      name: "Hero 标题多词轮播切换",
      description: '使用 mode="cycle" 定时切换核心价值关键词，并自动尊重减弱动效偏好。',
      file: "animated-text/headline.tsx",
      Demo: AnimatedTextHeadlineDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "mode",
      type: '"reveal" | "cycle" | "shimmer"',
      defaultValue: '"reveal"',
      description: "排版动效模式",
    },
    { name: "text", type: "string", defaultValue: '""', description: "静态或流光文本" },
    {
      name: "phrases",
      type: "string[]",
      defaultValue: "[]",
      description: "cycle 模式轮播短语列表",
    },
  ],
  accessibility: ["完整保留可读文本语义，减弱动效偏好开启时自动停止轮播与闪烁。"],
};
