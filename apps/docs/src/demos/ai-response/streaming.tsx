"use client";

import { AiResponse, type AiResponseStatus } from "@matt-ui/motion";
import { useEffect, useState } from "react";

const FULL_TEXT = `### 流式输出演示

**AiResponse** 在输出尚未闭合代码块或列表时也能稳定渲染，不依赖 \`innerHTML\`：

\`\`\`tsx
<AiResponse status="streaming" content={chunk} />
\`\`\`

1. 零脚本注入风险，链接严格校验协议
2. 生成完成后自动浮现复制、重生成与反馈栏`;

export default function AiResponseStreamingDemo() {
  const [status, setStatus] = useState<AiResponseStatus>("streaming");
  const [length, setLength] = useState(24);

  useEffect(() => {
    if (status !== "streaming") return;
    const id = window.setInterval(() => {
      setLength((n) => {
        if (n >= FULL_TEXT.length) {
          setStatus("complete");
          return FULL_TEXT.length;
        }
        return n + 6;
      });
    }, 65);
    return () => window.clearInterval(id);
  }, [status]);

  const restart = () => {
    setLength(0);
    setStatus("generating");
    window.setTimeout(() => setStatus("streaming"), 700);
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <AiResponse
        model="Matt AI · Streaming"
        status={status}
        content={status === "generating" ? "" : FULL_TEXT.slice(0, length)}
        onRegenerate={restart}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={restart}
          className="h-8 cursor-pointer rounded-full border border-border bg-card px-3.5 font-sans text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          重播流式输出
        </button>
        <button
          type="button"
          onClick={() => setStatus("error")}
          className="h-8 cursor-pointer rounded-full border border-border bg-card px-3.5 font-sans text-xs text-muted-foreground shadow-xs transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          预览错误态
        </button>
      </div>
    </div>
  );
}
