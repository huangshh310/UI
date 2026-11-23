"use client";

/**
 * 示例：Suggestions 垂直追问列表形态（variant="list"），适配回答末尾的深度追问引导。
 */
import { Suggestions } from "@matt-ui/ui";
import { useState } from "react";

const FOLLOW_UPS = [
  {
    id: "diff",
    label: "对比 Base UI 与原生实现的键盘焦点差异",
    description: "聚焦顺序、Escape 退出与 aria-activedescendant 管理",
    badge: "深度",
  },
  {
    id: "perf",
    label: "给出长会话虚拟滚动的最小接入方案",
    description: "在保持贴底锚定的前提下控制 500+ 条消息的 DOM 体积",
    badge: "性能",
  },
  {
    id: "a11y",
    label: "补充高对比度与减弱动效降级检查项",
    description: "验证 prefers-reduced-motion 与浅/深双主题对比度",
    badge: "无障碍",
  },
];

export default function SuggestionListDemo() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2.5">
      <Suggestions
        variant="list"
        surface="default"
        items={FOLLOW_UPS}
        onSelect={(prompt) => setPicked(prompt)}
      />
      {picked && <p className="m-0 font-mono text-xs text-muted-foreground">发起追问：{picked}</p>}
    </div>
  );
}
