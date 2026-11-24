import AiTestResultsBasicDemo from "@/demos/ai-test-results/basic";
import type { ComponentDoc } from "./registry.types";

export const AI_TEST_RESULTS_DOC: ComponentDoc = {
  slug: "ai-test-results",
  name: "AI Test Results",
  description:
    "对标 HextaUI Test Results 的智能体测试报告面板，支持通过/失败/跳过汇总、状态筛选胶囊、文件分组与失败断言 Expected/Received Diff。",
  category: "ai",
  registryName: "ai-test-results",
  dependencies: ["class-variance-authority", "lucide-react"],
  createdAt: "2026-11-24",
  usage: `import { AiTestResults } from "@/components/ui/ai-test-results";

export function Example() {
  return <AiTestResults />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "测试汇总、状态筛选与断言 Diff",
      description:
        "汇总通过/失败/跳过计数与耗时，支持按全部/失败/跳过/慢速筛选，失败用例默认展开并高亮 Expected / Received 差异。",
      file: "ai-test-results/basic.tsx",
      Demo: AiTestResultsBasicDemo,
    },
  ],
  api: [
    {
      name: "files",
      type: "AiTestFile[]",
      defaultValue: "内置测试报告示例",
      description: "按文件组织的测试用例与失败断言 Diff 列表",
    },
    {
      name: "summary",
      type: "AiTestRunSummary",
      defaultValue: "自动聚合",
      description: "可选自定义总通过/失败/跳过数与耗时",
    },
    {
      name: "slowThresholdMs",
      type: "number",
      defaultValue: "200",
      description: "归类为“慢速”筛选桶的耗时阈值（毫秒）",
    },
    {
      name: "variant",
      type: '"card" | "seamless"',
      defaultValue: '"card"',
      description: "容器视觉变体（卡片或无缝嵌入）",
    },
    {
      name: "onCopy",
      type: "(summaryText: string) => void",
      defaultValue: "—",
      description: "点击复制测试报告摘要回调",
    },
  ],
  accessibility: [
    "状态筛选按钮放在带语义标注的 fieldset 中并暴露 aria-pressed；各文件与用例折叠节点均提供 aria-expanded。",
  ],
};
