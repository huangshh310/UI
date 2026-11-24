"use client";

import { AiChatThread } from "@matt-ui/ui";

export default function AiChatThreadStreamingDemo() {
  return (
    <AiChatThread
      className="max-w-2xl"
      variant="compact"
      initialMessages={[
        {
          id: "c1",
          role: "user",
          content: "帮我检查本次 AI 组件升级里有哪些交互细节需要注意。",
          timestamp: "10:15",
        },
        {
          id: "c2",
          role: "assistant",
          model: "Matt Pro · 200K",
          meta: "0.9s · 184 tok",
          timestamp: "10:15",
          streaming: true,
          content:
            "正在核对 11 个 AI 组件的发丝边框层级、自适应语义代码表面以及单层内嵌焦点环规范，审批按钮与分支切换均已保持 100% 向后兼容…",
        },
      ]}
      followUps={["导出变更清单", "运行双主题 axe 审计"]}
    />
  );
}
