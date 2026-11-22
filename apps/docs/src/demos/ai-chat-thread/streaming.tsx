"use client";

import { AiChatThread } from "@matt-ui/ui";

export default function AiChatThreadStreamingDemo() {
  return (
    <AiChatThread
      initialMessages={[
        {
          id: "c1",
          role: "user",
          content: "帮我检查当前 shadcn Registry 清单里新增了哪些 AI 组件。",
          timestamp: "10:15",
        },
        {
          id: "c2",
          role: "assistant",
          model: "Matt Flash · 128K",
          timestamp: "10:15",
          content:
            "本次共收录 15 款 AI 与智能体组件及 2 套全宽 AI 区块，覆盖对话线程、极光状态球、语音舞台、任务规划、护栏审批、代码 Diff 审阅与视觉生成画布。",
        },
      ]}
      followUps={["导出 Registry 依赖图", "运行双主题 axe 审计"]}
    />
  );
}
