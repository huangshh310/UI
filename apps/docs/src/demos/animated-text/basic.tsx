"use client";

import { AnimatedText } from "@matt-ui/motion";

export default function AnimatedTextBasicDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-[22px] border border-solid border-border/90 bg-card p-6 text-center shadow-xs">
      <AnimatedText
        mode="reveal"
        variant="fade-up"
        size="lg"
        text="中性克制 · 钴蓝聚焦"
        className="font-semibold"
      />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>适用于</span>
        <AnimatedText
          mode="cycle"
          variant="blur-in"
          tone="signal"
          phrases={["设计系统", "企业控制台", "AI 工作台"]}
          className="font-semibold"
        />
      </div>
      <AnimatedText mode="shimmer" size="sm" text="正在分析组件依赖图与 Token 对比度…" />
    </div>
  );
}
