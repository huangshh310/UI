"use client";

/**
 * 示例：ThinkingOrb 外观变体（minimal / framed / halo）与内联右侧禅意微标。
 */
import { ThinkingOrb } from "@matt-ui/ui";

export default function ThinkingOrbVariantsDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2.5 rounded-xl border border-solid border-border bg-card p-5 shadow-xs dark:border-white/10">
          <ThinkingOrb state="breathing" variant="minimal" size={64} />
          <span className="font-mono text-[11px] text-muted-foreground">minimal</span>
        </div>
        <div className="flex flex-col items-center gap-2.5 rounded-xl border border-solid border-border bg-card p-5 shadow-xs dark:border-white/10">
          <ThinkingOrb state="searching" variant="framed" size={64} interactive />
          <span className="font-mono text-[11px] text-muted-foreground">framed</span>
        </div>
        <div className="flex flex-col items-center gap-2.5 rounded-xl border border-solid border-border bg-card p-5 shadow-xs dark:border-white/10">
          <ThinkingOrb state="solving" variant="halo" size={64} interactive />
          <span className="font-mono text-[11px] text-muted-foreground">halo</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-solid border-border bg-card px-5 py-3.5 shadow-xs dark:border-white/10">
        <ThinkingOrb
          state="composing"
          variant="framed"
          size={28}
          label="正在合成流式答复…"
          labelPlacement="right"
        />
        <ThinkingOrb
          state="listening"
          variant="minimal"
          size={28}
          showLabel
          labelPlacement="right"
        />
      </div>
    </div>
  );
}
