import ContextBasicDemo from "@/demos/context/basic";
import ContextInlineDemo from "@/demos/context/inline";
import type { ComponentDoc } from "./registry.types";

export const CONTEXT_DOC: ComponentDoc = {
  slug: "context",
  name: "Context",
  description: "AI 上下文窗口环形进度微胶囊与分段 Token 预算浮层检查器，支持分段高亮与一键压缩。",
  category: "ai",
  registryName: "context",
  dependencies: ["@base-ui/react", "lucide-react"],
  createdAt: "2026-11-23",
  usage: `import { Context } from "@/components/ui/context";

export function Example() {
  return <Context />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "环形上下文微胶囊与浮层明细",
      description: "平时仅占胶囊大小，接近上限时自动切换预警语义色，点击展开分段明细与压缩操作。",
      file: "context/basic.tsx",
      Demo: ContextBasicDemo,
    },
    {
      slug: "inline",
      name: "内联展开明细面板",
      description: "通过 variant='inline' 直接平铺堆叠进度条与可交互分段图例。",
      file: "context/inline.tsx",
      Demo: ContextInlineDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "maxTokens",
      type: "number",
      defaultValue: "200000",
      description: "模型上下文窗口容量上限。",
    },
    {
      name: "segments",
      type: "ContextSegment[]",
      defaultValue: "内置 4 组语义分段",
      description: "系统提示、历史对话、检索片段与工具输出各自的 Token 占用。",
    },
    {
      name: "variant",
      type: '"pill" | "inline"',
      defaultValue: '"pill"',
      description: "展示形态：紧凑浮层胶囊或直接内联面板。",
    },
    {
      name: "onCompact",
      type: "(savedTokens: number) => void",
      defaultValue: "—",
      description: "点击压缩上下文时触发，回传节省的 Token 数。",
    },
  ],
  accessibility: [
    "触发器动态播报上下文占用百分比（如「上下文窗口占用 64%」），进度环纯装饰层隐藏于屏幕阅读器。",
    "分段图例按钮暴露 aria-pressed，支持纯键盘聚焦切换分段对比高亮。",
  ],
};
