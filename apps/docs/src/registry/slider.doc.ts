import SliderBasicDemo from "@/demos/slider/basic";
import SliderRangeDemo from "@/demos/slider/range";
import type { ComponentDoc } from "./registry.types";

export const SLIDER_DOC: ComponentDoc = {
  slug: "slider",
  name: "Slider",
  description: "基于 Base UI Slider 的单滑块与区间双滑块，带钴蓝激活轨道、刻度与读数。",
  category: "navigation",
  registryName: "slider",
  dependencies: ["@base-ui/react"],
  usage: `import { Slider } from "@/components/ui/slider";

<Slider label="音量" defaultValue={60} showValue />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "单值与区间双滑块",
      description: "支持格式化等宽读数、自定义步长与底部刻度标记。",
      file: "slider/basic.tsx",
      Demo: SliderBasicDemo,
    },
    {
      slug: "range",
      name: "双端点预算区间滑块",
      description: "传入区间数组与刻度标记，支持拖拽两端游标或键盘方向键精确微调。",
      file: "slider/range.tsx",
      Demo: SliderRangeDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "value",
      type: "number | [number, number]",
      defaultValue: "—",
      description: "受控单值或区间",
    },
    {
      name: "min / max / step",
      type: "number",
      defaultValue: "0 / 100 / 1",
      description: "数值边界与步进",
    },
    { name: "marks", type: "SliderMark[]", defaultValue: "—", description: "底部刻度标签" },
  ],
  accessibility: ["每个滑块端点均具名并支持方向键、PageUp/PageDown 与 Home/End 键盘微调。"],
};
