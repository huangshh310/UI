"use client";

/**
 * 示例：AiAgentActivity 无框内联模式（variant="ghost" + compact + collapsible），自然嵌入助手消息流。
 */
import { AiAgentActivity, type AiAgentActivityItemData } from "@matt-ui/motion";

const INLINE_STEPS: AiAgentActivityItemData[] = [
  {
    id: "r1",
    type: "reading",
    title: "读取 packages/tokens/src/themes/neutral.css",
    status: "success",
    duration: "42ms",
  },
  {
    id: "r2",
    type: "database_query",
    title: "检索对比度历史回归快照",
    status: "success",
    duration: "110ms",
    details: { output: "近 7 次构建无对比度回归记录。" },
  },
  {
    id: "r3",
    type: "failed",
    title: "推送预览环境（缺少凭证）",
    description: "已跳过部署步骤，保留本地构建产物",
    status: "error",
    duration: "18ms",
  },
];

export default function AiAgentActivityInlineDemo() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-solid border-border/80 bg-card/60 p-2 dark:border-white/10">
      <AiAgentActivity
        variant="ghost"
        compact
        collapsible
        showTypeBadge
        title="已执行 3 个工具步骤"
        activities={INLINE_STEPS}
      />
    </div>
  );
}
