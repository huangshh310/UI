import AiDiffReviewBasicDemo from "@/demos/ai-diff-review/basic";
import AiDiffReviewConfigDemo from "@/demos/ai-diff-review/config";
import type { ComponentDoc } from "./registry.types";

export const AI_DIFF_REVIEW_DOC: ComponentDoc = {
  slug: "ai-diff-review",
  name: "AI Diff Review",
  description:
    "AI 代码与配置变更行级审阅卡片，支持曜石暗色/自适应双差异舞台、单行勾选采纳与一键应用。",
  category: "ai",
  registryName: "ai-diff-review",
  dependencies: ["class-variance-authority", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiDiffReview } from "@/components/ui/ai-diff-review";

export function Example() {
  return <AiDiffReview summary="补充顶部内高光令牌" language="css" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "曜石暗色差异舞台与行级采纳",
      description: "默认在曜石暗色代码视口中呈现新增与删除行，支持逐行勾选与一键应用。",
      file: "ai-diff-review/basic.tsx",
      Demo: AiDiffReviewBasicDemo,
    },
    {
      slug: "config",
      name: "自适应主题 JSON 清单变更审阅",
      description: '使用 theme="adaptive" 跟随宿主浅色/深色主题审阅配置文件增删。',
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
    { name: "summary", type: "string", defaultValue: "—", description: "可选变更意图摘要" },
    { name: "language", type: "string", defaultValue: "—", description: "可选语言角标" },
    {
      name: "theme",
      type: '"obsidian" | "adaptive"',
      defaultValue: '"obsidian"',
      description: "差异视口主题（曜石暗色舞台或自适应宿主主题）",
    },
    { name: "compact", type: "boolean", defaultValue: "false", description: "是否启用紧凑行距" },
    { name: "lines", type: "AiDiffLine[]", defaultValue: "内置示例", description: "Diff 行数组" },
    {
      name: "onApply",
      type: "(acceptedLineIds: string[]) => void",
      defaultValue: "—",
      description: "应用变更回调",
    },
    {
      name: "onRejectAll",
      type: "() => void",
      defaultValue: "—",
      description: "放弃全部变更回调（传入时显示放弃按钮）",
    },
  ],
  accessibility: ["每条变更行同时提供 + / - 符号前缀、行号与带独立 aria-label 的复选框。"],
};
