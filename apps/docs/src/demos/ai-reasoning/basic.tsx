"use client";

import { AiReasoning } from "@matt-ui/motion";

export default function AiReasoningBasicDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <AiReasoning defaultExpanded tokensLabel="486 tok" />
      <AiReasoning
        variant="inline"
        defaultExpanded={false}
        title="已思考 1.8s"
        durationLabel="1.8s"
        tokensLabel="312 tok"
      />
    </div>
  );
}
