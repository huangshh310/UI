// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Message：单回合无框流式对话复合组件。
 * 支持元信息头（作者/模型微标/时间戳）、多版本分支切换、原位编辑与异常重试。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AlertCircle, Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import {
  Children,
  createContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const MESSAGE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const MESSAGE_PAGER_BTN = `inline-flex size-6 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 ${MESSAGE_FOCUS_RING}`;

export const messageContentVariants = cva("font-sans", {
  variants: {
    from: {
      user: "max-w-[84%] bg-secondary/80 text-foreground dark:bg-white/10",
      assistant: "w-full text-foreground",
      system:
        "rounded-full border border-solid border-border bg-muted/60 px-3 py-1 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/6",
    },
    variant: {
      default: "",
      compact: "",
      flat: "",
    },
  },
  compoundVariants: [
    {
      from: "user",
      variant: "default",
      class: "rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed",
    },
    {
      from: "user",
      variant: "compact",
      class: "rounded-xl rounded-br-sm px-3 py-2 text-xs leading-relaxed",
    },
    {
      from: "user",
      variant: "flat",
      class:
        "max-w-full rounded-xl bg-secondary/60 px-3.5 py-2.5 text-sm leading-relaxed dark:bg-white/8",
    },
    { from: "assistant", variant: "default", class: "text-sm leading-7" },
    { from: "assistant", variant: "compact", class: "text-xs leading-6" },
    { from: "assistant", variant: "flat", class: "text-sm leading-7" },
  ],
  defaultVariants: {
    from: "assistant",
    variant: "default",
  },
});

export const messageActionVariants = cva(
  `inline-flex h-7 min-w-7 cursor-pointer items-center justify-center gap-1 rounded-lg border border-solid border-transparent bg-transparent px-1.5 font-sans text-xs transition-colors duration-(--ui-duration-fast) ${MESSAGE_FOCUS_RING}`,
  {
    variants: {
      tone: {
        default: "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
        destructive: "text-muted-foreground hover:bg-destructive/12 hover:text-destructive",
      },
      active: {
        true: "border-border bg-secondary/85 text-foreground hover:bg-secondary dark:border-white/10 dark:bg-white/12",
        false: "",
      },
    },
    defaultVariants: {
      tone: "default",
      active: false,
    },
  },
);
export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "ready" | "streaming" | "stopped" | "error";
export type MessageVariant = "default" | "compact" | "flat";
export type MessageActionTone = "default" | "destructive";

export interface MessageContextValue {
  from: MessageRole;
  status: MessageStatus;
  variant: MessageVariant;
  errorMessage?: string;
  onRetry?: () => void;
}

export interface MessageProps extends HTMLAttributes<HTMLElement> {
  /** 消息发送方角色（采用 from 属性命名，避免与原生 ARIA role 冲突） */
  from: MessageRole;
  /** 生成状态，默认 ready */
  status?: MessageStatus;
  /** 排版视觉变体：default 经典气泡+无框流式、compact 紧凑侧栏、flat 全左对齐极简流，默认 default */
  variant?: MessageVariant;
  /** 可选发送方或助手展示名 */
  author?: string;
  /** 可选模型标识等宽徽章（如 "Matt Pro 4"） */
  model?: string;
  /** 可选时间戳文案（如 "刚刚" / "14:22"） */
  timestamp?: string;
  /** 可选头像节点 */
  avatar?: ReactNode;
  /** status="error" 时展示的错误说明 */
  errorMessage?: string;
  /** status="error" 时点击重试的回调 */
  onRetry?: () => void;
}

export interface MessageContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface MessageActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** 是否默认弱化并在消息悬停或键盘聚焦时显现，默认 false */
  revealOnHover?: boolean;
}

export interface MessageActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 无障碍操作说明（必填以确保图标按钮可访问） */
  label: string;
  /** 是否处于激活态（如已点赞/已点踩） */
  active?: boolean;
  /** 动作色调，默认 default */
  tone?: MessageActionTone;
  /** 传入后点击自动写入剪贴板并在短时间内切换已复制视觉反馈 */
  copyText?: string;
}

export interface MessageBranchProps extends HTMLAttributes<HTMLDivElement> {
  /** 非受控初始分支索引，默认 0 */
  defaultBranch?: number;
  /** 受控当前分支索引 */
  branch?: number;
  /** 分支切换回调 */
  onBranchChange?: (branch: number) => void;
}

export interface MessageBranchContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface MessageBranchSelectorProps extends HTMLAttributes<HTMLDivElement> {}

export interface MessageEditFormProps {
  /** 初始待编辑文本 */
  defaultValue: string;
  /** 保存并重新生成回调 */
  onSave: (nextText: string) => void;
  /** 取消编辑回调 */
  onCancel: () => void;
  /** 提交按钮文案，默认「保存并重发」 */
  submitLabel?: string;
  className?: string;
}
const MessageCtx = createContext<MessageContextValue>({
  from: "assistant",
  status: "ready",
  variant: "default",
});

interface BranchContextValue {
  branch: number;
  total: number;
  setTotal: (count: number) => void;
  setBranch: (next: number) => void;
}

const BranchCtx = createContext<BranchContextValue>({
  branch: 0,
  total: 1,
  setTotal: () => {},
  setBranch: () => {},
});

const MessageBranch = ({
  defaultBranch = 0,
  branch: controlledBranch,
  onBranchChange,
  className,
  children,
  ...props
}: MessageBranchProps) => {
  const [innerBranch, setInnerBranch] = useState(defaultBranch);
  const [total, setTotal] = useState(1);
  const branch = controlledBranch !== undefined ? controlledBranch : innerBranch;

  const setBranch = (next: number) => {
    if (total <= 1) return;
    const clamped = ((next % total) + total) % total;
    if (controlledBranch === undefined) setInnerBranch(clamped);
    onBranchChange?.(clamped);
  };

  return (
    <BranchCtx.Provider value={{ branch, total, setTotal, setBranch }}>
      <div
        data-slot="message-branch"
        className={cn("flex w-full flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </BranchCtx.Provider>
  );
};

const MessageBranchContent = ({ className, children, ...props }: MessageBranchContentProps) => {
  const { branch, total, setTotal } = useContext(BranchCtx);
  const items = Children.toArray(children);
  useEffect(() => {
    if (items.length > 0 && items.length !== total) setTotal(items.length);
  }, [items.length, total, setTotal]);
  const safeIndex = items.length > 0 ? Math.min(Math.max(0, branch), items.length - 1) : 0;

  return (
    <div data-slot="message-branch-content" className={cn("w-full", className)} {...props}>
      {items[safeIndex] ?? null}
    </div>
  );
};

const MessageBranchSelector = ({ className, ...props }: MessageBranchSelectorProps) => {
  const { branch, total, setBranch } = useContext(BranchCtx);
  if (total <= 1) return null;

  return (
    <div
      data-slot="message-branch-selector"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-solid border-border bg-muted/60 px-0.5 font-mono text-[11px] text-muted-foreground tabular-nums dark:border-white/10 dark:bg-white/6",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        aria-label="上一分支版本"
        onClick={() => setBranch(branch - 1)}
        className={MESSAGE_PAGER_BTN}
      >
        <ChevronLeft aria-hidden="true" className="size-3.5" />
      </button>
      <span className="px-1">
        {branch + 1} / {total}
      </span>
      <button
        type="button"
        aria-label="下一分支版本"
        onClick={() => setBranch(branch + 1)}
        className={MESSAGE_PAGER_BTN}
      >
        <ChevronRight aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
};

const EditFormFooter = ({
  canSave,
  submitLabel,
  onCancel,
  onSave,
}: {
  canSave: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSave: () => void;
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className="font-mono text-[10px] text-muted-foreground">⌘↵ 保存 · Esc 取消</span>
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onCancel}
        className={cn(
          "inline-flex h-7 cursor-pointer items-center rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium text-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent/60 dark:border-white/10",
          MESSAGE_FOCUS_RING,
        )}
      >
        取消
      </button>
      <button
        type="button"
        disabled={!canSave}
        onClick={onSave}
        className={cn(
          "inline-flex h-7 cursor-pointer items-center rounded-lg border border-solid border-transparent bg-primary px-2.5 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-opacity duration-(--ui-duration-fast) hover:opacity-90 disabled:pointer-events-none disabled:opacity-45",
          MESSAGE_FOCUS_RING,
        )}
      >
        {submitLabel}
      </button>
    </div>
  </div>
);

const MessageEditForm = ({
  defaultValue,
  onSave,
  onCancel,
  submitLabel = "保存并重发",
  className,
}: MessageEditFormProps) => {
  const { from, variant } = useContext(MessageCtx);
  const [text, setText] = useState(defaultValue);
  const canSave = text.trim().length > 0;
  const alignRight = from === "user" && variant !== "flat";

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && canSave) {
      event.preventDefault();
      onSave(text.trim());
    }
  };

  return (
    <div
      data-slot="message-edit-form"
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-xl border border-solid border-border bg-card p-3 shadow-xs focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset dark:border-white/10",
        alignRight && "ml-auto max-w-[88%]",
        className,
      )}
    >
      <textarea
        rows={2}
        aria-label="编辑消息内容"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none border-0 bg-transparent font-sans text-sm leading-relaxed text-foreground outline-none"
      />
      <EditFormFooter
        canSave={canSave}
        submitLabel={submitLabel}
        onCancel={onCancel}
        onSave={() => canSave && onSave(text.trim())}
      />
    </div>
  );
};
const hasMessageMeta = (p: Pick<MessageProps, "author" | "model" | "timestamp" | "avatar">) =>
  Boolean(p.author || p.model || p.timestamp || p.avatar);

const MessageMetaHeader = (
  p: Pick<MessageProps, "from" | "author" | "model" | "timestamp" | "avatar"> & {
    variant: MessageContextValue["variant"];
  },
) => {
  if (!hasMessageMeta(p)) return null;
  const alignRight = p.from === "user" && p.variant !== "flat";
  return (
    <div
      data-slot="message-meta"
      className={cn(
        "flex items-center gap-2 text-[11px] text-muted-foreground",
        alignRight && "flex-row-reverse",
      )}
    >
      {p.avatar && <span className="shrink-0">{p.avatar}</span>}
      {p.author && <span className="font-medium text-foreground">{p.author}</span>}
      {p.model && (
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:bg-white/8">
          {p.model}
        </span>
      )}
      {p.timestamp && <span className="font-mono text-[10px] tabular-nums">{p.timestamp}</span>}
    </div>
  );
};

const MessageStatusFeedback = ({
  status,
  errorMessage,
  onRetry,
}: Pick<MessageContextValue, "status" | "errorMessage" | "onRetry">) => {
  if (status === "stopped") {
    return (
      <div className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 font-sans text-[11px] text-muted-foreground dark:bg-white/8">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/75" />
        <span>已停止生成</span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div
        role="alert"
        className="mt-1.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-solid border-destructive/30 bg-destructive/8 px-3.5 py-2.5 text-xs text-foreground dark:border-destructive/50 dark:bg-destructive/14"
      >
        <span className="inline-flex items-center gap-2">
          <AlertCircle aria-hidden="true" className="size-3.5 shrink-0 text-destructive" />
          <span>{errorMessage ?? "回复生成中断，请重试。"}</span>
        </span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs transition-colors duration-(--ui-duration-fast) hover:bg-accent/60 dark:border-white/10",
              MESSAGE_FOCUS_RING,
            )}
          >
            <RotateCcw aria-hidden="true" className="size-3" />
            <span>重试生成</span>
          </button>
        )}
      </div>
    );
  }
  return null;
};

export const Message = ({
  from,
  status = "ready",
  variant = "default",
  author,
  model,
  timestamp,
  avatar,
  errorMessage,
  onRetry,
  className,
  children,
  ...props
}: MessageProps) => (
  <MessageCtx.Provider value={{ from, status, variant, errorMessage, onRetry }}>
    <article
      data-slot="message"
      data-from={from}
      data-status={status}
      data-variant={variant}
      className={cn(
        "group/message flex w-full flex-col gap-1.5 font-sans",
        from === "user" && variant !== "flat" && "items-end",
        from === "system" && "items-center",
        className,
      )}
      {...props}
    >
      <MessageMetaHeader
        from={from}
        variant={variant}
        author={author}
        model={model}
        timestamp={timestamp}
        avatar={avatar}
      />
      {children}
      {from === "assistant" && (
        <MessageStatusFeedback status={status} errorMessage={errorMessage} onRetry={onRetry} />
      )}
    </article>
  </MessageCtx.Provider>
);

export const MessageContent = ({ className, children, ...props }: MessageContentProps) => {
  const { from, status, variant } = useContext(MessageCtx);

  return (
    <div
      data-slot="message-content"
      className={cn(messageContentVariants({ from, variant }), className)}
      {...props}
    >
      {children}
      {from === "assistant" && status === "streaming" && (
        <span
          aria-hidden="true"
          className="ml-1 inline-block h-3.5 w-0.5 animate-pulse rounded-full bg-signal align-text-bottom motion-reduce:animate-none"
        />
      )}
    </div>
  );
};

export const MessageActions = ({
  revealOnHover = false,
  className,
  children,
  ...props
}: MessageActionsProps) => {
  const { from, variant } = useContext(MessageCtx);
  return (
    <div
      data-slot="message-actions"
      className={cn(
        "flex flex-wrap items-center gap-1",
        from === "user" && variant !== "flat" && "justify-end",
        revealOnHover &&
          "opacity-100 transition-opacity duration-(--ui-duration-fast) sm:opacity-0 sm:group-focus-within/message:opacity-100 sm:group-hover/message:opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const MessageAction = ({
  label,
  active,
  tone = "default",
  copyText,
  className,
  onClick,
  children,
  ...props
}: MessageActionProps) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClick: MessageActionProps["onClick"] = (event) => {
    if (copyText !== undefined) {
      navigator.clipboard?.writeText(copyText).catch(() => {});
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setCopied(false);
      }, 1400);
    }
    onClick?.(event);
  };

  return (
    <button
      type="button"
      aria-label={copied ? "已复制" : label}
      aria-pressed={active}
      data-slot="message-action"
      onClick={handleClick}
      className={cn(messageActionVariants({ tone, active: Boolean(active) }), className)}
      {...props}
    >
      {copied ? <Check aria-hidden="true" className="size-3.5 text-foreground" /> : children}
    </button>
  );
};

export { MessageBranch, MessageBranchContent, MessageBranchSelector, MessageEditForm };
