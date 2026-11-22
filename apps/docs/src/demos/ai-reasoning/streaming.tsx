"use client";

import { AiReasoning, type AiReasoningStatus } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { useState } from "react";

export default function AiReasoningStreamingDemo() {
  const [status, setStatus] = useState<AiReasoningStatus>("thinking");

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3">
      <AiReasoning
        status={status}
        durationLabel={status === "thinking" ? "1.4s" : "3.1s"}
        defaultExpanded
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => setStatus((s) => (s === "thinking" ? "completed" : "thinking"))}
      >
        切换为{status === "thinking" ? "已完成态" : "推理中态"}
      </Button>
    </div>
  );
}
