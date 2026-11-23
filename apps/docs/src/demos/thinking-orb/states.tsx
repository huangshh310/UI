"use client";

/**
 * 示例：ThinkingOrb 全部 9 种认知状态物理编排矩阵。
 */
import { ThinkingOrb, type ThinkingOrbState } from "@matt-ui/ui";

const ALL_STATES: { id: ThinkingOrbState; label: string }[] = [
  { id: "working", label: "working · 处理" },
  { id: "searching", label: "searching · 检索" },
  { id: "solving", label: "solving · 求解" },
  { id: "listening", label: "listening · 聆听" },
  { id: "connecting", label: "connecting · 连接" },
  { id: "weaving", label: "weaving · 编织" },
  { id: "composing", label: "composing · 组织" },
  { id: "breathing", label: "breathing · 待命" },
  { id: "shaping", label: "shaping · 塑形" },
];

export default function ThinkingOrbStatesDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-3 gap-3">
      {ALL_STATES.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center gap-2.5 rounded-xl border border-solid border-border bg-card p-4 shadow-xs transition-colors hover:border-foreground/20 dark:border-white/10 dark:hover:border-white/20"
        >
          <ThinkingOrb state={item.id} size={58} />
          <span className="font-mono text-[11px] text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
