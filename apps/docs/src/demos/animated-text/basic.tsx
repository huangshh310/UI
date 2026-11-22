"use client";

import { AnimatedText } from "@matt-ui/motion";

export default function AnimatedTextBasicDemo() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <AnimatedText
        mode="reveal"
        text="中性克制 · 钴蓝聚焦"
        className="text-xl font-semibold tracking-tight text-foreground"
      />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>适用于</span>
        <AnimatedText
          mode="cycle"
          phrases={["设计系统", "企业控制台", "AI 工作台"]}
          className="font-semibold text-signal"
        />
      </div>
      <AnimatedText mode="shimmer" text="正在分析组件依赖图…" className="text-xs" />
    </div>
  );
}
