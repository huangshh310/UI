"use client";

import {
  AiAgentActivity,
  AiAgentActivityHeader,
  AiAgentActivityTimeline,
  type AiAgentActivityItemData,
} from "@matt-ui/motion";

const COMPLETED_STEPS: AiAgentActivityItemData[] = [
  {
    id: "fetch",
    type: "searching",
    title: "拉取目标页面布局结构",
    status: "success",
    duration: "0.6s",
    details: { output: "已提取三栏浮动胶囊页头与无边框画廊网格参数。" },
  },
  {
    id: "audit",
    type: "thinking",
    title: "核对可访问性与键盘导航",
    status: "success",
    duration: "0.3s",
    metadata: { axeViolations: 0, focusRing: "visible" },
  },
  {
    id: "publish",
    type: "tool_execution",
    title: "生成 Registry 清单与文档页",
    status: "success",
    duration: "1.1s",
    details: { output: "96 个组件条目构建成功。" },
  },
];

export default function AiAgentActivityCompletedDemo() {
  return (
    <div className="w-full max-w-2xl">
      <AiAgentActivity variant="glass" collapsible activities={COMPLETED_STEPS} isRunning={false}>
        <AiAgentActivityHeader title="发布检查" agentName="Release Bot" />
        <AiAgentActivityTimeline />
      </AiAgentActivity>
    </div>
  );
}
