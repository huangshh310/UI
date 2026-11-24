"use client";

import { AiResponse } from "@matt-ui/motion";
import { useState } from "react";

const SAMPLE_MARKDOWN = `## 推荐的微交互参数

为了让 C 端交互既有弹性又不拖沓，建议采用轻量阻尼弹簧：

\`\`\`ts
export const TACTILE_SPRING = { stiffness: 420, damping: 32 };
\`\`\`

- **入场过渡**：控制在 \`180ms\` 以内，避免遮挡操作意图
- **链接校验**：内置 [安全协议白名单](/docs) 自动过滤危险协议`;

const SAMPLE_TOOLS = [
  {
    id: "t1",
    name: "inspect_tokens",
    status: "complete" as const,
    duration: "0.2s",
    detail: "38 tokens",
  },
  {
    id: "t2",
    name: "check_contrast",
    status: "complete" as const,
    duration: "0.3s",
    detail: "WCAG AA",
  },
];

const SAMPLE_SOURCES = [
  {
    id: "s1",
    title: "设计系统 Token 规范",
    url: "https://matt-ui.dev/docs",
    snippet: "浅色与深色双主题语义阶梯与焦点环约束",
  },
  {
    id: "s2",
    title: "Motion 弹簧物理指南",
    url: "https://motion.dev/docs",
    snippet: "基于阻尼与刚度参数的自然物理过渡",
  },
];

export default function AiResponseBasicDemo() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <AiResponse
        model="Matt Pro 4"
        modelBadge="200K"
        timestamp="0.8s"
        content={SAMPLE_MARKDOWN}
        tools={SAMPLE_TOOLS}
        sources={SAMPLE_SOURCES}
        onRegenerate={() => setNote("已触发重新生成")}
        onFeedback={(type) => setNote(type === "up" ? "已记录正向反馈" : "已记录改进建议")}
      />
      {note && (
        <p className="m-0 px-2 text-right font-mono text-[11px] text-muted-foreground">{note}</p>
      )}
    </div>
  );
}
