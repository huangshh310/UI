import ContextBasicDemo from "@/demos/context/basic";
import ContextCompactDemo from "@/demos/context/compact";
import ContextInlineDemo from "@/demos/context/inline";
import type { ComponentDoc } from "./registry.types";

export const CONTEXT_DOC: ComponentDoc = {
  slug: "context",
  name: "Context",
  description:
    "AI 上下文窗口环形进度微胶囊与毛玻璃分段 Token 预算检查器，支持分段高亮、剩余余量预警与一键压缩。",
  category: "ai",
  registryName: "context",
  dependencies: [
    "@base-ui/react",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  createdAt: "2026-11-23",
  usage: `import { Context } from "@/components/ui/context";

export function Example() {
  return <Context modelName="matt-pro" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "环形上下文微胶囊与浮层明细",
      description:
        "平时仅占胶囊大小，接近上限时自动切换预警语义色，点击展开毛玻璃分段明细与压缩操作。",
      file: "context/basic.tsx",
      Demo: ContextBasicDemo,
    },
    {
      slug: "inline",
      name: "内联展开明细面板",
      description: "通过 variant='inline' 与 surface='glass' 直接平铺堆叠进度条与可交互分段图例。",
      file: "context/inline.tsx",
      Demo: ContextInlineDemo,
      directory: false,
    },
    {
      slug: "compact",
      name: "工具栏紧凑胶囊与高水位预警",
      description: "展示 size='sm'、subtle/glass 表面以及 85%+ 占用时的自动告警提示。",
      file: "context/compact.tsx",
      Demo: ContextCompactDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "maxTokens / segments",
      type: "number / ContextSegment[]",
      defaultValue: "200000 / 内置 4 组语义分段",
      description: "模型上下文窗口容量上限与各分段 Token 占用明细。",
    },
    {
      name: "variant / size / surface",
      type: '"pill" | "inline" / "sm" | "md" / "default" | "subtle" | "glass"',
      defaultValue: '"pill" / "md" / "default"',
      description: "展示形态、密度与表面材质风格。",
    },
    {
      name: "modelName / costLabel / showCost",
      type: "string / string / boolean",
      defaultValue: '- / "~$0.024" / true',
      description: "可选当前模型标识、会话预估成本徽章及其显隐开关。",
    },
    {
      name: "compactable / onCompact",
      type: "boolean / (savedTokens: number) => void",
      defaultValue: "true / —",
      description: "是否允许一键压缩上下文，以及压缩触发时回传释放的 Token 数量。",
    },
  ],
  accessibility: [
    "触发器动态播报上下文占用百分比（如「上下文窗口占用 64%」），进度环纯装饰层隐藏于屏幕阅读器。",
    "分段图例按钮暴露 aria-pressed，支持纯键盘聚焦切换分段对比高亮，全部交互采用统一单层焦点环。",
  ],
};
