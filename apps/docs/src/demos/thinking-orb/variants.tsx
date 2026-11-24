"use client";

/**
 * 示例：ThinkingOrb 外观变体（minimal / framed / halo）、深浅极性对比与内联状态微标。
 */
import { ThinkingOrb, type ThinkingOrbState, type ThinkingOrbVariant } from "@matt-ui/ui";

const VARIANT_ITEMS: {
  variant: ThinkingOrbVariant;
  state: ThinkingOrbState;
  name: string;
  note: string;
}[] = [
  { variant: "minimal", state: "breathing", name: "minimal", note: "无框悬浮" },
  { variant: "framed", state: "searching", name: "framed", note: "光学玻璃表圈" },
  { variant: "halo", state: "solving", name: "halo", note: "双环氛围光晕" },
];

export default function ThinkingOrbVariantsDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {VARIANT_ITEMS.map((item) => (
          <div
            key={item.variant}
            className="flex flex-col items-center gap-3 rounded-xl border border-solid border-border bg-card px-5 py-6 shadow-xs dark:border-white/10"
          >
            <ThinkingOrb state={item.state} variant={item.variant} size={74} interactive />
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-mono text-xs font-medium text-foreground">{item.name}</span>
              <span className="text-[11px] text-muted-foreground">{item.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-center gap-5 rounded-xl border border-solid border-border bg-card px-5 py-4 shadow-xs dark:border-white/10">
          <ThinkingOrb
            state="composing"
            variant="framed"
            size={32}
            label="正在合成流式答复…"
            labelPlacement="right"
          />
        </div>
        <div
          data-theme="dark"
          className="dark flex items-center justify-center gap-5 rounded-xl border border-solid border-border bg-card px-5 py-4 shadow-xs"
        >
          <ThinkingOrb
            state="connecting"
            variant="halo"
            size={32}
            dark
            label="已建立多端上下文同步"
            labelPlacement="right"
          />
        </div>
      </div>
    </div>
  );
}
