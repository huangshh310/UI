"use client";

/**
 * 示例：PromptInput 的模型切换、附件管理、快捷建议与发送/停止状态流转。
 */
import { PromptInput, type PromptAttachment, type PromptInputStatus } from "@matt-ui/ui";
import { useEffect, useRef, useState } from "react";

const MODELS = [
  { id: "flash", label: "Flash" },
  { id: "pro", label: "Pro" },
];

const SUGGESTIONS = ["帮我设计一套暗色 Token", "检查无障碍对比度"];

const INITIAL_ATTACHMENTS: PromptAttachment[] = [{ id: "tok", name: "tokens.css", size: "4.2 KB" }];

const appendAttachment = (prev: PromptAttachment[]): PromptAttachment[] => [
  ...prev,
  { id: `file-${prev.length + 1}`, name: `note-${prev.length + 1}.md`, size: "1.8 KB" },
];

export const PromptInputBasic = () => {
  const [model, setModel] = useState("pro");
  const [status, setStatus] = useState<PromptInputStatus>("idle");
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<PromptAttachment[]>(INITIAL_ATTACHMENTS);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleSubmit = (text: string) => {
    setLastPrompt(text);
    setStatus("streaming");
    timerRef.current = setTimeout(() => setStatus("idle"), 1500);
  };

  const handleStop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <PromptInput
        status={status}
        models={MODELS}
        selectedModel={model}
        onModelChange={setModel}
        attachments={attachments}
        onRemoveAttachment={(id) => setAttachments((prev) => prev.filter((item) => item.id !== id))}
        onAttach={() => setAttachments(appendAttachment)}
        suggestions={SUGGESTIONS}
        onSubmit={handleSubmit}
        onStop={handleStop}
        maxLength={400}
        hint="Enter 发送 · Shift+Enter 换行"
      />
      {lastPrompt && (
        <p
          data-testid="prompt-submitted"
          className="m-0 px-1 font-mono text-xs text-muted-foreground"
        >
          已发送（{model}）：{lastPrompt}
        </p>
      )}
    </div>
  );
};
