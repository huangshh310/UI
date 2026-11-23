"use client";

/**
 * 示例：Suggestions 横向追问胶囊组与复合子部件。
 */
import { Suggestion, Suggestions } from "@matt-ui/ui";
import { useState } from "react";

export default function SuggestionBasicDemo() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <Suggestions>
        <Suggestion
          suggestion="提炼贴底滚动锚定机制与防抖边界"
          variant="signal"
          badge="推荐"
          onSelect={setPicked}
        >
          提炼贴底滚动机制
        </Suggestion>
        <Suggestion suggestion="生成无框消息与统一轨迹线组合示例" onSelect={setPicked}>
          生成统一轨迹线示例
        </Suggestion>
        <Suggestion suggestion="核对浅色与深色对比度门禁" variant="ghost" onSelect={setPicked}>
          核对双主题对比度
        </Suggestion>
      </Suggestions>
      {picked && <p className="m-0 font-mono text-xs text-muted-foreground">已选追问：{picked}</p>}
    </div>
  );
}
