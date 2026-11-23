"use client";

/**
 * 示例：Suggestions 空态灵感卡片网格与分类筛选（variant="cards"）。
 */
import { Suggestions } from "@matt-ui/ui";
import { useState } from "react";

export default function SuggestionCardsDemo() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2.5">
      <Suggestions variant="cards" surface="default" onSelect={(prompt) => setPicked(prompt)} />
      {picked && <p className="m-0 font-mono text-xs text-muted-foreground">注入指令：{picked}</p>}
    </div>
  );
}
