"use client";

import { AiAgentPlan } from "@matt-ui/motion";

export default function AiAgentPlanResearchDemo() {
  return (
    <AiAgentPlan
      title="深度设计调研管线"
      initialSteps={[
        {
          id: "r1",
          title: "采集 14 个主流 C 端组件站配色与光影",
          tool: "browser_inspect",
          duration: "1.4s",
          status: "completed",
        },
        {
          id: "r2",
          title: "建立柔润瓷白与深曜石双主题 OKLCH 令牌",
          tool: "edit_tokens",
          duration: "0.8s",
          status: "completed",
        },
        {
          id: "r3",
          title: "实机截图核验组件对比度与留白层次",
          tool: "visual_audit",
          status: "running",
        },
      ]}
    />
  );
}
