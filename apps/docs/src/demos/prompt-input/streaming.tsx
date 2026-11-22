"use client";

import { PromptInput } from "@matt-ui/ui";
import { useState } from "react";

export default function PromptInputStreamingDemo() {
  const [streaming, setStreaming] = useState(true);
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <PromptInput
        value={value}
        onValueChange={setValue}
        status={streaming ? "streaming" : "idle"}
        onStop={() => setStreaming(false)}
        onSubmit={() => {
          setValue("");
          setStreaming(true);
        }}
        placeholder={streaming ? "正在生成组件对比度报告，可点击右侧停止…" : "输入新的审查指令…"}
        hint="演示 streaming 运行态与一键停止控制"
      />
    </div>
  );
}
