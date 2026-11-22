// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * PromptInput：面向 AI 对话与指令工作流的自适应多行输入器。
 * 支持自动增高、附件标签管理、模型/模式切换、IME 组合态防误触提交、生成中停止与快捷建议词。
 */

import { cn } from "@/lib/utils";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";

export interface PromptAttachment {
  id: string;
  name: string;
  size?: string;
}

export interface PromptModelOption {
  id: string;
  label: string;
}

export type PromptInputStatus = "idle" | "streaming" | "disabled";

export interface PromptInputProps {
  /** 受控输入值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 内容变更回调 */
  onValueChange?: (value: string) => void;
  /** 提交回调（Enter 或点击发送按钮） */
  onSubmit?: (value: string) => void;
  /** 生成中点击停止按钮的回调 */
  onStop?: () => void;
  /** 当前运行状态 */
  status?: PromptInputStatus;
  /** 输入框占位提示 */
  placeholder?: string;
  /** 最大字符数，传入时在工具栏显示字数统计 */
  maxLength?: number;
  /** 已附加文件列表 */
  attachments?: PromptAttachment[];
  /** 移除附件回调 */
  onRemoveAttachment?: (id: string) => void;
  /** 点击添加附件图标的回调 */
  onAttach?: () => void;
  /** 可选模型/模式胶囊列表 */
  models?: PromptModelOption[];
  /** 当前选中的模型 ID */
  selectedModel?: string;
  /** 模型切换回调 */
  onModelChange?: (id: string) => void;
  /** 输入器下方的快捷提示词建议 */
  suggestions?: string[];
  /** 点击快捷提示词时的回调 */
  onSelectSuggestion?: (text: string) => void;
  /** 底部工具栏左侧自定义插槽 */
  toolbarLeft?: ReactNode;
  /** 卡片下方的键盘辅助说明 */
  hint?: string;
  className?: string;
  "aria-label"?: string;
}
const ICON_BTN_CLASSES =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

const AttachmentChips = ({
  attachments,
  onRemove,
}: {
  attachments: PromptAttachment[];
  onRemove?: (id: string) => void;
}) => (
  <div className="flex flex-wrap gap-1.5 px-2 pt-1 pb-1.5">
    {attachments.map((item) => (
      <span
        key={item.id}
        className="inline-flex h-7 items-center gap-1.5 rounded-xl border border-solid border-signal/22 bg-signal/8 px-2.5 text-xs text-foreground shadow-xs"
      >
        <Paperclip aria-hidden="true" className="size-3 shrink-0 text-signal" />
        <span className="max-w-[140px] truncate font-medium">{item.name}</span>
        {item.size && <span className="text-muted-foreground tabular-nums">{item.size}</span>}
        {onRemove && (
          <button
            type="button"
            aria-label={`移除附件 ${item.name}`}
            onClick={() => onRemove(item.id)}
            className="inline-flex size-4 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-foreground hover:bg-signal/12 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X aria-hidden="true" className="size-3" />
          </button>
        )}
      </span>
    ))}
  </div>
);

const ModelPills = ({
  models,
  selectedModel,
  onSelect,
}: {
  models: PromptModelOption[];
  selectedModel?: string;
  onSelect?: (id: string) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border/80 bg-secondary/70 p-0.5">
    {models.map(({ id, label }) => {
      const active = id === selectedModel;
      return (
        <button
          key={id}
          type="button"
          aria-pressed={active}
          onClick={() => onSelect?.(id)}
          className={cn(
            "h-7 cursor-pointer rounded-full border-0 px-3 font-sans text-xs font-medium transition-all duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "bg-card text-foreground shadow-sm"
              : "bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      );
    })}
  </div>
);

const SubmitControl = ({
  status,
  canSubmit,
  onSubmit,
  onStop,
}: {
  status: PromptInputStatus;
  canSubmit: boolean;
  onSubmit: () => void;
  onStop?: () => void;
}) => {
  if (status === "streaming") {
    return (
      <button
        type="button"
        aria-label="停止生成"
        onClick={onStop}
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-primary-foreground shadow-sm transition-transform duration-(--ui-duration-fast) hover:bg-primary/90 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Square aria-hidden="true" className="size-3.5 fill-current" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="发送"
      disabled={!canSubmit || status === "disabled"}
      onClick={onSubmit}
      className={cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 transition-all duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        canSubmit && status !== "disabled"
          ? "bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_14px_-2px_rgba(37,99,235,0.45)] hover:brightness-105 active:scale-95"
          : "cursor-not-allowed bg-secondary text-muted-foreground/55",
      )}
    >
      <ArrowUp aria-hidden="true" className="size-4" />
    </button>
  );
};

const SuggestionRow = ({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (text: string) => void;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {suggestions.map((text) => (
      <button
        key={text}
        type="button"
        onClick={() => onPick(text)}
        className="cursor-pointer rounded-full border border-solid border-border/90 bg-card px-3 py-1.5 font-sans text-xs font-medium text-muted-foreground shadow-xs transition-all duration-(--ui-duration-fast) hover:-translate-y-0.5 hover:border-signal/40 hover:text-foreground hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {text}
      </button>
    ))}
  </div>
);

interface PromptToolbarProps {
  onAttach?: () => void;
  models: PromptModelOption[];
  selectedModel?: string;
  onModelChange?: (id: string) => void;
  toolbarLeft?: ReactNode;
  maxLength?: number;
  length: number;
  status: PromptInputStatus;
  canSubmit: boolean;
  onSubmit: () => void;
  onStop?: () => void;
}

const PromptToolbar = (props: PromptToolbarProps) => (
  <div className="mt-1 flex items-center justify-between gap-2 px-1">
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      {props.onAttach && (
        <button
          type="button"
          aria-label="添加附件"
          disabled={props.status === "disabled"}
          onClick={props.onAttach}
          className={ICON_BTN_CLASSES}
        >
          <Paperclip aria-hidden="true" className="size-4" />
        </button>
      )}
      {props.models.length > 0 && (
        <ModelPills
          models={props.models}
          selectedModel={props.selectedModel}
          onSelect={props.onModelChange}
        />
      )}
      {props.toolbarLeft}
    </div>
    <div className="flex shrink-0 items-center gap-2.5">
      {props.maxLength !== undefined && (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {props.length}/{props.maxLength}
        </span>
      )}
      <SubmitControl
        status={props.status}
        canSubmit={props.canSubmit}
        onSubmit={props.onSubmit}
        onStop={props.onStop}
      />
    </div>
  </div>
);
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
