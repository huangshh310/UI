"use client";

/**
 * 示例：TriggerMenu 零侵入包裹 PromptInput，为智能体输入框注入光标跟随的 @文件 与 /指令 检索浮层。
 */
import { PromptInput, TriggerMenu, type TriggerMenuSource } from "@matt-ui/ui";
import { useState } from "react";

const COMPOSER_TRIGGERS: TriggerMenuSource[] = [
  {
    char: "@",
    type: "file",
    groupLabel: "工作区文件",
    items: [
      {
        value: "src/surface/schema.ts",
        label: "schema.ts",
        description: "语义节点校验契约",
        badge: "TS",
      },
      {
        value: "src/agent/runner.ts",
        label: "runner.ts",
        description: "多步工具编排执行器",
        badge: "TS",
      },
      {
        value: "packages/tokens/index.css",
        label: "index.css",
        description: "全局设计语义变量",
        badge: "CSS",
      },
    ],
  },
  {
    char: "/",
    type: "command",
    boundary: "start",
    groupLabel: "工作流指令",
    items: [
      { value: "review", label: "review", description: "审阅当前改动并输出风险清单" },
      { value: "trace", label: "trace", description: "分析最近一轮工具调用耗时瓶颈" },
      { value: "refactor", label: "refactor", description: "按模块边界拆分超长函数" },
    ],
  },
];

export const TriggerMenuPromptComposer = () => {
  const [lastEvent, setLastEvent] = useState("尚未触发：试着在下方输入 / 或 @");

  return (
    <div className="flex w-full max-w-xl flex-col gap-2.5">
      <TriggerMenu
        triggers={COMPOSER_TRIGGERS}
        onSelect={({ trigger, value }) => setLastEvent(`已插入引用：${trigger}${value}`)}
      >
        <PromptInput
          aria-label="智能体指令输入框"
          placeholder="键入 / 调用工作流指令，或在任意位置键入 @ 引用工作区文件…"
          onSubmit={(text) => setLastEvent(`已发送消息：${text}`)}
        />
      </TriggerMenu>
      <p
        data-testid="trigger-prompt-log"
        className="m-0 truncate font-mono text-xs text-muted-foreground"
      >
        {lastEvent}
      </p>
    </div>
  );
};
