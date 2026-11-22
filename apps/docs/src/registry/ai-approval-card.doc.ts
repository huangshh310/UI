import AiApprovalCardBasicDemo from "@/demos/ai-approval-card/basic";
import AiApprovalCardHighRiskDemo from "@/demos/ai-approval-card/high-risk";
import type { ComponentDoc } from "./registry.types";

export const AI_APPROVAL_CARD_DOC: ComponentDoc = {
  slug: "ai-approval-card",
  name: "AI Approval Card",
  description: "人机协同（Human-in-the-Loop）敏感动作审批与问卷确认卡片。",
  category: "ai",
  registryName: "ai-approval-card",
  dependencies: ["lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiApprovalCard } from "@/components/ui/ai-approval-card";

export function Example() {
  return <AiApprovalCard title="授权执行生产迁移脚本" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "命令授权与审计折叠反馈",
      description: "点选授权策略后点击批准或拒绝，卡片自动收起为带重审入口的已审计横幅。",
      file: "ai-approval-card/basic.tsx",
      Demo: AiApprovalCardBasicDemo,
    },
    {
      slug: "high-risk",
      name: "高危生产数据库变更审批",
      description: '通过 riskLevel="high" 与自定义 options 呈现高危操作分级保护。',
      file: "ai-approval-card/high-risk.tsx",
      Demo: AiApprovalCardHighRiskDemo,
      directory: false,
    },
  ],
  api: [
    { name: "title", type: "string", defaultValue: "必填", description: "审批标题" },
    {
      name: "description",
      type: "string",
      defaultValue: "内置默认说明",
      description: "补充背景说明",
    },
    { name: "command", type: "string", defaultValue: "内置示例", description: "待执行命令预览" },
    {
      name: "riskLevel",
      type: '"low" | "medium" | "high"',
      defaultValue: '"medium"',
      description: "风险级别",
    },
    {
      name: "options",
      type: "AiApprovalOption[]",
      defaultValue: "内置 2 项",
      description: "授权策略选项",
    },
    {
      name: "onApprove",
      type: "(optionId: string) => void",
      defaultValue: "—",
      description: "批准执行回调",
    },
    {
      name: "onReject",
      type: "() => void",
      defaultValue: "—",
      description: "拒绝执行回调",
    },
  ],
  accessibility: ["每个策略选项均为带 aria-pressed 的独立按钮，支持纯键盘 Tab 与空格/回车选择。"],
};
