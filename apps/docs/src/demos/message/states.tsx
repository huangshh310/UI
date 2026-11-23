"use client";

/**
 * 示例：Message 流式生成、主动中断（stopped）与异常重试（error）状态反馈。
 */
import { Message, MessageContent } from "@matt-ui/ui";
import { useState } from "react";

export default function MessageStatesDemo() {
  const [retried, setRetried] = useState(false);

  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <Message from="assistant" status="stopped">
        <MessageContent>已根据你的要求梳理出第一阶段 8 个核心原语的导出契约——</MessageContent>
      </Message>
      <Message
        from="assistant"
        status={retried ? "streaming" : "error"}
        errorMessage="上游推理服务响应超时（504）"
        onRetry={() => setRetried(true)}
      >
        <MessageContent>
          {retried ? "已重新建立流式连接，正在继续输出完整组件树…" : "正在分析跨包依赖图…"}
        </MessageContent>
      </Message>
    </div>
  );
}
