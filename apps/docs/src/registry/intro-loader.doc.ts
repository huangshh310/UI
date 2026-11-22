import IntroLoaderBasicDemo from "@/demos/intro-loader/basic";
import IntroLoaderMinimalDemo from "@/demos/intro-loader/minimal";
import type { ComponentDoc } from "./registry.types";

export const INTRO_LOADER_DOC: ComponentDoc = {
  slug: "intro-loader",
  name: "Intro Loader",
  description: "极简品牌首屏入场遮罩，带柔焦字标轮播、钴蓝细进度条与减弱动效立即跳过。",
  category: "overlays",
  registryName: "intro-loader",
  dependencies: ["motion"],
  usage: `import { IntroLoader } from "@/components/ui/intro-loader";

<IntroLoader active={loading} onComplete={() => setLoading(false)} />`,
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
  ],
  api: [
    { name: "active", type: "boolean", defaultValue: "必填", description: "是否处于播放激活状态" },
    {
      name: "greetings",
      type: "IntroGreeting[]",
      defaultValue: "中英法品牌词",
      description: "轮播字标序列",
    },
    { name: "durationMs", type: "number", defaultValue: "2400", description: "总播放时长（毫秒）" },
    { name: "fullscreen", type: "boolean", defaultValue: "true", description: "是否全屏覆盖" },
    {
      name: "skippable",
      type: "boolean",
      defaultValue: "true",
      description: "是否允许点击或 Esc 跳过",
    },
  ],
  accessibility: [
    "检测到 prefers-reduced-motion: reduce 时立即触发 onComplete，跳过整段过场动画。",
  ],
};
