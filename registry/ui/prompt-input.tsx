// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * PromptInput：器物级多模态 AI 输入器（融合 HextaUI Prompt Composer 与 shadcn AI Elements Prompt Input）。
 * 支持自适应多行、中文 IME 组合防误触、斜杠快捷指令、@ 上下文标签、流式待发入队与复合子部件自由拼装。
 */

import { cn } from "@/lib/utils";
import {
  ArrowUp,
  AtSign,
  Code2,
  FileText,
  Image as ImageIcon,
  ListPlus,
  Loader2,
  Paperclip,
  Square,
  Terminal,
  X,
} from "lucide-react";
import {
  createContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface PromptAttachment {
  id: string;
  name: string;
  size?: string;
  /** 附件类型提示，用于渲染区分图标或状态 */
  kind?: "file" | "image" | "code";
}

export interface PromptContextRef {
  id: string;
  /** 上下文引用标签（如 @tokens.css、@docs） */
  label: string;
}

export interface PromptSlashCommand {
  id: string;
  /** 斜杠命令名（不含前导斜杠，如 "review"） */
  command: string;
  /** 命令标题或简述 */
  description: string;
  /** 选中后回填的模板文本（省略时回填 `/command `） */
  template?: string;
}

export interface PromptModelOption {
  id: string;
  label: string;
}

export type PromptInputStatus = "idle" | "submitting" | "streaming" | "disabled";

export interface PromptInputProps {
  /** 受控输入值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 内容变更回调 */
  onValueChange?: (value: string) => void;
  /** 提交回调（Enter 或点击发送按钮） */
  onSubmit?: (value: string) => void;
  /** 生成中继续提交时进入排队栈的回调（传入后 streaming 状态下输入非空文本可加入队列） */
  onQueue?: (value: string) => void;
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
  /** 已关联的 @ 上下文引用胶囊 */
  contextRefs?: PromptContextRef[];
  /** 移除 @ 上下文引用回调 */
  onRemoveContextRef?: (id: string) => void;
  /** 输入 `/` 前缀时呼出的快捷指令列表 */
  slashCommands?: PromptSlashCommand[];
  /** 选中斜杠指令回调 */
  onSelectSlashCommand?: (cmd: PromptSlashCommand) => void;
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
  /** 底部工具栏左侧自定义插槽（可嵌入 ModelSelector、Context 等紧凑组件） */
  toolbarLeft?: ReactNode;
  /** 底部工具栏右侧附加插槽（位于发送按钮左侧，如语音输入按钮） */
  toolbarRight?: ReactNode;
  /** 卡片下方的键盘辅助说明 */
  hint?: string;
  /** 复合子部件模式：传入 children 时按复合结构自由编排内部区域 */
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export interface PromptInputHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export interface PromptInputFooterProps extends HTMLAttributes<HTMLDivElement> {}
export interface PromptInputToolsProps extends HTMLAttributes<HTMLDivElement> {}
export interface PromptInputTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> {}
export interface PromptInputSubmitProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
const ATTACHMENT_ICON = {
  file: FileText,
  image: ImageIcon,
  code: Code2,
} as const;

const ContextChipItem = ({
  item,
  onRemove,
}: {
  item: PromptContextRef;
  onRemove?: (id: string) => void;
}) => (
  <span className="inline-flex h-6.5 items-center gap-1 rounded-lg border border-solid border-signal/25 bg-signal/8 px-2 font-mono text-[11px] font-medium text-foreground">
    <AtSign aria-hidden="true" className="size-3 text-signal" />
    <span className="max-w-32 truncate">{item.label}</span>
    {onRemove && (
      <button
        type="button"
        aria-label={`移除上下文 ${item.label}`}
        onClick={() => onRemove(item.id)}
        className="inline-flex size-4 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <X aria-hidden="true" className="size-2.5" />
      </button>
    )}
  </span>
);

const AttachmentChipItem = ({
  item,
  onRemove,
}: {
  item: PromptAttachment;
  onRemove?: (id: string) => void;
}) => {
  const Icon = ATTACHMENT_ICON[item.kind ?? "file"] ?? Paperclip;
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-xl border border-solid border-border bg-secondary/65 px-2.5 text-xs text-foreground">
      <Icon aria-hidden="true" className="size-3.5 shrink-0 text-signal" />
      <span className="max-w-36 truncate font-medium">{item.name}</span>
      {item.size && (
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {item.size}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          aria-label={`移除附件 ${item.name}`}
          onClick={() => onRemove(item.id)}
          className="inline-flex size-4 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <X aria-hidden="true" className="size-3" />
        </button>
      )}
    </span>
  );
};

const HeaderChips = ({
  contextRefs,
  onRemoveContextRef,
  attachments,
  onRemoveAttachment,
}: {
  contextRefs: PromptContextRef[];
  onRemoveContextRef?: (id: string) => void;
  attachments: PromptAttachment[];
  onRemoveAttachment?: (id: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5 px-1.5 pt-0.5 pb-1.5">
    {contextRefs.map((refItem) => (
      <ContextChipItem key={refItem.id} item={refItem} onRemove={onRemoveContextRef} />
    ))}
    {attachments.map((item) => (
      <AttachmentChipItem key={item.id} item={item} onRemove={onRemoveAttachment} />
    ))}
  </div>
);

const SlashMenu = ({
  commands,
  activeIdx,
  onPick,
}: {
  commands: PromptSlashCommand[];
  activeIdx: number;
  onPick: (cmd: PromptSlashCommand) => void;
}) => (
  <ul
    aria-label="快捷指令菜单"
    className="m-0 mb-1.5 flex list-none flex-col gap-0.5 rounded-2xl border border-solid border-border bg-popover p-1.5 text-popover-foreground shadow-md"
  >
    {commands.map((cmd, idx) => {
      const active = idx === activeIdx;
      return (
        <li key={cmd.id}>
          <button
            type="button"
            aria-pressed={active}
            onClick={() => onPick(cmd)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-0 px-2.5 py-1.5 text-left transition-colors duration-(--ui-duration-fast) focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active ? "bg-accent text-foreground" : "bg-transparent hover:bg-accent/60",
            )}
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
              <Terminal aria-hidden="true" className="size-3 text-signal" />
              <span>/{cmd.command}</span>
            </span>
            <span className="truncate font-sans text-xs text-muted-foreground">
              {cmd.description}
            </span>
          </button>
        </li>
      );
    })}
  </ul>
);

const SuggestionChips = ({
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
        className="cursor-pointer rounded-full border border-solid border-border/85 bg-card px-3 py-1 font-sans text-xs font-medium text-muted-foreground shadow-xs transition-all duration-(--ui-duration-fast) hover:-translate-y-0.5 hover:border-foreground/20 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {text}
      </button>
    ))}
  </div>
);
interface PromptContextValue {
  text: string;
  status: PromptInputStatus;
  canSubmit: boolean;
  canQueue: boolean;
  maxLength?: number;
  placeholder: string;
  ariaLabel: string;
  registerTextarea: (el: HTMLTextAreaElement | null) => void;
  updateText: (next: string) => void;
  submitOrQueue: () => void;
  onStop?: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const PromptCtx = createContext<PromptContextValue>({
  text: "",
  status: "idle",
  canSubmit: false,
  canQueue: false,
  placeholder: "输入你的问题…",
  ariaLabel: "指令输入框",
  registerTextarea: () => {},
  updateText: () => {},
  submitOrQueue: () => {},
  onKeyDown: () => {},
});

const ModelPills = ({
  models,
  selectedModel,
  onSelect,
}: {
  models: PromptModelOption[];
  selectedModel?: string;
  onSelect?: (id: string) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border/80 bg-secondary p-0.5">
    {models.map(({ id, label }) => {
      const active = id === selectedModel;
      return (
        <button
          key={id}
          type="button"
          aria-pressed={active}
          onClick={() => onSelect?.(id)}
          className={cn(
            "h-7 cursor-pointer rounded-full border-0 px-2.5 font-sans text-xs font-medium transition-all duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "bg-card text-foreground shadow-xs"
              : "bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      );
    })}
  </div>
);

const PromptInputHeader = ({ className, ...props }: PromptInputHeaderProps) => (
  <div
    data-slot="prompt-input-header"
    className={cn("flex flex-wrap items-center gap-1.5 px-1.5 pb-1", className)}
    {...props}
  />
);

const PromptInputFooter = ({ className, ...props }: PromptInputFooterProps) => (
  <div
    data-slot="prompt-input-footer"
    className={cn("mt-1 flex items-center justify-between gap-2 px-1", className)}
    {...props}
  />
);

const PromptInputTools = ({ className, ...props }: PromptInputToolsProps) => (
  <div
    data-slot="prompt-input-tools"
    className={cn("flex min-w-0 flex-wrap items-center gap-1.5", className)}
    {...props}
  />
);

const resolveSubmitMeta = (status: PromptInputStatus, canSubmit: boolean, canQueue: boolean) => {
  const isQueue = status === "streaming" && canQueue;
  const isSubmitting = status === "submitting";
  const enabled = (canSubmit || isQueue) && status !== "disabled" && !isSubmitting;
  const label = isQueue ? "加入待发队列" : isSubmitting ? "提交中" : "发送";
  return { isQueue, isSubmitting, enabled, label };
};

const SubmitGlyph = ({ isSubmitting, isQueue }: { isSubmitting: boolean; isQueue: boolean }) => {
  if (isSubmitting) {
    return (
      <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
    );
  }
  if (isQueue) return <ListPlus aria-hidden="true" className="size-4" />;
  return <ArrowUp aria-hidden="true" className="size-4" />;
};

const PromptInputSubmit = ({ className, onClick, ...props }: PromptInputSubmitProps) => {
  const ctx = useContext(PromptCtx);

  if (ctx.status === "streaming" && !ctx.canQueue) {
    return (
      <button
        type="button"
        aria-label="停止生成"
        data-slot="prompt-input-submit"
        onClick={(e) => {
          ctx.onStop?.();
          onClick?.(e);
        }}
        className={cn(
          "inline-flex size-8.5 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-primary-foreground shadow-xs transition-transform duration-(--ui-duration-fast) hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95",
          className,
        )}
        {...props}
      >
        <Square aria-hidden="true" className="size-3 fill-current" />
      </button>
    );
  }

  const meta = resolveSubmitMeta(ctx.status, ctx.canSubmit, ctx.canQueue);

  return (
    <button
      type="button"
      aria-label={meta.label}
      aria-busy={meta.isSubmitting || undefined}
      disabled={!meta.enabled}
      data-slot="prompt-input-submit"
      onClick={(e) => {
        ctx.submitOrQueue();
        onClick?.(e);
      }}
      className={cn(
        "inline-flex size-8.5 cursor-pointer items-center justify-center rounded-full border-0 transition-all duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
        meta.enabled
          ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95"
          : "cursor-not-allowed bg-secondary text-muted-foreground/50",
        className,
      )}
      {...props}
    >
      <SubmitGlyph isSubmitting={meta.isSubmitting} isQueue={meta.isQueue} />
    </button>
  );
};

const DefaultToolbar = (p: {
  onAttach?: () => void;
  models: PromptModelOption[];
  selectedModel?: string;
  onModelChange?: (id: string) => void;
  toolbarLeft?: ReactNode;
  toolbarRight?: ReactNode;
  maxLength?: number;
  length: number;
  disabled: boolean;
}) => (
  <PromptInputFooter>
    <PromptInputTools>
      {p.onAttach && (
        <button
          type="button"
          aria-label="添加附件"
          disabled={p.disabled}
          onClick={p.onAttach}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
        >
          <Paperclip aria-hidden="true" className="size-4" />
        </button>
      )}
      {p.models.length > 0 && (
        <ModelPills models={p.models} selectedModel={p.selectedModel} onSelect={p.onModelChange} />
      )}
      {p.toolbarLeft}
    </PromptInputTools>
    <div className="flex shrink-0 items-center gap-2">
      {p.maxLength !== undefined && (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {p.length}/{p.maxLength}
        </span>
      )}
      {p.toolbarRight}
      <PromptInputSubmit />
    </div>
  </PromptInputFooter>
);
const COMPOSER_SHELL_CLASSES = cn(
  "flex flex-col rounded-3xl border border-solid border-border bg-card p-2.5 text-card-foreground shadow-xs",
  "transition-[border-color,box-shadow] duration-(--ui-duration-fast)",
  "hover:border-foreground/20 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset",
);

const TEXTAREA_CLASSES =
  "min-h-[42px] max-h-[196px] w-full resize-none appearance-none border-0 bg-transparent px-2.5 py-2 font-sans text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/80 disabled:cursor-not-allowed disabled:opacity-50";

const syncTextareaHeight = (el: HTMLTextAreaElement | null, value: string) => {
  if (!el) return;
  el.style.height = "auto";
  const nextHeight = value.length > 0 ? Math.min(el.scrollHeight, 196) : 42;
  el.style.height = `${Math.max(42, nextHeight)}px`;
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
    syncTextareaHeight(localRef.current, ctx.text);
  }, [ctx.text]);

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
      className={cn(TEXTAREA_CLASSES, className)}
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

export const PromptInput = (props: PromptInputProps) => {
  const c = usePromptController(props);
  const suggestions = props.suggestions ?? [];

  const pickSuggestion = (item: string) => {
    c.updateText(item);
    props.onSelectSuggestion?.(item);
    c.focusInput();
  };

  return (
    <PromptCtx.Provider
      value={{
        text: c.text,
        status: c.status,
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
      }}
    >
      <div
        data-slot="prompt-input"
        data-status={c.status}
        className={cn("flex w-full max-w-2xl flex-col gap-2 font-sans", props.className)}
      >
        {c.matchedSlash.length > 0 && (
          <SlashMenu commands={c.matchedSlash} activeIdx={c.safeSlashIdx} onPick={c.applySlash} />
        )}
        <div className={COMPOSER_SHELL_CLASSES}>
          {props.children ?? (
            <DefaultComposerBody
              props={props}
              length={c.text.length}
              disabled={c.status === "disabled"}
            />
          )}
        </div>
        {suggestions.length > 0 && (
          <SuggestionChips suggestions={suggestions} onPick={pickSuggestion} />
        )}
        {props.hint && <p className="m-0 px-1.5 text-[11px] text-muted-foreground">{props.hint}</p>}
      </div>
    </PromptCtx.Provider>
  );
};

export { PromptInputFooter, PromptInputHeader, PromptInputSubmit, PromptInputTools };
