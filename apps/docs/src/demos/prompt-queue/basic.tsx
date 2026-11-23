"use client";

/**
 * 示例：PromptQueue 流式生成期间与 PromptInput 联动的弹簧待发消息队列。
 */
import { PromptQueue, type QueuedPromptItem } from "@matt-ui/motion";
import { PromptInput } from "@matt-ui/ui";
import { useState } from "react";

const INITIAL_QUEUE: QueuedPromptItem[] = [
  { id: "q1", content: "补充一份移动端 390px 宽度下的响应式停靠策略" },
  { id: "q2", content: "为检查点回滚动作加上撤销 Toast 提示", meta: "@checkpoint" },
];

export default function PromptQueueBasicDemo() {
  const [queue, setQueue] = useState<QueuedPromptItem[]>(INITIAL_QUEUE);
  const [draft, setDraft] = useState("");
  const [statusLog, setStatusLog] = useState(
    "AI 正在流式输出当前回合，新发送的指令将进入上方队列…",
  );

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <PromptQueue
        items={queue}
        onSendNow={(item) => {
          setQueue((prev) => prev.filter((q) => q.id !== item.id));
          setStatusLog(`已中断当前流并立即插队发送：「${item.content}」`);
        }}
        onEdit={(item) => {
          setQueue((prev) => prev.filter((q) => q.id !== item.id));
          setDraft(item.content);
        }}
        onRemove={(id) => setQueue((prev) => prev.filter((q) => q.id !== id))}
        onClearAll={() => setQueue([])}
      />
      <PromptInput
        status="streaming"
        value={draft}
        onValueChange={setDraft}
        onQueue={(text) => {
          setQueue((prev) => [...prev, { id: `q-${Date.now()}`, content: text }]);
          setDraft("");
        }}
        onStop={() => setStatusLog("已手动停止当前流式回复")}
        placeholder="生成中输入后续想法并按 Enter 加入待发队列…"
      />
      <p className="m-0 px-1 font-mono text-xs text-muted-foreground">{statusLog}</p>
    </div>
  );
}
