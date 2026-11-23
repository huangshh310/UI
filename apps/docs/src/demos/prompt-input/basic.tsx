"use client";

/**
 * 示例：PromptInput 的斜杠命令、@ 上下文标签、附件管理、模型切换与流式停止闭环。
 */
import {
  PromptInput,
  type PromptAttachment,
  type PromptContextRef,
  type PromptInputStatus,
  type PromptSlashCommand,
} from "@matt-ui/ui";
import { useEffect, useRef, useState } from "react";

const MODELS = [
  { id: "flash", label: "Flash" },
  { id: "pro", label: "Pro" },
];

const SUGGESTIONS = ["帮我设计一套暗色 Token", "检查无障碍对比度"];

const SLASH_COMMANDS: PromptSlashCommand[] = [
  { id: "review", command: "review", description: "审查组件无障碍与对比度", template: "/review " },
  { id: "plan", command: "plan", description: "拆解分阶段重构蓝图", template: "/plan " },
];

const INITIAL_ATTACHMENTS: PromptAttachment[] = [
  { id: "tok", name: "tokens.css", size: "4.2 KB", kind: "code" },
];

const INITIAL_CONTEXT: PromptContextRef[] = [{ id: "adr", label: "ADR-001" }];

const useStreamingTimer = () => {
  const [status, setStatus] = useState<PromptInputStatus>("idle");
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => (timerRef.current ? clearTimeout(timerRef.current) : undefined), []);

  const submit = (text: string) => {
    setLastPrompt(text);
    setStatus("streaming");
    timerRef.current = setTimeout(() => setStatus("idle"), 1500);
  };

  const stop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");
  };

  return { status, lastPrompt, submit, stop };
};

export const PromptInputBasic = () => {
  const [model, setModel] = useState("pro");
  const [attachments, setAttachments] = useState<PromptAttachment[]>(INITIAL_ATTACHMENTS);
  const [contextRefs, setContextRefs] = useState<PromptContextRef[]>(INITIAL_CONTEXT);
  const stream = useStreamingTimer();

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <PromptInput
        status={stream.status}
        models={MODELS}
        selectedModel={model}
        onModelChange={setModel}
        contextRefs={contextRefs}
        onRemoveContextRef={(id) => setContextRefs((prev) => prev.filter((item) => item.id !== id))}
        attachments={attachments}
        onRemoveAttachment={(id) => setAttachments((prev) => prev.filter((item) => item.id !== id))}
        onAttach={() =>
          setAttachments((prev) => [
            ...prev,
            { id: `file-${prev.length + 1}`, name: `spec-${prev.length + 1}.md`, size: "1.8 KB" },
          ])
        }
        slashCommands={SLASH_COMMANDS}
        suggestions={SUGGESTIONS}
        onSubmit={stream.submit}
        onStop={stream.stop}
        maxLength={400}
        hint="键入 / 呼出快捷指令 · Enter 发送 · Shift+Enter 换行"
      />
      {stream.lastPrompt && (
        <p
          data-testid="prompt-submitted"
          className="m-0 px-1 font-mono text-xs text-muted-foreground"
        >
          已发送（{model}）：{stream.lastPrompt}
        </p>
      )}
    </div>
  );
};
