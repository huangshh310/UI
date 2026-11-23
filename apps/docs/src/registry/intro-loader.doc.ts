import IntroLoaderBasicDemo from "@/demos/intro-loader/basic";
import IntroLoaderMinimalDemo from "@/demos/intro-loader/minimal";
import IntroLoaderSpotlightDemo from "@/demos/intro-loader/spotlight";
import type { ComponentDoc } from "./registry.types";

export const INTRO_LOADER_DOC: ComponentDoc = {
  slug: "intro-loader",
  name: "Intro Loader",
  description:
    "极简磨砂品牌首屏入场遮罩，支持柔焦字标轮播、default / minimal / spotlight 三种幕布风格、信号蓝进度条与减弱动效立即跳过。",
  category: "overlays",
  registryName: "intro-loader",
  dependencies: ["motion"],
  usage: `import { IntroLoader } from "@/components/ui/intro-loader";

<IntroLoader active={loading} variant="spotlight" tone="signal" onComplete={() => setLoading(false)} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "内联首屏过渡预览",
      description: "支持随时点击跳过或按 Escape 退出，不阻塞首屏访问。",
      file: "intro-loader/basic.tsx",
      Demo: IntroLoaderBasicDemo,
    },
    {
      slug: "minimal",
      name: "可重播品牌标语过场",
      description: "以非全屏容器模式演示三段品牌文案编排与重播触发控制。",
      file: "intro-loader/minimal.tsx",
      Demo: IntroLoaderMinimalDemo,
      directory: false,
    },
    {
      slug: "spotlight",
      name: "Spotlight 柔光品牌幕布",
      description: '结合 variant="spotlight"、tone="signal" 与 subtitle 副标题呈现品牌发布过场。',
      file: "intro-loader/spotlight.tsx",
      Demo: IntroLoaderSpotlightDemo,
      directory: false,
    },
  ],
  api: [
    { name: "active", type: "boolean", defaultValue: "必填", description: "是否处于播放激活状态" },
    {
      name: "greetings",
      type: "IntroGreeting[]",
      defaultValue: "中英法品牌词",
      description: "轮播字标序列（可选 lang 胶囊标号）",
    },
    {
      name: "variant / tone",
      type: '"default" | "minimal" | "spotlight" / "neutral" | "signal"',
      defaultValue: '"default" / "neutral"',
      description: "幕布视觉风格与进度条色调",
    },
    {
      name: "subtitle / skipLabel",
      type: "string",
      defaultValue: '— / "跳过 · ESC"',
      description: "底部品牌说明与跳过按钮文案",
    },
    {
      name: "durationMs / fullscreen / skippable",
      type: "number / boolean / boolean",
      defaultValue: "2400 / true / true",
      description: "总播放时长（毫秒）、全屏覆盖与允许跳过控制",
    },
  ],
  accessibility: [
    "检测到 prefers-reduced-motion: reduce 时立即触发 onComplete，跳过整段过场动画。",
  ],
};
