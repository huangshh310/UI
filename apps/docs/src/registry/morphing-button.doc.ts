/**
 * Morphing Button 的文档数据。
 */
import { MorphingButtonBasic } from "@/demos/morphing-button/basic";
import MorphingButtonErrorDemo from "@/demos/morphing-button/error";
import type { ComponentDoc } from "./registry.types";

export const MORPHING_BUTTON_DOC: ComponentDoc = {
  slug: "morphing-button",
  name: "Morphing Button",
  description: "在待操作、处理中、成功、失败四个阶段之间平滑变形的按钮。",
  category: "buttons",
  registryName: "morphing-button",
  dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
  usage: `import { MorphingButton } from "@/components/ui/morphing-button";

export function Demo() {
  return <MorphingButton status={status} onClick={save} />;
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "morphing-button-basic",
      name: "阶段变形",
      description: "点击后依次经过处理中与成功，宽度平滑过渡。",
      file: "morphing-button/basic.tsx",
      Demo: MorphingButtonBasic,
    },
    {
      slug: "error",
      name: "加载失败态与重试流程",
      description: "演示 idle → loading → error 形态转换及一键重置闭环。",
      file: "morphing-button/error.tsx",
      Demo: MorphingButtonErrorDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "status",
      type: `"idle" | "loading" | "success" | "error"`,
      defaultValue: "-",
      description: "当前阶段，由调用方控制。",
    },
    {
      name: "labels",
      type: "Partial<Record<Status, string>>",
      defaultValue: "-",
      description: "各阶段的文字。",
    },
  ],
  accessibility: [
    "可访问名称始终是当前阶段的文字，阶段变化会被播报。",
    "处理中声明 aria-busy，并且不响应点击。",
    "用户要求减少动态效果时只做淡入淡出。",
  ],
};
