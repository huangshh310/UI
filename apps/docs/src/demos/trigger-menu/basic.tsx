"use client";

/**
 * 示例：TriggerMenu 内置多行输入区，同时监听 @文件、/指令 与 #标签 三类触发符。
 */
import { TriggerMenu, type TriggerMenuSource } from "@matt-ui/ui";
import { useState } from "react";

const MULTI_TRIGGERS: TriggerMenuSource[] = [
  {
    char: "@",
    type: "file",
    groupLabel: "上下文文件",
    items: [
      { value: "README.md", label: "README.md", badge: "MD" },
      { value: "tsconfig.json", label: "tsconfig.json", badge: "JSON" },
    ],
  },
  {
    char: "#",
    type: "tag",
    groupLabel: "变更分类",
    items: [
      { value: "perf", label: "性能优化", badge: "P1" },
      { value: "a11y", label: "无障碍合规", badge: "AA" },
    ],
  },
];

export const TriggerMenuBasic = () => {
  const [draft, setDraft] = useState("请核对 ");

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <TriggerMenu
        ariaLabel="任务备注输入"
        value={draft}
        onValueChange={setDraft}
        placeholder="键入 @ 引用文件或 # 添加分类标签…"
        triggers={MULTI_TRIGGERS}
      />
      <span className="font-mono text-[11px] text-muted-foreground">
        当前字符数：{draft.length}
      </span>
    </div>
  );
};
