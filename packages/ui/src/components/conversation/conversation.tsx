"use client";

/**
 * Conversation：流式对话滚动容器原语（对标 shadcn AI Elements Conversation + ChatGPT/Claude 贴底锚定）。
 * 流式输出时若视口处于底部则自动跟随，用户上滚阅读时立即解绑并浮现毛玻璃回到底部按钮。
 */
import { cn } from "@matt-ui/utils";
import { ArrowDown, Sparkles } from "lucide-react";
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
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-background/90 to-transparent"
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
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-background/90 to-transparent"
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
    <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-solid border-border/80 bg-card/92 text-signal shadow-[0_6px_20px_-8px_rgba(0,0,0,0.14)] dark:border-white/12 dark:bg-card/80">
      {icon ?? <Sparkles aria-hidden="true" className="size-5" />}
    </span>
    {badge && (
      <span className="inline-flex items-center rounded-full border border-solid border-border/75 bg-secondary/65 px-2.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground dark:border-white/10 dark:bg-white/7">
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
    {children && <div className="mt-1 w-full max-w-xl">{children}</div>}
  </div>
);

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
        <ArrowDown aria-hidden="true" className="size-3.5 text-signal" />
        {variant === "pill" && <span>{label}</span>}
        {unreadCount > 0 && (
          <span
            className={cn(
              "inline-flex min-w-4.5 items-center justify-center rounded-full bg-signal px-1.5 py-0.5 font-mono text-[10px] font-semibold text-signal-foreground tabular-nums",
              variant === "icon" && "absolute -top-1.5 -right-1.5 shadow-xs",
            )}
          >
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
