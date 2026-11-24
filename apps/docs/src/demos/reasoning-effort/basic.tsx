"use client";

/**
 * 示例：ReasoningEffort 极简单色 4 档推理深度选择器（分段胶囊与卡片双变体联动）。
 */
import { ReasoningEffortPicker, type ReasoningEffortLevel } from "@matt-ui/ui";
import { useState } from "react";

export default function ReasoningEffortBasicDemo() {
  const [level, setLevel] = useState<ReasoningEffortLevel>("high");

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-5">
      <ReasoningEffortPicker value={level} onValueChange={setLevel} variant="segmented" />
      <ReasoningEffortPicker value={level} onValueChange={setLevel} variant="cards" />
    </div>
  );
}
