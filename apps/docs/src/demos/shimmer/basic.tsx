"use client";

/**
 * 示例：Shimmer 微光扫掠文字与流式阶段切换。
 */
import { Shimmer } from "@matt-ui/ui";
import { Sparkles } from "lucide-react";
import { useState } from "react";

const PHASES = [
  "正在检索 12 篇架构规范与对比度基线…",
  "正在分析代码库组件依赖与令牌映射…",
  "正在合成无框流式响应与引用来源…",
];

export default function ShimmerBasicDemo() {
  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState(true);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-solid border-border/80 bg-card/90 px-3.5 py-1.5 shadow-xs backdrop-blur-md dark:border-white/10">
        <Sparkles aria-hidden="true" className="size-3.5 text-signal" />
        <Shimmer active={active} size="xs">
          {PHASES[idx % PHASES.length]}
        </Shimmer>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIdx((prev) => prev + 1)}
          className="cursor-pointer rounded-lg border border-solid border-border/80 bg-card px-2.5 py-1 font-sans text-xs text-foreground shadow-xs transition-colors hover:border-foreground/22 hover:bg-accent focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none dark:border-white/10 dark:hover:border-white/22"
        >
          切换阶段文案
        </button>
        <button
          type="button"
          onClick={() => setActive((prev) => !prev)}
          className="cursor-pointer rounded-lg border border-solid border-border/80 bg-transparent px-2.5 py-1 font-sans text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none dark:border-white/10"
        >
          {active ? "暂停微光" : "恢复微光"}
        </button>
      </div>
    </div>
  );
}
