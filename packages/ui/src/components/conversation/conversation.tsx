"use client";

/**
 * Conversation：流式对话滚动容器原语（对标 Vercel AI Elements / ChatGPT / Claude 贴底锚定）。
 * 流式输出时若视口处于底部则自动跟随，用户上滚阅读时立即解绑并浮现克制回到底部按钮。
 */
import { cn } from "@matt-ui/utils";
import { ArrowDown, MessageSquare } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type {
  ConversationContentProps,
  ConversationContextValue,
  ConversationEmptyStateProps,
  ConversationProps,
  ConversationScrollButtonProps,
} from "./conversation.types.js";
import {
  conversationContentVariants,
  conversationEmptyVariants,
  conversationRootVariants,
  conversationScrollButtonVariants,
} from "./conversation.variants.js";

const ConversationCtx = createContext<ConversationContextValue>({
  isAtBottom: true,
  unreadCount: 0,
  scrollToBottom: () => {},
});

export const useConversation = () => useContext(ConversationCtx);

const checkIsNearBottom = (el: HTMLElement, threshold: number) =>
  el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;

const useStickToBottom = (
  bottomThreshold: number,
  onAtBottomChange?: (atBottom: boolean) => void,
) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const atBottomRef = useRef(true);

  const updateAtBottom = useCallback(
    (next: boolean) => {
      if (atBottomRef.current === next) return;
      atBottomRef.current = next;
      setIsAtBottom(next);
      onAtBottomChange?.(next);
    },
    [onAtBottomChange],
  );

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const el = viewportRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior });
      updateAtBottom(true);
    },
    [updateAtBottom],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(() => {
      if (atBottomRef.current) el.scrollTo?.({ top: el.scrollHeight, behavior: "auto" });
    });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    const el = viewportRef.current;
    if (el) updateAtBottom(checkIsNearBottom(el, bottomThreshold));
  };

  return { viewportRef, isAtBottom, scrollToBottom, handleScroll };
};

export const Conversation = ({
  variant = "minimal",
  fadeEdges = false,
  bottomThreshold = 36,
  unreadCount = 0,
  onAtBottomChange,
  className,
  children,
  ...props
}: ConversationProps) => {
  const { viewportRef, isAtBottom, scrollToBottom, handleScroll } = useStickToBottom(
    bottomThreshold,
    onAtBottomChange,
  );

  return (
    <ConversationCtx.Provider value={{ isAtBottom, unreadCount, scrollToBottom }}>
      <div
        data-slot="conversation"
        data-variant={variant}
        data-at-bottom={isAtBottom ? "true" : "false"}
        className={cn(conversationRootVariants({ variant }), className)}
        {...props}
      >
        {fadeEdges && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-background via-background/60 to-transparent"
          />
        )}
        <div
          ref={viewportRef}
          data-slot="conversation-viewport"
          onScroll={handleScroll}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto scroll-smooth"
        >
          {children}
        </div>
        {fadeEdges && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-background via-background/60 to-transparent"
          />
        )}
      </div>
    </ConversationCtx.Provider>
  );
};

export const ConversationContent = ({
  size = "md",
  className,
  children,
  ...props
}: ConversationContentProps) => (
  <div
    role="log"
    aria-live="polite"
    data-slot="conversation-content"
    className={cn(conversationContentVariants({ size }), className)}
    {...props}
  >
    {children}
  </div>
);

export const ConversationEmptyState = ({
  icon,
  badge,
  title = "有什么我可以帮你的？",
  description,
  size = "md",
  className,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    data-slot="conversation-empty-state"
    className={cn(conversationEmptyVariants({ size }), className)}
    {...props}
  >
    <span className="inline-flex size-9 items-center justify-center rounded-xl border border-solid border-border bg-card text-foreground/80 shadow-xs dark:border-white/10">
      {icon ?? <MessageSquare aria-hidden="true" className="size-4" />}
    </span>
    {badge && (
      <span className="inline-flex items-center rounded-full border border-solid border-border bg-muted/60 px-2.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground dark:border-white/10 dark:bg-white/6">
        {badge}
      </span>
    )}
    <div className="flex max-w-md flex-col gap-1.5">
      <p
        className={cn(
          "m-0 font-sans font-semibold tracking-tight text-foreground",
          size === "sm" ? "text-base" : "text-lg",
        )}
      >
        {title}
      </p>
      {description && (
        <p className="m-0 text-xs leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
    {children && <div className="mt-2 w-full">{children}</div>}
  </div>
);

const UnreadBadge = ({ count, floating }: { count: number; floating?: boolean }) =>
  count > 0 ? (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex min-w-4 items-center justify-center rounded-full bg-signal px-1.5 py-0.5 font-mono text-[10px] leading-none font-semibold text-signal-foreground tabular-nums",
        floating && "pointer-events-none absolute -top-1.5 -right-1.5 shadow-xs",
      )}
    >
      {count}
    </span>
  ) : null;

export const ConversationScrollButton = ({
  variant = "pill",
  label = "回到底部",
  forceVisible = false,
  className,
  onClick,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, unreadCount, scrollToBottom } = useConversation();
  if (isAtBottom && !forceVisible) return null;

  const ariaLabel = unreadCount > 0 ? `${label}（${unreadCount} 条新消息）` : label;

  return (
    <div className="pointer-events-none sticky bottom-3 z-20 mt-auto flex justify-center px-4 pb-1">
      <div className="relative inline-flex">
        <button
          type="button"
          aria-label={ariaLabel}
          data-slot="conversation-scroll-button"
          data-variant={variant}
          onClick={(event) => {
            scrollToBottom("smooth");
            onClick?.(event);
          }}
          className={cn(conversationScrollButtonVariants({ variant }), className)}
          {...props}
        >
          <ArrowDown aria-hidden="true" className="size-3.5 text-foreground" />
          {variant === "pill" && (
            <>
              <span>{label}</span>
              <UnreadBadge count={unreadCount} />
            </>
          )}
        </button>
        {variant === "icon" && <UnreadBadge count={unreadCount} floating />}
      </div>
    </div>
  );
};
