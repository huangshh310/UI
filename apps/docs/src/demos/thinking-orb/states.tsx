"use client";

/**
 * 示例：ThinkingOrb 全部 9 种认知状态 3D 物理编排矩阵。
 */
import { ThinkingOrb, type ThinkingOrbState } from "@matt-ui/ui";

const ALL_STATES: { id: ThinkingOrbState; title: string; subtitle: string }[] = [
  { id: "working", title: "处理中", subtitle: "working" },
  { id: "searching", title: "检索中", subtitle: "searching" },
  { id: "solving", title: "求解中", subtitle: "solving" },
  { id: "listening", title: "聆听中", subtitle: "listening" },
  { id: "connecting", title: "连接中", subtitle: "connecting" },
  { id: "weaving", title: "编织", subtitle: "weaving" },
  { id: "composing", title: "组织", subtitle: "composing" },
  { id: "breathing", title: "待命", subtitle: "breathing" },
  { id: "shaping", title: "塑形", subtitle: "shaping" },
];

export default function ThinkingOrbStatesDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
      {ALL_STATES.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center gap-3 rounded-xl border border-solid border-border bg-card px-4 py-5 shadow-xs transition-colors hover:border-foreground/20 dark:border-white/10 dark:hover:border-white/20"
        >
          <ThinkingOrb state={item.id} size={72} />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-medium text-foreground">{item.title}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{item.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
