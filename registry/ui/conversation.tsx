// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Conversation：流式对话滚动容器原语（对标 shadcn AI Elements Conversation + HextaUI 贴底锚定）。
 * 流式输出时若视口处于底部则自动跟随，用户上滚阅读时立即解绑并浮现回到底部胶囊按钮。
 */

import { cn } from "@/lib/utils";
import { ArrowDown, Sparkles } from "lucide-react";
import {
  createContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ConversationContextValue {
  isAtBottom: boolean;
  unreadCount: number;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

export interface ConversationProps extends HTMLAttributes<HTMLDivElement> {
  /** 判定贴底的像素阈值，默认 36 */
  bottomThreshold?: number;
  /** 用户上滚离开底部期间新增的未读回合数，默认 0 */
  unreadCount?: number;
  /** 贴底状态变化回调 */
  onAtBottomChange?: (atBottom: boolean) => void;
}

export interface ConversationContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface ConversationEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** 顶部视觉锚点图标或状态球 */
  icon?: ReactNode;
  /** 欢迎主标题 */
  title?: ReactNode;
  /** 辅助引导说明 */
  description?: ReactNode;
}

export interface ConversationScrollButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮文案，默认「回到底部」 */
  label?: string;
  /** 强制展示开关（用于受控预览），未传时仅在离开底部后显示 */
  forceVisible?: boolean;
}
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
        data-at-bottom={isAtBottom ? "true" : "false"}
        className={cn("relative flex min-h-0 w-full flex-1 flex-col overflow-hidden", className)}
        {...props}
      >
        <div
          ref={viewportRef}
          data-slot="conversation-viewport"
          onScroll={handleScroll}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto scroll-smooth"
        >
          {children}
        </div>
      </div>
    </ConversationCtx.Provider>
  );
};

export const ConversationContent = ({
  className,
  children,
  ...props
}: ConversationContentProps) => (
  <div
    role="log"
    aria-live="polite"
    data-slot="conversation-content"
    className={cn("mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-6", className)}
    {...props}
  >
    {children}
  </div>
);

export const ConversationEmptyState = ({
  icon,
  title = "有什么我可以帮你的？",
  description,
  className,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    data-slot="conversation-empty-state"
    className={cn(
      "my-auto flex flex-col items-center justify-center gap-4 py-10 text-center",
      className,
    )}
    {...props}
  >
    <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-solid border-border bg-card text-signal shadow-sm">
      {icon ?? <Sparkles aria-hidden="true" className="size-5" />}
    </span>
    <div className="flex max-w-md flex-col gap-1.5">
      <p className="m-0 font-sans text-lg font-semibold tracking-tight text-foreground">{title}</p>
      {description && (
        <p className="m-0 text-xs leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
    {children && <div className="mt-1 w-full max-w-xl">{children}</div>}
  </div>
);

export const ConversationScrollButton = ({
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
    <div className="pointer-events-none sticky bottom-3 z-10 mt-auto flex justify-center px-4 pb-1">
      <button
        type="button"
        aria-label={ariaLabel}
        data-slot="conversation-scroll-button"
        onClick={(event) => {
          scrollToBottom("smooth");
          onClick?.(event);
        }}
        className={cn(
          "pointer-events-auto inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-border bg-card/95 px-3 font-sans text-xs font-medium text-foreground shadow-md backdrop-blur-md",
          "transition-[transform,background-color,border-color] duration-(--ui-duration-fast) hover:-translate-y-0.5 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-98",
          className,
        )}
        {...props}
      >
        <ArrowDown aria-hidden="true" className="size-3.5 text-signal" />
        <span>{label}</span>
        {unreadCount > 0 && (
          <span className="inline-flex min-w-4.5 items-center justify-center rounded-full bg-signal px-1.5 py-0.5 font-mono text-[10px] font-semibold text-signal-foreground tabular-nums">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
