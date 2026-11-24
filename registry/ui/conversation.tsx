// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Conversation：支持贴底自动跟随与上滚解绑的流式对话滚动容器原语。
 * 流式输出时若视口处于底部则自动跟随，用户上滚阅读时立即解绑并浮现克制回到底部按钮。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ArrowDown, MessageSquare } from "lucide-react";
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

export const CONVERSATION_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const conversationRootVariants = cva(
  "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden",
  {
    variants: {
      variant: {
        minimal: "",
        surface:
          "rounded-xl border border-solid border-border bg-background shadow-xs dark:border-white/10",
        glass:
          "rounded-xl border border-solid border-border bg-card/85 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-card/75",
      },
    },
    defaultVariants: {
      variant: "minimal",
    },
  },
);

export const conversationContentVariants = cva("mx-auto flex w-full flex-1 flex-col", {
  variants: {
    size: {
      sm: "max-w-xl gap-4 px-4 py-4",
      md: "max-w-2xl gap-6 px-5 py-6",
      lg: "max-w-3xl gap-7 px-6 py-7",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const conversationEmptyVariants = cva(
  "my-auto flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "gap-3 py-6",
        md: "gap-4 py-10",
        lg: "gap-5 py-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const conversationScrollButtonVariants = cva(
  `pointer-events-auto inline-flex cursor-pointer items-center justify-center rounded-full border border-solid border-border bg-popover/98 font-sans text-xs font-medium text-popover-foreground shadow-[0_6px_20px_-6px_rgba(0,0,0,0.12),0_2px_4px_-1px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-colors duration-(--ui-duration-fast) hover:border-foreground/20 hover:bg-accent/60 dark:border-white/10 dark:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.6)] dark:hover:border-white/20 ${CONVERSATION_FOCUS_RING}`,
  {
    variants: {
      variant: {
        pill: "h-8 gap-1.5 px-3",
        icon: "relative size-8",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  },
);
export type ConversationVariant = "minimal" | "surface" | "glass";
export type ConversationContentSize = "sm" | "md" | "lg";
export type ConversationEmptyStateSize = "sm" | "md" | "lg";
export type ConversationScrollButtonVariant = "pill" | "icon";

export interface ConversationContextValue {
  isAtBottom: boolean;
  unreadCount: number;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

export interface ConversationProps extends HTMLAttributes<HTMLDivElement> {
  /** 外观风格：minimal 无框容器、surface 发丝边框画布、glass 毛玻璃容器，默认 minimal */
  variant?: ConversationVariant;
  /** 是否在视口顶部与底部叠加柔和渐变遮罩，默认 false */
  fadeEdges?: boolean;
  /** 判定贴底的像素阈值，默认 36 */
  bottomThreshold?: number;
  /** 用户上滚离开底部期间新增的未读回合数，默认 0 */
  unreadCount?: number;
  /** 贴底状态变化回调 */
  onAtBottomChange?: (atBottom: boolean) => void;
}

export interface ConversationContentProps extends HTMLAttributes<HTMLDivElement> {
  /** 内容区阅读宽度与排版间距密度，默认 md */
  size?: ConversationContentSize;
}

export interface ConversationEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** 顶部视觉锚点图标或状态球 */
  icon?: ReactNode;
  /** 可选顶部细小标签（如当前模型或工作区版本） */
  badge?: ReactNode;
  /** 欢迎主标题 */
  title?: ReactNode;
  /** 辅助引导说明 */
  description?: ReactNode;
  /** 留白与标题尺度，默认 md */
  size?: ConversationEmptyStateSize;
}

export interface ConversationScrollButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮外观：pill 胶囊文案按钮、icon 极简圆形悬浮按钮，默认 pill */
  variant?: ConversationScrollButtonVariant;
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
