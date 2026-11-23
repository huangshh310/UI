"use client";

import { AiAgentPlan } from "@matt-ui/motion";

export default function AiAgentPlanResearchDemo() {
  return (
    <div className="w-full max-w-2xl">
      <AiAgentPlan
        variant="timeline"
        title="深度设计调研管线"
        subtitle="Research Agent · 3 个工具调用"
        initialSteps={[
          {
            id: "r1",
            title: "采集 14 个主流 C 端组件站配色与光影",
            detail: "已归档对比度与圆角梯度基线",
            tool: "browser_inspect",
            duration: "1.4s",
            status: "completed",
          },
          {
            id: "r2",
            title: "建立柔润瓷白与深曜石双主题 OKLCH 令牌",
            detail: "前景与背景对比度全部高于 4.5:1",
            tool: "edit_tokens",
            duration: "0.8s",
            status: "completed",
          },
          {
            id: "r3",
            title: "实机截图核验组件对比度与留白层次",
            detail: "正在校验深浅双主题下的焦点环与边框层级",
            tool: "visual_audit",
            status: "running",
          },
        ]}
      />
    </div>
  );
}
