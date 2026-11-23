import NumberFlowBasicDemo from "@/demos/number-flow/basic";
import NumberFlowMetricsDemo from "@/demos/number-flow/metrics";
import NumberFlowSizesAndTrendsDemo from "@/demos/number-flow/sizes-and-trends";
import type { ComponentDoc } from "./registry.types";

export const NUMBER_FLOW_DOC: ComponentDoc = {
  slug: "number-flow",
  name: "Number Flow",
  description:
    "金融与仪表盘等宽滚轮数字组件，按数值增减自动切换滚动方向，支持多档字号、趋势着色与边缘柔化遮罩。",
  category: "motion",
  registryName: "number-flow",
  dependencies: ["motion", "clsx", "tailwind-merge"],
  usage: `import { NumberFlow } from "@/components/ui/number-flow";

<NumberFlow value={4890} prefix="¥" suffix="/月" size="xl" trend="up" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "方向感知按位滚轮数字",
      description:
        "支持 Intl.NumberFormat 格式化、前后缀精雕排版，以及随数值增减自适应的上下滚动。",
      file: "number-flow/basic.tsx",
      Demo: NumberFlowBasicDemo,
    },
    {
      slug: "metrics",
      name: "实时吞吐量滚轮计数器",
      description: "带单位后缀与趋势着色的整数滚轮过渡，适合实时监控看板与指标卡片。",
      file: "number-flow/metrics.tsx",
      Demo: NumberFlowMetricsDemo,
      directory: false,
    },
    {
      slug: "sizes-and-trends",
      name: "四档排版字号与趋势语义色",
      description: "展示 sm / md / lg / xl 四种字号与 neutral / up / down 三种趋势色调组合。",
      file: "number-flow/sizes-and-trends.tsx",
      Demo: NumberFlowSizesAndTrendsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "value",
      type: "number",
      defaultValue: "必填",
      description: "目标数值，变化时触发按位滚动。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: "等宽数字排版字号档位。",
    },
    {
      name: "trend",
      type: '"neutral" | "up" | "down"',
      defaultValue: '"neutral"',
      description: "趋势语义着色（默认前景、涨绿、跌红）。",
    },
    {
      name: "format",
      type: "Intl.NumberFormatOptions",
      defaultValue: "—",
      description: "Intl 格式化选项（货币、百分比、小数位）。",
    },
    {
      name: "locales",
      type: "string",
      defaultValue: '"zh-CN"',
      description: "区域格式化语言代码。",
    },
    {
      name: "prefix / suffix",
      type: "string",
      defaultValue: "—",
      description: "静态前后缀符号或单位，自动缩比对齐基线。",
    },
  ],
  accessibility: [
    "屏幕阅读器直接读取完整格式化数值文本（sr-only），视觉拆位滚轮标记为 aria-hidden 避免逐字朗读。",
    "遵循系统 prefers-reduced-motion 偏好，减弱动效时关闭垂直位移改为瞬时更新。",
  ],
};
