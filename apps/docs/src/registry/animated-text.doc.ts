import AnimatedTextBasicDemo from "@/demos/animated-text/basic";
import AnimatedTextHeadlineDemo from "@/demos/animated-text/headline";
import AnimatedTextVariantsDemo from "@/demos/animated-text/variants";
import type { ComponentDoc } from "./registry.types";

export const ANIMATED_TEXT_DOC: ComponentDoc = {
  slug: "animated-text",
  name: "Animated Text",
  description:
    "克制的排版微动效组件，支持逐段显现（fade-up / blur-in / slide / wave）、短语轮播切换与 AI 思考流光扫掠。",
  category: "motion",
  registryName: "animated-text",
  dependencies: ["motion", "clsx", "tailwind-merge"],
  usage: `import { AnimatedText } from "@/components/ui/animated-text";

<AnimatedText mode="cycle" variant="blur-in" tone="signal" phrases={["设计系统", "AI 工作台"]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "显现、轮播与流光",
      description: "三种排版动效模式配合语义色调与字号档位，自动响应系统减弱动效设置。",
      file: "animated-text/basic.tsx",
      Demo: AnimatedTextBasicDemo,
    },
    {
      slug: "headline",
      name: "Hero 标题多词轮播切换",
      description: '使用 mode="cycle" 与 variant="wave" 定时切换核心价值关键词。',
      file: "animated-text/headline.tsx",
      Demo: AnimatedTextHeadlineDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "四种排版编排风格对比",
      description: "交互切换 fade-up / blur-in / slide / wave 编排，点击重播直观感受节奏差异。",
      file: "animated-text/variants.tsx",
      Demo: AnimatedTextVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "mode",
      type: '"reveal" | "cycle" | "shimmer"',
      defaultValue: '"reveal"',
      description: "排版动效模式：逐段显现、短语轮播或流光思考。",
    },
    {
      name: "variant",
      type: '"fade-up" | "blur-in" | "slide" | "wave"',
      defaultValue: '"fade-up"',
      description: "reveal 与 cycle 模式下的动效编排风格。",
    },
    {
      name: "tone",
      type: '"default" | "muted" | "signal" | "emerald"',
      defaultValue: '"default"',
      description: "双主题对比度达标的语义文字色调（shimmer 模式默认 muted）。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: "继承父级",
      description: "可选排版字号与字距预设。",
    },
    { name: "text", type: "string", defaultValue: '""', description: "静态显现或流光文本。" },
    {
      name: "phrases",
      type: "string[]",
      defaultValue: "[]",
      description: "cycle 模式轮播短语列表。",
    },
    {
      name: "intervalMs",
      type: "number",
      defaultValue: "2400",
      description: "cycle 模式短语轮播间隔（毫秒）。",
    },
    {
      name: "staggerMs",
      type: "number",
      defaultValue: "32",
      description: "reveal 模式逐段错峰延迟（毫秒）。",
    },
  ],
  accessibility: [
    "reveal 模式通过 sr-only 保留完整无拆分文本，视觉逐词节点标记 aria-hidden 避免辅助技术断句。",
    "减弱动效偏好（prefers-reduced-motion）开启时自动停止轮播与流光扫掠，立即静态呈现。",
  ],
};
