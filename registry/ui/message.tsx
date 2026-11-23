// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Message：单回合对话复合组件（对标 shadcn AI Elements Message + HextaUI 版本分支与状态反馈）。
 * 用户提问采用温润次级表面胶囊，助手响应采用无外框流式画布排版，支持分支切换、原位编辑与异常重试。
 */

import { cn } from "@/lib/utils";
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

export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "ready" | "streaming" | "stopped" | "error";

export interface MessageContextValue {
  from: MessageRole;
  status: MessageStatus;
  errorMessage?: string;
  onRetry?: () => void;
}

export interface MessageProps extends HTMLAttributes<HTMLElement> {
  /** 消息发送方角色（对齐 shadcn AI Elements 的 from 属性，避免与原生 ARIA role 冲突） */
  from: MessageRole;
  /** 生成状态，默认 ready */
  status?: MessageStatus;
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

const PAGER_BTN_CLASSES =
  "inline-flex size-6 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40";

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
        "inline-flex items-center gap-0.5 font-mono text-[11px] text-muted-foreground tabular-nums",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        aria-label="上一分支版本"
        onClick={() => setBranch(branch - 1)}
        className={PAGER_BTN_CLASSES}
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
        className={PAGER_BTN_CLASSES}
      >
        <ChevronRight aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
};

const EditFormButtons = ({
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
  <div className="flex items-center justify-end gap-2">
    <button
      type="button"
      onClick={onCancel}
      className="inline-flex h-7 cursor-pointer items-center rounded-full border border-solid border-border bg-secondary/60 px-3 font-sans text-xs font-medium text-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      取消
    </button>
    <button
      type="button"
      disabled={!canSave}
      onClick={onSave}
      className="inline-flex h-7 cursor-pointer items-center rounded-full border-0 bg-primary px-3 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-opacity duration-(--ui-duration-fast) hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45"
    >
      {submitLabel}
    </button>
  </div>
);

const MessageEditForm = ({
  defaultValue,
  onSave,
  onCancel,
  submitLabel = "保存并重发",
  className,
}: MessageEditFormProps) => {
  const [text, setText] = useState(defaultValue);
  const canSave = text.trim().length > 0;

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
        "ml-auto flex w-full max-w-[88%] flex-col gap-2.5 rounded-2xl border border-solid border-border bg-card p-3 shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset",
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
      <EditFormButtons
        canSave={canSave}
        submitLabel={submitLabel}
        onCancel={onCancel}
        onSave={() => canSave && onSave(text.trim())}
      />
    </div>
  );
};
const MessageCtx = createContext<MessageContextValue>({
  from: "assistant",
  status: "ready",
});

const ACTION_BTN_CLASSES =
  "inline-flex h-7 min-w-7 cursor-pointer items-center justify-center gap-1 rounded-lg border-0 bg-transparent px-1.5 font-sans text-xs text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

const StatusFeedback = ({
  status,
  errorMessage,
  onRetry,
}: Pick<MessageContextValue, "status" | "errorMessage" | "onRetry">) => {
  if (status === "stopped") {
    return (
      <div className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary/75 px-2.5 py-0.5 font-sans text-[11px] text-muted-foreground">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/70" />
        <span>已停止生成</span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div
        role="alert"
        className="mt-1.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-solid border-destructive/30 bg-destructive/8 px-3.5 py-2 text-xs text-foreground"
      >
        <span className="inline-flex items-center gap-2">
          <AlertCircle aria-hidden="true" className="size-3.5 shrink-0 text-destructive" />
          <span>{errorMessage ?? "回复生成中断，请重试。"}</span>
        </span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-6.5 cursor-pointer items-center gap-1 rounded-lg border border-solid border-border bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs transition-colors duration-(--ui-duration-fast) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
  errorMessage,
  onRetry,
  className,
  children,
  ...props
}: MessageProps) => (
  <MessageCtx.Provider value={{ from, status, errorMessage, onRetry }}>
    <article
      data-slot="message"
      data-from={from}
      data-status={status}
      className={cn(
        "group/message flex w-full flex-col gap-1.5 font-sans",
        from === "user" && "items-end",
        from === "system" && "items-center",
        className,
      )}
      {...props}
    >
      {children}
      {from === "assistant" && (
        <StatusFeedback status={status} errorMessage={errorMessage} onRetry={onRetry} />
      )}
    </article>
  </MessageCtx.Provider>
);

export const MessageContent = ({ className, children, ...props }: MessageContentProps) => {
  const { from, status } = useContext(MessageCtx);

  return (
    <div
      data-slot="message-content"
      className={cn(
        from === "user" &&
          "max-w-[82%] rounded-2xl rounded-br-md bg-secondary px-4 py-2.5 text-sm leading-relaxed text-secondary-foreground",
        from === "assistant" && "w-full text-sm leading-7 text-foreground",
        from === "system" &&
          "rounded-full border border-solid border-border/80 bg-secondary/45 px-3 py-1 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {from === "assistant" && status === "streaming" && (
        <span
          aria-hidden="true"
          className="ml-1 inline-block size-2 animate-pulse rounded-full bg-signal align-middle motion-reduce:animate-none"
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
  const { from } = useContext(MessageCtx);
  return (
    <div
      data-slot="message-actions"
      className={cn(
        "flex flex-wrap items-center gap-1",
        from === "user" && "justify-end",
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
      className={cn(
        ACTION_BTN_CLASSES,
        active && "bg-secondary text-foreground hover:bg-secondary/90",
        className,
      )}
      {...props}
    >
      {copied ? <Check aria-hidden="true" className="size-3.5 text-foreground" /> : children}
    </button>
  );
};

export { MessageBranch, MessageBranchContent, MessageBranchSelector, MessageEditForm };
