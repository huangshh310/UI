"use client";

import { AiAgentActivity, type AiAgentActivityItemData } from "@matt-ui/motion";

const ACTIVITIES: AiAgentActivityItemData[] = [
  {
    id: "scan-tokens",
    type: "searching",
    title: "读取 Design Token 体系",
    description: "校验浅色与深色表面对比度是否达到 WCAG AA 标准",
    status: "success",
    duration: "0.4s",
    details: {
      input: { theme: "neutral", minRatio: 4.5 },
      output: "全部 38 组语义色值验证通过（最低 4.60:1）",
    },
    metadata: { tokens: 38, pass: true },
  },
  {
    id: "compile-ui",
    type: "code_execution",
    title: "生成 ThinkingOrb 与 AiResponse",
    description: "输出单文件 shadcn Registry 产物与类型声明",
    status: "running",
    duration: "1.2s",
    details: {
      language: "tsx",
      codeSnippet: `export const ThinkingOrb = ({ state = "working" }) => <output data-state={state} />;`,
    },
  },
  {
    id: "verify-build",
    type: "tool_execution",
    title: "运行类型检查与视觉回归",
    description: "待源码写入后自动触发验证",
    status: "pending",
  },
];

export default function AiAgentActivityBasicDemo() {
  return (
    <div className="w-full max-w-md">
      <AiAgentActivity title="构建轨迹" agentName="UI Agent" isRunning activities={ACTIVITIES} />
    </div>
  );
}
