import AiDiffReviewBasicDemo from "@/demos/ai-diff-review/basic";
import AiDiffReviewConfigDemo from "@/demos/ai-diff-review/config";
import type { ComponentDoc } from "./registry.types";

export const AI_DIFF_REVIEW_DOC: ComponentDoc = {
  slug: "ai-diff-review",
  name: "AI Diff Review",
  description: "AI 代码与配置变更行级审阅卡片，支持单行勾选采纳与一键应用。",
  category: "ai",
  registryName: "ai-diff-review",
  dependencies: ["lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiDiffReview } from "@/components/ui/ai-diff-review";

export function Example() {
  return <AiDiffReview />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "行级勾选采纳与一键应用变更",
      description: "新增行与删除行均可独立勾选或取消，底部实时统计待应用的变更数量。",
      file: "ai-diff-review/basic.tsx",
      Demo: AiDiffReviewBasicDemo,
    },
    {
      slug: "config",
      name: "JSON 清单变更审阅",
      description: "传入自定义 fileName 与 lines 数组审阅配置文件增删。",
      file: "ai-diff-review/config.tsx",
      Demo: AiDiffReviewConfigDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "fileName",
      type: "string",
      defaultValue: '"packages/tokens/src/scales/shadows.css"',
      description: "目标文件路径",
    },
    { name: "lines", type: "AiDiffLine[]", defaultValue: "内置示例", description: "Diff 行数组" },
    {
      name: "onApply",
      type: "(acceptedLineIds: string[]) => void",
      defaultValue: "—",
      description: "应用变更回调",
    },
  ],
  accessibility: ["每条变更行同时提供 + / - 符号前缀、行号与带独立 aria-label 的复选框。"],
};
