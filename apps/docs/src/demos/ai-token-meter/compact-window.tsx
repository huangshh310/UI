"use client";

import { AiTokenMeter } from "@matt-ui/ui";

export default function AiTokenMeterCompactWindowDemo() {
  return (
    <AiTokenMeter
      maxTokens={32000}
      costLabel="WebGPU 本地推理 · $0.00"
      segments={[
        { id: "system", label: "系统提示", tokens: 3200, tone: "primary" },
        { id: "history", label: "多轮会话", tokens: 12400, tone: "signal" },
        { id: "rag", label: "本地向量库", tokens: 6800, tone: "success" },
        { id: "tools", label: "函数Schema", tokens: 2400, tone: "warning" },
      ]}
    />
  );
}
