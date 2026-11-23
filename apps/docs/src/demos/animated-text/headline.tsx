"use client";

import { AnimatedText } from "@matt-ui/motion";

export default function AnimatedTextHeadlineDemo() {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center">
      <p className="m-0 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        CRAFTED FOR MODERN INTERFACES
      </p>
      <div className="flex flex-wrap items-baseline justify-center gap-2">
        <span className="text-2xl font-semibold tracking-tight text-foreground">构建下一代</span>
        <AnimatedText
          mode="cycle"
          variant="wave"
          tone="signal"
          size="xl"
          phrases={["设计系统", "AI 工作台", "组件 Registry"]}
          intervalMs={2200}
          className="font-semibold"
        />
      </div>
    </div>
  );
}
