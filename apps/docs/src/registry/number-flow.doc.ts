import NumberFlowBasicDemo from "@/demos/number-flow/basic";
import NumberFlowMetricsDemo from "@/demos/number-flow/metrics";
import type { ComponentDoc } from "./registry.types";

export const NUMBER_FLOW_DOC: ComponentDoc = {
  slug: "number-flow",
  name: "Number Flow",
  description: "金融与仪表盘滚动数字过渡，按字符位独立弹簧滚轮进出，始终等宽不抖动。",
  category: "motion",
  registryName: "number-flow",
  dependencies: ["motion"],
  usage: `import { NumberFlow } from "@/components/ui/number-flow";

<NumberFlow value={1280} prefix="¥" suffix="/月" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "按位滚轮数字",
      description: "支持 Intl.NumberFormat 货币与百分比格式化，以及前后缀静态保留。",
      file: "number-flow/basic.tsx",
      Demo: NumberFlowBasicDemo,
    },
    {
      slug: "metrics",
      name: "实时吞吐量滚轮计数器",
      description: "带单位后缀与千分位格式化的整数滚轮过渡，适合实时监控看板。",
      file: "number-flow/metrics.tsx",
      Demo: NumberFlowMetricsDemo,
      directory: false,
    },
  ],
  api: [
    { name: "value", type: "number", defaultValue: "必填", description: "目标数值" },
    {
      name: "format",
      type: "Intl.NumberFormatOptions",
      defaultValue: "—",
      description: "Intl 格式化选项",
    },
    { name: "prefix / suffix", type: "string", defaultValue: "—", description: "静态前后缀" },
  ],
  accessibility: ["屏幕阅读器读取完整格式化数值文本（sr-only），视觉字符位拆分为 aria-hidden。"],
};
