"use client";

/**
 * 示例：PromptInput 的悬浮风、紧凑填充风、顶部建议条与错误校验反馈。
 */
import { PromptInput } from "@matt-ui/ui";

export default function PromptInputVariantsDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          悬浮命令条（Elevated + 顶部建议词）
        </span>
        <PromptInput
          variant="elevated"
          suggestionsPosition="top"
          suggestions={["总结本周 PR 变更", "为 Calendar 补齐边界单测"]}
          placeholder="向 AI 助手提问，或输入 / 触发技能…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          紧凑填充态与错误提示（Filled + sm）
        </span>
        <PromptInput
          variant="filled"
          size="sm"
          radius="lg"
          defaultValue="请帮我分析这份超长上下文日志…"
          error="超出当前模型 128K 上下文上限，请精简附件后再发送"
        />
      </div>
    </div>
  );
}
