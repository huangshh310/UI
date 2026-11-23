"use client";

/**
 * Message：单回合对话复合组件（对标 shadcn AI Elements Message + ChatGPT/Claude 无框流式排版）。
 * 支持元信息头（作者/模型徽章/时间戳）、多版本分支切换、原位编辑与异常重试。
 */
import { cn } from "@matt-ui/utils";
import { AlertCircle, Check, RotateCcw } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageEditForm,
} from "./message-parts.js";
import type {
  MessageActionProps,
  MessageActionsProps,
  MessageContentProps,
  MessageContextValue,
  MessageProps,
} from "./message.types.js";
import {
  MESSAGE_FOCUS_RING,
  messageActionVariants,
  messageContentVariants,
} from "./message.variants.js";

const MessageCtx = createContext<MessageContextValue>({
  from: "assistant",
  status: "ready",
  variant: "default",
});

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
        <span className="rounded-md border border-solid border-border/75 bg-secondary/70 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground dark:border-white/10 dark:bg-white/8">
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
      <div className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-solid border-border/75 bg-secondary/70 px-2.5 py-0.5 font-sans text-[11px] text-muted-foreground dark:border-white/10 dark:bg-white/8">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/75" />
        <span>已停止生成</span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div
        role="alert"
        className="mt-1.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-solid border-destructive/35 bg-destructive/8 px-3.5 py-2 text-xs text-foreground dark:border-destructive dark:bg-destructive/14"
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
              "inline-flex h-6.5 cursor-pointer items-center gap-1 rounded-lg border border-solid border-border/80 bg-card px-2.5 font-sans text-xs font-medium text-foreground shadow-xs transition-colors duration-(--ui-duration-fast) hover:bg-accent dark:border-white/12",
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
