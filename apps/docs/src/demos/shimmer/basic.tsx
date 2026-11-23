"use client";

/**
 * 示例：Shimmer 真实水平流光扫掠文字、阶段切换与动效暂停控制。
 */
import { Shimmer } from "@matt-ui/ui";
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
    <div className="flex w-full max-w-lg flex-col gap-3.5">
      <div className="flex items-center gap-2.5">
        <Shimmer active={active} size="sm" tone="muted">
          {PHASES[idx % PHASES.length]}
        </Shimmer>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIdx((prev) => prev + 1)}
          className="cursor-pointer rounded-lg border border-solid border-border bg-card px-2.5 py-1 font-sans text-xs font-medium text-foreground shadow-xs transition-colors outline-none hover:border-foreground/20 hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/10 dark:hover:border-white/20"
        >
          切换阶段文案
        </button>
        <button
          type="button"
          onClick={() => setActive((prev) => !prev)}
          className="cursor-pointer rounded-lg border border-solid border-border bg-transparent px-2.5 py-1 font-sans text-xs text-muted-foreground transition-colors outline-none hover:bg-accent/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset dark:border-white/10"
        >
          {active ? "暂停扫光" : "恢复扫光"}
        </button>
      </div>
    </div>
  );
}
