"use client";

/**
 * 示例：ThinkingOrb 3D 光学球面粒子认知态平滑形变与微光状态胶囊。
 */
import { ThinkingOrb, type ThinkingOrbState } from "@matt-ui/ui";
import { useState } from "react";

const STATES: { id: ThinkingOrbState; label: string; caption: string }[] = [
  { id: "working", label: "处理中", caption: "正在规划多步骤执行路径" },
  { id: "searching", label: "检索中", caption: "正在扫描 18 份仓库规范" },
  { id: "solving", label: "求解中", caption: "正在验证类型与对比度约束" },
  { id: "listening", label: "聆听", caption: "等待语音指令输入" },
  { id: "weaving", label: "编织", caption: "正在融合工具调用上下文" },
  { id: "shaping", label: "塑形", caption: "正在塑形最终结构化方案" },
];

export default function ThinkingOrbBasicDemo() {
  const [state, setState] = useState<ThinkingOrbState>("working");
  const current = STATES.find((item) => item.id === state) ?? STATES[0];

  return (
    <div className="flex w-full flex-col items-center gap-6 py-2">
      <ThinkingOrb state={state} variant="halo" size={136} label={current?.caption} interactive />
      <div className="inline-flex flex-wrap items-center justify-center gap-0.5 rounded-xl border border-solid border-border bg-muted/70 p-1 shadow-xs dark:border-white/10 dark:bg-white/[0.05]">
        {STATES.map((item) => {
          const active = item.id === state;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setState(item.id)}
              aria-pressed={active}
              className={`cursor-pointer rounded-lg border border-solid px-3 py-1.5 font-sans text-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset ${
                active
                  ? "border-border bg-card font-medium text-foreground shadow-xs dark:border-white/12 dark:bg-card"
                  : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
