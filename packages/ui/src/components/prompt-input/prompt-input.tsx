"use client";

/**
 * PromptInput：器物级多模态 AI 输入器（融合极简发丝质感与复合子部件自由拼装）。
 * 支持自适应多行、中文 IME 组合防误触、斜杠快捷指令、@ 上下文标签、流式待发入队与复合子部件自由拼装。
 */
import { cn } from "@matt-ui/utils";
import { useCallback, useContext, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { HeaderChips, SlashMenu, SuggestionChips } from "./prompt-chips.js";
import type {
  PromptInputProps,
  PromptInputSize,
  PromptInputTextareaProps,
  PromptSlashCommand,
} from "./prompt-input.types.js";
import { promptShellVariants, promptTextareaVariants } from "./prompt-input.variants.js";
import {
  DefaultToolbar,
  PromptCtx,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTools,
} from "./prompt-parts.js";

const MIN_HEIGHT_BY_SIZE: Record<PromptInputSize, number> = {
  sm: 36,
  md: 42,
  lg: 48,
};

const syncTextareaHeight = (
  el: HTMLTextAreaElement | null,
  value: string,
  size: PromptInputSize,
) => {
  if (!el) return;
  const minHeight = MIN_HEIGHT_BY_SIZE[size];
  el.style.height = "auto";
  const nextHeight = value.length > 0 ? Math.min(el.scrollHeight, 196) : minHeight;
  el.style.height = `${Math.max(minHeight, nextHeight)}px`;
};

export const PromptInputTextarea = ({
  placeholder,
  maxLength,
  disabled,
  className,
  "aria-label": ariaLabel,
  ...props
}: PromptInputTextareaProps) => {
  const ctx = useContext(PromptCtx);
  const localRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    syncTextareaHeight(localRef.current, ctx.text, ctx.size);
  }, [ctx.text, ctx.size]);

  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      localRef.current = node;
      ctx.registerTextarea(node);
    },
    [ctx],
  );

  return (
    <textarea
      ref={setRefs}
      rows={1}
      value={ctx.text}
      maxLength={maxLength ?? ctx.maxLength}
      disabled={disabled ?? ctx.status === "disabled"}
      placeholder={placeholder ?? ctx.placeholder}
      aria-label={ariaLabel ?? ctx.ariaLabel}
      data-slot="prompt-input-textarea"
      onChange={(event) => ctx.updateText(event.target.value)}
      onKeyDown={ctx.onKeyDown}
      className={cn(promptTextareaVariants({ size: ctx.size }), className)}
      {...props}
    />
  );
};

const matchSlashCommands = (text: string, commands: PromptSlashCommand[]) => {
  if (!text.startsWith("/") || text.includes(" ") || text.includes("\n") || commands.length === 0) {
    return [];
  }
  const keyword = text.slice(1).toLowerCase();
  return commands.filter(
    (c) =>
      c.command.toLowerCase().includes(keyword) || c.description.toLowerCase().includes(keyword),
  );
};

const handleSlashKey = (
  event: KeyboardEvent<HTMLTextAreaElement>,
  matched: PromptSlashCommand[],
  safeIdx: number,
  setSlashIdx: React.Dispatch<React.SetStateAction<number>>,
  applySlash: (cmd: PromptSlashCommand) => void,
): boolean => {
  if (matched.length === 0) return false;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    setSlashIdx((i) => (i + 1) % matched.length);
    return true;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    setSlashIdx((i) => (i - 1 + matched.length) % matched.length);
    return true;
  }
  if (event.key === "Tab" || (event.key === "Enter" && !event.shiftKey)) {
    event.preventDefault();
    const picked = matched[safeIdx];
    if (picked) applySlash(picked);
    return true;
  }
  return false;
};

const dispatchPromptAction = (
  props: PromptInputProps,
  trimmed: string,
  canQueue: boolean,
  canSubmit: boolean,
  clearInner: () => void,
) => {
  if (canQueue) {
    props.onQueue?.(trimmed);
    if (props.value === undefined) clearInner();
    return;
  }
  if (!canSubmit) return;
  props.onSubmit?.(trimmed);
  if (props.value === undefined) clearInner();
};

const usePromptController = (props: PromptInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [inner, setInner] = useState(props.defaultValue ?? "");
  const [slashIdx, setSlashIdx] = useState(0);

  const text = props.value ?? inner;
  const status = props.status ?? "idle";
  const trimmed = text.trim();
  const canSubmit = trimmed.length > 0 && status === "idle";
  const canQueue = trimmed.length > 0 && status === "streaming" && Boolean(props.onQueue);
  const matchedSlash = matchSlashCommands(text, props.slashCommands ?? []);
  const safeSlashIdx = matchedSlash.length > 0 ? slashIdx % matchedSlash.length : 0;

  const updateText = (next: string) => {
    if (props.value === undefined) setInner(next);
    setSlashIdx(0);
    props.onValueChange?.(next);
  };

  const applySlash = (cmd: PromptSlashCommand) => {
    updateText(cmd.template ?? `/${cmd.command} `);
    props.onSelectSlashCommand?.(cmd);
    textareaRef.current?.focus();
  };

  const submitOrQueue = () =>
    dispatchPromptAction(props, trimmed, canQueue, canSubmit, () => setInner(""));

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (handleSlashKey(event, matchedSlash, safeSlashIdx, setSlashIdx, applySlash)) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitOrQueue();
    }
  };

  const registerTextarea = useCallback((node: HTMLTextAreaElement | null) => {
    textareaRef.current = node;
  }, []);

  return {
    text,
    status,
    canSubmit,
    canQueue,
    matchedSlash,
    safeSlashIdx,
    registerTextarea,
    focusInput: () => textareaRef.current?.focus(),
    updateText,
    applySlash,
    submitOrQueue,
    onKeyDown,
  };
};

const DefaultComposerBody = ({
  props,
  length,
  disabled,
}: {
  props: PromptInputProps;
  length: number;
  disabled: boolean;
}) => {
  const attachments = props.attachments ?? [];
  const contextRefs = props.contextRefs ?? [];

  return (
    <>
      {(attachments.length > 0 || contextRefs.length > 0) && (
        <HeaderChips
          contextRefs={contextRefs}
          onRemoveContextRef={props.onRemoveContextRef}
          attachments={attachments}
          onRemoveAttachment={props.onRemoveAttachment}
        />
      )}
      <PromptInputTextarea />
      <DefaultToolbar
        onAttach={props.onAttach}
        models={props.models ?? []}
        selectedModel={props.selectedModel}
        onModelChange={props.onModelChange}
        toolbarLeft={props.toolbarLeft}
        toolbarRight={props.toolbarRight}
        maxLength={props.maxLength}
        length={length}
        disabled={disabled}
      />
    </>
  );
};

const PromptFeedback = ({ error, hint }: { error?: string; hint?: string }) => {
  if (error) {
    return (
      <p role="alert" className="m-0 px-1.5 text-xs font-medium text-destructive">
        {error}
      </p>
    );
  }
  return hint ? <p className="m-0 px-1.5 text-[11px] text-muted-foreground">{hint}</p> : null;
};

const buildPromptContext = (
  props: PromptInputProps,
  c: ReturnType<typeof usePromptController>,
  size: PromptInputSize,
) => ({
  text: c.text,
  status: c.status,
  size,
  canSubmit: c.canSubmit,
  canQueue: c.canQueue,
  maxLength: props.maxLength,
  placeholder: props.placeholder ?? "输入你的问题，或键入 / 呼出快捷指令…",
  ariaLabel: props["aria-label"] ?? "指令输入框",
  registerTextarea: c.registerTextarea,
  updateText: c.updateText,
  submitOrQueue: c.submitOrQueue,
  onStop: props.onStop,
  onKeyDown: c.onKeyDown,
});

const resolvePromptOptions = (props: PromptInputProps) => ({
  suggestions: props.suggestions ?? [],
  suggestionsPos: props.suggestionsPosition ?? ("bottom" as const),
  variant: props.variant ?? ("default" as const),
  size: props.size ?? ("md" as const),
  radius: props.radius ?? ("xl" as const),
});

export const PromptInput = (props: PromptInputProps) => {
  const c = usePromptController(props);
  const opts = resolvePromptOptions(props);
  const pickSuggestion = (item: string) => {
    c.updateText(item);
    props.onSelectSuggestion?.(item);
    c.focusInput();
  };

  return (
    <PromptCtx.Provider value={buildPromptContext(props, c, opts.size)}>
      <div
        data-slot="prompt-input"
        data-status={c.status}
        data-variant={opts.variant}
        className={cn("flex w-full max-w-2xl flex-col gap-2 font-sans", props.className)}
      >
        {opts.suggestions.length > 0 && opts.suggestionsPos === "top" && (
          <SuggestionChips suggestions={opts.suggestions} onPick={pickSuggestion} />
        )}
        {c.matchedSlash.length > 0 && (
          <SlashMenu commands={c.matchedSlash} activeIdx={c.safeSlashIdx} onPick={c.applySlash} />
        )}
        <div
          className={promptShellVariants({
            variant: opts.variant,
            size: opts.size,
            radius: opts.radius,
            invalid: Boolean(props.error),
          })}
        >
          {props.children ?? (
            <DefaultComposerBody
              props={props}
              length={c.text.length}
              disabled={c.status === "disabled"}
            />
          )}
        </div>
        {opts.suggestions.length > 0 && opts.suggestionsPos === "bottom" && (
          <SuggestionChips suggestions={opts.suggestions} onPick={pickSuggestion} />
        )}
        <PromptFeedback error={props.error} hint={props.hint} />
      </div>
    </PromptCtx.Provider>
  );
};

export { PromptInputFooter, PromptInputHeader, PromptInputSubmit, PromptInputTools };
