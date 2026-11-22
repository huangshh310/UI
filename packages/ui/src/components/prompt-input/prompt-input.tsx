"use client";

/**
 * PromptInput：面向 AI 对话与指令工作流的自适应多行输入器。
 * 支持自动增高、附件标签管理、模型/模式切换、IME 组合态防误触提交、生成中停止与快捷建议词。
 */
import { cn } from "@matt-ui/utils";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { PromptInputProps } from "./prompt-input.types.js";
import { AttachmentChips, PromptToolbar, SuggestionRow } from "./prompt-parts.js";

const CARD_CLASSES = cn(
  "flex flex-col rounded-[24px] border border-solid border-border/90 bg-card p-3 shadow-lg",
  "transition-[border-color,box-shadow] duration-(--ui-duration-fast)",
  "hover:border-foreground/22 focus-within:border-signal/60 focus-within:ring-4 focus-within:ring-signal/14",
);

const TEXTAREA_CLASSES =
  "min-h-[44px] max-h-[180px] w-full resize-none appearance-none border-0 bg-transparent px-2.5 py-2 font-sans text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/80 disabled:cursor-not-allowed disabled:opacity-50";

const usePromptState = (props: PromptInputProps) => {
  const [inner, setInner] = useState(props.defaultValue ?? "");
  const text = props.value !== undefined ? props.value : inner;
  const status = props.status ?? "idle";
  const canSubmit = text.trim().length > 0;

  const updateText = (next: string) => {
    if (props.value === undefined) setInner(next);
    props.onValueChange?.(next);
  };

  const submit = () => {
    if (!canSubmit || status !== "idle") return;
    props.onSubmit?.(text.trim());
    if (props.value === undefined) setInner("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    submit();
  };

  return { text, status, canSubmit, updateText, submit, onKeyDown };
};

const AutoGrowTextarea = ({
  textareaRef,
  value,
  maxLength,
  disabled,
  placeholder,
  ariaLabel,
  onChange,
  onKeyDown,
}: {
  textareaRef: { current: HTMLTextAreaElement | null };
  value: string;
  maxLength?: number;
  disabled: boolean;
  placeholder: string;
  ariaLabel: string;
  onChange: (next: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}) => {
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const height = value.length > 0 ? Math.min(el.scrollHeight, 180) : 44;
    el.style.height = `${Math.max(44, height)}px`;
  }, [value, textareaRef]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={value}
      maxLength={maxLength}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      className={TEXTAREA_CLASSES}
    />
  );
};

export const PromptInput = (props: PromptInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const state = usePromptState(props);
  const attachments = props.attachments ?? [];
  const suggestions = props.suggestions ?? [];

  const pickSuggestion = (item: string) => {
    state.updateText(item);
    props.onSelectSuggestion?.(item);
    textareaRef.current?.focus();
  };

  return (
    <div
      data-slot="prompt-input"
      className={cn("flex w-full max-w-xl flex-col gap-2.5 font-sans", props.className)}
    >
      <div className={CARD_CLASSES}>
        {attachments.length > 0 && (
          <AttachmentChips attachments={attachments} onRemove={props.onRemoveAttachment} />
        )}
        <AutoGrowTextarea
          textareaRef={textareaRef}
          value={state.text}
          maxLength={props.maxLength}
          disabled={state.status === "disabled"}
          placeholder={props.placeholder ?? "输入你的问题或指令…"}
          ariaLabel={props["aria-label"] ?? "指令输入框"}
          onChange={state.updateText}
          onKeyDown={state.onKeyDown}
        />
        <PromptToolbar
          onAttach={props.onAttach}
          models={props.models ?? []}
          selectedModel={props.selectedModel}
          onModelChange={props.onModelChange}
          toolbarLeft={props.toolbarLeft}
          maxLength={props.maxLength}
          length={state.text.length}
          status={state.status}
          canSubmit={state.canSubmit}
          onSubmit={state.submit}
          onStop={props.onStop}
        />
      </div>
      {suggestions.length > 0 && (
        <SuggestionRow suggestions={suggestions} onPick={pickSuggestion} />
      )}
      {props.hint && <p className="m-0 px-1 text-[11px] text-muted-foreground">{props.hint}</p>}
    </div>
  );
};
