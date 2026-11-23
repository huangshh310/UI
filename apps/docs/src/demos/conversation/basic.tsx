"use client";

/**
 * 示例：Conversation 智能贴底追踪与离开底部悬浮归位胶囊。
 */
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  Message,
  MessageContent,
} from "@matt-ui/ui";
import { useState } from "react";

const INITIAL_TURNS = [
  { id: "1", role: "user" as const, text: "为什么现代 AI 对话界面不再给助手回复加厚边框气泡？" },
  {
    id: "2",
    role: "assistant" as const,
    text: "无框流式画布让长篇代码、列表与内联轨迹自然呼吸，避免多重嵌套卡片造成的视觉噪点。",
  },
  { id: "3", role: "user" as const, text: "那用户上滚回看旧消息时，流式输出如何不抢夺视线？" },
  {
    id: "4",
    role: "assistant" as const,
    text: "Conversation 实时监测贴底阈值：一旦用户主动上滚便立即解绑自动跟随，并在底部浮现回到底部胶囊。",
  },
];

export default function ConversationBasicDemo() {
  const [turns, setTurns] = useState(INITIAL_TURNS);

  const appendTurn = () => {
    const n = turns.length + 1;
    setTurns((prev) => [
      ...prev,
      {
        id: String(n),
        role: "assistant",
        text: `流式增量片段 #${n - 3}：视口处于底部时自动平滑跟随，上滚阅读时保持当前位置不动。`,
      },
    ]);
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-2.5">
      <Conversation className="h-64 rounded-2xl border border-solid border-border/80 bg-background">
        <ConversationContent className="gap-4 py-4">
          {turns.map((turn) => (
            <Message key={turn.id} from={turn.role}>
              <MessageContent>{turn.text}</MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={appendTurn}
          className="cursor-pointer rounded-full border border-solid border-border bg-card px-3 py-1 font-sans text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          模拟追加流式消息
        </button>
      </div>
    </div>
  );
}
