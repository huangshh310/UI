"use client";

/**
 * 示例：ModelSelector 与 Context 嵌入 PromptInput 底部工具栏协同工作。
 */
import { Context, ModelSelector, PromptInput } from "@matt-ui/ui";

export default function ModelSelectorToolbarDemo() {
  return (
    <PromptInput
      placeholder="模型选择与上下文环形表盘直接内聚于底部工具栏…"
      toolbarLeft={<ModelSelector />}
      toolbarRight={<Context />}
    />
  );
}
