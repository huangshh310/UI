"use client";

/**
 * 示例：Shimmer 微光扫掠文字与流式阶段切换。
 */
import { Shimmer } from "@matt-ui/ui";
import { Sparkles } from "lucide-react";
import { useState } from "react";

const PHASES = [
  "正在检索 12 篇架构规范与对比度基线…",
  "正在比对 HextaUI 与 AI Elements 复合原语…",
  "正在合成无框流式响应…",
];

export default function ShimmerBasicDemo() {
  const [idx, setIdx] = useState(0);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-solid border-border/80 bg-card px-3.5 py-1.5 shadow-xs">
        <Sparkles aria-hidden="true" className="size-3.5 text-signal" />
        <Shimmer>{PHASES[idx % PHASES.length]}</Shimmer>
      </div>
      <button
        type="button"
        onClick={() => setIdx((prev) => prev + 1)}
        className="w-fit cursor-pointer rounded-lg border border-solid border-border bg-card px-2.5 py-1 font-sans text-xs text-foreground shadow-xs transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        切换阶段文案
      </button>
    </div>
  );
}
