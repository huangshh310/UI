import ThinkingOrbBasicDemo from "@/demos/thinking-orb/basic";
import ThinkingOrbStatesDemo from "@/demos/thinking-orb/states";
import type { ComponentDoc } from "./registry.types";

export const THINKING_ORB_DOC: ComponentDoc = {
  slug: "thinking-orb",
  name: "ThinkingOrb",
  description:
    "纯单色 3D 球面粒子思考球，基于 Canvas 黄金螺旋采样实现 9 种 AI 认知状态，自动适配深浅主题并支持离屏暂停。",
  category: "ai",
  registryName: "thinking-orb",
  dependencies: [],
  createdAt: "2026-11-23",
  usage: `import { ThinkingOrb } from "@/components/ui/thinking-orb";

export function Example() {
  return <ThinkingOrb state="searching" size={72} />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "3D 球面粒子认知态切换",
      description: "点击底部状态胶囊，观察 3D 球面粒子群在 5 种典型 AI 认知态间的丝滑运动。",
      file: "thinking-orb/basic.tsx",
      Demo: ThinkingOrbBasicDemo,
    },
    {
      slug: "states",
      name: "全部 9 种认知状态矩阵",
      description: "完整预览 working、searching、solving、listening、connecting 等 9 种物理编排。",
      file: "thinking-orb/states.tsx",
      Demo: ThinkingOrbStatesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "state",
      type: '"working" | "searching" | "solving" | "listening" | "connecting" | "weaving" | "composing" | "breathing" | "shaping"',
      defaultValue: '"working"',
      description: "粒子群当前的认知运动形态",
    },
    { name: "size", type: "number", defaultValue: "64", description: "正方形画布边长（像素）" },
    { name: "speed", type: "number", defaultValue: "1", description: "时间推进倍速" },
    {
      name: "dark",
      type: "boolean",
      defaultValue: "自动跟随主题",
      description: "显式指定深浅背景极性；留空时监听 html[data-theme]",
    },
    {
      name: "paused",
      type: "boolean",
      defaultValue: "false",
      description: "暂停动画循环并定格当前帧",
    },
  ],
  accessibility: [
    "使用语义化 <output> 标签承载状态并自动生成中文 aria-label，内部 <canvas> 标记 aria-hidden。",
    "自动响应 prefers-reduced-motion 与 IntersectionObserver 视口可见性，节省能耗。",
  ],
};
