"use client";

import { AnimatedText } from "@matt-ui/motion";

export default function AnimatedTextHeadlineDemo() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="m-0 text-sm text-muted-foreground">构建下一代</p>
      <div className="text-2xl font-semibold tracking-tight text-foreground">
        <AnimatedText
          mode="cycle"
          phrases={["设计系统", "AI 工作台", "组件 Registry"]}
          intervalMs={2200}
        />
      </div>
    </div>
  );
}
