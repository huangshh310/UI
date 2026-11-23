"use client";

/**
 * 示例：ThinkingOrb 3D 球面粒子认知态切换与极简等宽微标。
 */
import { ThinkingOrb, type ThinkingOrbState } from "@matt-ui/ui";
import { useState } from "react";

const STATES: { id: ThinkingOrbState; label: string; caption: string }[] = [
  { id: "working", label: "处理中", caption: "正在规划多步骤执行路径" },
  { id: "searching", label: "检索中", caption: "正在扫描 18 份仓库规范" },
  { id: "solving", label: "求解中", caption: "正在验证类型与对比度约束" },
  { id: "listening", label: "聆听", caption: "等待语音指令输入" },
  { id: "weaving", label: "编织", caption: "正在融合工具调用上下文" },
];

export default function ThinkingOrbBasicDemo() {
  const [state, setState] = useState<ThinkingOrbState>("working");
  const current = STATES.find((item) => item.id === state) ?? STATES[0];

  return (
    <div className="flex flex-col items-center gap-5">
      <ThinkingOrb state={state} variant="halo" size={112} label={current?.caption} interactive />
      <div className="inline-flex flex-wrap items-center justify-center gap-0.5 rounded-lg border border-solid border-border bg-muted/70 p-0.5 dark:border-white/10 dark:bg-white/6">
        {STATES.map((item) => {
          const active = item.id === state;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setState(item.id)}
              aria-pressed={active}
              className={`cursor-pointer rounded-md border border-solid px-2.5 py-1 font-sans text-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset ${
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
