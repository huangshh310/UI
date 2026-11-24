import ThinkingOrbBasicDemo from "@/demos/thinking-orb/basic";
import ThinkingOrbStatesDemo from "@/demos/thinking-orb/states";
import ThinkingOrbVariantsDemo from "@/demos/thinking-orb/variants";
import type { ComponentDoc } from "./registry.types";

export const THINKING_ORB_DOC: ComponentDoc = {
  slug: "thinking-orb",
  name: "ThinkingOrb",
  description:
    "3D 光学水晶星尘思考球，基于 Canvas 分层光学渲染实现 9 种 AI 认知态的色温与形态平滑演进，支持精密刻度表圈、双环氛围光晕与微光状态胶囊。",
  category: "ai",
  registryName: "thinking-orb",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  createdAt: "2026-11-23",
  usage: `import { ThinkingOrb } from "@/components/ui/thinking-orb";

export function Example() {
  return <ThinkingOrb state="searching" variant="halo" size={72} showLabel />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "3D 球面粒子认知态切换",
      description: "点击底部毛玻璃状态胶囊，观察 3D 球面粒子群在 5 种典型 AI 认知态间的丝滑运动。",
      file: "thinking-orb/basic.tsx",
      Demo: ThinkingOrbBasicDemo,
    },
    {
      slug: "variants",
      name: "外观变体与内联状态胶囊",
      description: "对比 minimal 无框、framed 玻璃表圈与 halo 柔光环，及右侧状态标签组合。",
      file: "thinking-orb/variants.tsx",
      Demo: ThinkingOrbVariantsDemo,
      directory: false,
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
      description: "粒子群当前的认知运动形态。",
    },
    {
      name: "variant",
      type: '"minimal" | "framed" | "halo"',
      defaultValue: '"minimal"',
      description: "外观风格：无框纯粒子、毛玻璃表圈或柔光氛围环。",
    },
    {
      name: "size / speed",
      type: "number / number",
      defaultValue: "64 / 1",
      description: "画布直径（像素）与动画时间推进倍速。",
    },
    {
      name: "showLabel / label / labelPlacement",
      type: 'boolean / string / "bottom" | "right"',
      defaultValue: 'false / - / "bottom"',
      description: "是否展示带脉冲点的认知状态胶囊、自定义文案与排布方位。",
    },
    {
      name: "interactive",
      type: "boolean",
      defaultValue: "false",
      description: "是否启用悬浮微放大与发丝边框高亮。",
    },
    {
      name: "dark / paused",
      type: "boolean / boolean",
      defaultValue: "自动跟随主题 / false",
      description: "强制指定深浅粒子极性，或暂停动画循环定格当前帧。",
    },
  ],
  accessibility: [
    "使用语义化 <output> 标签承载状态并自动生成中文 aria-label，内部 <canvas> 标记 aria-hidden。",
    "自动响应 prefers-reduced-motion 与 IntersectionObserver 视口可见性，离屏时停止重绘。",
  ],
};
