import SliderBasicDemo from "@/demos/slider/basic";
import SliderRangeDemo from "@/demos/slider/range";
import SliderTonesDemo from "@/demos/slider/tones";
import type { ComponentDoc } from "./registry.types";

export const SLIDER_DOC: ComponentDoc = {
  slug: "slider",
  name: "Slider",
  description:
    "基于 Base UI Slider 的精密滑块与区间双滑块，支持 sm / md / lg 尺寸、default / signal / emerald 色调、浮动数值气泡与刻度标记。",
  category: "navigation",
  registryName: "slider",
  dependencies: ["@base-ui/react", "class-variance-authority"],
  usage: `import { Slider } from "@/components/ui/slider";

<Slider label="音量" tone="signal" defaultValue={60} showValue showTooltip />`,
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
      slug: "tones",
      name: "多尺寸、色调与浮动读数气泡",
      description: "展示 sm / md / lg 轨道粗细、signal 与 emerald 激活色调及拖拽实时数值气泡。",
      file: "slider/tones.tsx",
      Demo: SliderTonesDemo,
      directory: false,
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
      name: "size / tone",
      type: '"sm" | "md" | "lg" / "default" | "signal" | "emerald"',
      defaultValue: '"md" / "default"',
      description: "轨道粗细与激活轨道色调",
    },
    {
      name: "showValue / showTooltip",
      type: "boolean",
      defaultValue: "false / false",
      description: "是否在顶部显示读数徽章或在滑块上方显示悬浮气泡",
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
