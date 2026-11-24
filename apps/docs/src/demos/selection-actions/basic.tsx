"use client";

/**
 * 示例：SelectionActions 划词选区高亮与行内 AI 改写浮条。
 */
import { SelectionActions } from "@matt-ui/ui";
import { useState } from "react";

const SAMPLE_SELECTION = "请于周六早间优先备料，确保午后高峰前口感达到最佳凝实度。";

export default function SelectionActionsBasicDemo() {
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4 py-2">
      <p className="m-0 max-w-lg text-sm leading-7 text-foreground/90">
        开心果风味在周末持续领跑门店销量。
        <mark className="rounded bg-foreground/10 px-1 py-0.5 text-foreground dark:bg-sky-400/20 dark:text-neutral-100">
          {SAMPLE_SELECTION}
        </mark>
      </p>

      <SelectionActions
        selectedText={SAMPLE_SELECTION}
        onAction={(actionId) => {
          const map: Record<string, string> = {
            explain: "已生成解释：提前备料可为低温熟成留出充足时间窗口，保证高峰期出品一致。",
            improve: "已润色为：「建议周六一早优先制作，为午后客流高峰预留充分熟成时间。」",
          };
          setFeedback(map[actionId] ?? `已触发动作：${actionId}`);
        }}
        onSubmitInstruction={(instruction) => {
          setFeedback(`已按「${instruction}」改写选中段落。`);
        }}
      />

      {feedback && (
        <div className="w-full max-w-lg rounded-xl border border-solid border-border bg-muted/50 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground dark:border-white/10 dark:bg-white/[0.03]">
          {feedback}
        </div>
      )}
    </div>
  );
}
