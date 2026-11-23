"use client";

import { AiWorkspaceBlock } from "@matt-ui/ui";

const REVIEW_THREADS = [
  {
    id: "r1",
    title: "PR #142 无障碍审查",
    updatedAt: "2 分钟前",
    messages: [
      {
        id: "rm1",
        role: "user" as const,
        content: "检查悬浮 Sheet 在深色模式下的背景对比度与键盘 Escape 返回焦点。",
        timestamp: "14:20",
      },
      {
        id: "rm2",
        role: "assistant" as const,
        content:
          "已确认：Sheet 基于 Base UI Dialog，支持滚锁与关闭焦点还原，四周圆角与 1px 细边框均符合规范。",
        timestamp: "14:20",
      },
    ],
  },
];

export default function AiWorkspaceBlockReviewDemo() {
  return (
    <AiWorkspaceBlock
      className="max-w-2xl"
      initialThreads={REVIEW_THREADS}
      title="PR 审查副驾驶"
      variant="compact"
      defaultModel="gemini-pro"
    />
  );
}
