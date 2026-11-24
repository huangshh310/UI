// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * PromptQueue：轻盈待发送消息停靠队列。
 * 队列消息随平滑动效入栈与退栈，支持整板折叠、暂停续发、立即插队发送、取回编辑与单条移除。
 */

import { cn } from "@/lib/utils";
import { ChevronDown, Pause, Pencil, Play, Trash2, X, Zap } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export const PROMPT_QUEUE_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const PROMPT_QUEUE_COLLAPSE_TRANSITION = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const PROMPT_QUEUE_ACTION_BTN = `inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-solid border-transparent bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted hover:text-foreground dark:hover:bg-white/[0.08] ${PROMPT_QUEUE_FOCUS_RING}`;

export const PROMPT_QUEUE_SHELL_VARIANT: Record<PromptQueueVariant, string> = {
  default: "border-border bg-muted/45 dark:border-white/10 dark:bg-card/85",
  glass:
    "border-border bg-popover/90 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-popover/85",
  elevated: "border-border bg-card shadow-sm dark:border-white/10",
};

export const PROMPT_QUEUE_ROW_SIZE: Record<PromptQueueSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-3.5 py-2",
};

export const PROMPT_QUEUE_HEADER_SIZE: Record<PromptQueueSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-3.5 py-2",
};
export type PromptQueueVariant = "default" | "glass" | "elevated";
export type PromptQueueSize = "sm" | "md";
export type QueuedPromptPriority = "normal" | "high";

export interface QueuedPromptItem {
  id: string;
  /** 待发送的指令文本 */
  content: string;
  /** 可选附加说明（如附带文件数或 @ 上下文） */
  meta?: string;
  /** 优先级标识：high 将以高对比 signal 标点突出提示 */
  priority?: QueuedPromptPriority;
}

export interface PromptQueueProps {
  /** 队列中的待发送消息列表 */
  items: QueuedPromptItem[];
  /** 容器外观风格：default 次级停靠栏、glass 毛玻璃浮层、elevated 悬浮卡片，默认 default */
  variant?: PromptQueueVariant;
  /** 行高与间距密度，默认 md */
  size?: PromptQueueSize;
  /** 自定义页头辅助提示文案 */
  statusLabel?: string;
  /** 是否暂停自动依次发出队列消息，默认 false */
  paused?: boolean;
  /** 切换暂停/恢复自动发出的回调（传入时页头显示对应按钮） */
  onTogglePause?: () => void;
  /** 点击「立即发送」插队打断当前生成并发送该消息 */
  onSendNow?: (item: QueuedPromptItem) => void;
  /** 点击「编辑」将消息取回输入器重新修改 */
  onEdit?: (item: QueuedPromptItem) => void;
  /** 从队列移除某条待发消息 */
  onRemove?: (id: string) => void;
  /** 清空全部待发队列 */
  onClearAll?: () => void;
  /** 初始是否展开队列明细，默认 true */
  defaultExpanded?: boolean;
  className?: string;
}
const QueueRowActions = ({
  item,
  onSendNow,
  onEdit,
  onRemove,
}: {
  item: QueuedPromptItem;
  onSendNow?: (item: QueuedPromptItem) => void;
  onEdit?: (item: QueuedPromptItem) => void;
  onRemove?: (id: string) => void;
}) => (
  <div className="flex shrink-0 items-center gap-0.5 opacity-55 transition-opacity duration-(--ui-duration-fast) group-focus-within:opacity-100 group-hover:opacity-100">
    {onSendNow && (
      <button
        type="button"
        aria-label={`立即插队发送：${item.content}`}
        title="中断当前生成并立即发送"
        onClick={() => onSendNow(item)}
        className={cn(PROMPT_QUEUE_ACTION_BTN, "hover:text-signal")}
      >
        <Zap aria-hidden="true" className="size-3.5" />
      </button>
    )}
    {onEdit && (
      <button
        type="button"
        aria-label={`编辑待发消息：${item.content}`}
        onClick={() => onEdit(item)}
        className={PROMPT_QUEUE_ACTION_BTN}
      >
        <Pencil aria-hidden="true" className="size-3" />
      </button>
    )}
    {onRemove && (
      <button
        type="button"
        aria-label={`移除待发消息：${item.content}`}
        onClick={() => onRemove(item.id)}
        className={PROMPT_QUEUE_ACTION_BTN}
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    )}
  </div>
);

interface QueueRowProps {
  item: QueuedPromptItem;
  index: number;
  size: PromptQueueSize;
  reduced: boolean | null;
  onSendNow?: (item: QueuedPromptItem) => void;
  onEdit?: (item: QueuedPromptItem) => void;
  onRemove?: (id: string) => void;
}

const QueueRow = (p: QueueRowProps) => {
  const isHigh = p.item.priority === "high";
  return (
    <motion.li
      layout={!p.reduced}
      initial={p.reduced ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={p.reduced ? { opacity: 0 } : { opacity: 0, y: -3 }}
      transition={{ duration: p.reduced ? 0 : 0.16, ease: "easeOut" }}
      className={cn(
        "group flex items-center justify-between gap-2.5 transition-colors duration-(--ui-duration-fast)",
        isHigh
          ? "bg-signal/[0.04] hover:bg-signal/[0.07] dark:bg-signal/[0.07] dark:hover:bg-signal/[0.11]"
          : "hover:bg-muted/55 dark:hover:bg-white/[0.04]",
        PROMPT_QUEUE_ROW_SIZE[p.size],
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="w-5 shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          #{p.index + 1}
        </span>
        {isHigh && (
          <span className="shrink-0 rounded-md bg-signal/12 px-1.5 py-0.5 font-mono text-[10px] font-medium text-blue-700 dark:bg-signal/18 dark:text-blue-300">
            优先
          </span>
        )}
        <span className="truncate font-sans text-xs text-foreground">{p.item.content}</span>
        {p.item.meta && (
          <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground dark:bg-white/[0.07]">
            {p.item.meta}
          </span>
        )}
      </div>
      <QueueRowActions
        item={p.item}
        onSendNow={p.onSendNow}
        onEdit={p.onEdit}
        onRemove={p.onRemove}
      />
    </motion.li>
  );
};

const QueueHeaderActions = ({
  count,
  paused,
  onTogglePause,
  onClearAll,
}: {
  count: number;
  paused: boolean;
  onTogglePause?: () => void;
  onClearAll?: () => void;
}) => (
  <div className="flex items-center gap-0.5">
    {onTogglePause && (
      <button
        type="button"
        aria-pressed={paused}
        onClick={onTogglePause}
        className={cn(
          "inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent bg-transparent px-1.5 font-sans text-[11px] text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted hover:text-foreground dark:hover:bg-white/[0.06]",
          PROMPT_QUEUE_FOCUS_RING,
        )}
      >
        {paused ? (
          <Play aria-hidden="true" className="size-3 text-signal" />
        ) : (
          <Pause aria-hidden="true" className="size-3" />
        )}
        <span>{paused ? "恢复" : "暂停"}</span>
      </button>
    )}
    {onClearAll && count > 1 && (
      <button
        type="button"
        onClick={onClearAll}
        className={cn(
          "inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border border-solid border-transparent bg-transparent px-1.5 font-sans text-[11px] text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-muted hover:text-foreground dark:hover:bg-white/[0.06]",
          PROMPT_QUEUE_FOCUS_RING,
        )}
      >
        <Trash2 aria-hidden="true" className="size-3" />
        <span>清空</span>
      </button>
    )}
  </div>
);

interface QueueHeaderProps {
  count: number;
  expanded: boolean;
  size: PromptQueueSize;
  paused: boolean;
  statusLabel: string;
  onToggle: () => void;
  onTogglePause?: () => void;
  onClearAll?: () => void;
}

const QueueHeader = (p: QueueHeaderProps) => (
  <div className={cn("flex items-center justify-between gap-2", PROMPT_QUEUE_HEADER_SIZE[p.size])}>
    <button
      type="button"
      aria-expanded={p.expanded}
      onClick={p.onToggle}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-md border border-solid border-transparent bg-transparent px-1 py-0.5 font-sans text-xs font-medium text-foreground transition-colors hover:bg-muted/60 dark:hover:bg-white/[0.05]",
        PROMPT_QUEUE_FOCUS_RING,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-1.5 rounded-full",
          p.paused ? "bg-amber-500 dark:bg-amber-400" : "bg-signal",
        )}
      />
      <span className="tabular-nums">{p.count} 条待发送</span>
      <span className="hidden text-[11px] font-normal text-muted-foreground @sm:inline">
        {p.paused ? "已暂停自动发送" : p.statusLabel}
      </span>
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast)",
          p.expanded && "rotate-180",
        )}
      />
    </button>
    <QueueHeaderActions
      count={p.count}
      paused={p.paused}
      onTogglePause={p.onTogglePause}
      onClearAll={p.onClearAll}
    />
  </div>
);

interface QueueBodyProps {
  expanded: boolean;
  items: QueuedPromptItem[];
  size: PromptQueueSize;
  reduced: boolean | null;
  onSendNow?: (item: QueuedPromptItem) => void;
  onEdit?: (item: QueuedPromptItem) => void;
  onRemove?: (id: string) => void;
}

const QueueBody = (p: QueueBodyProps) => (
  <AnimatePresence initial={false}>
    {p.expanded && (
      <motion.div
        key="prompt-queue-body"
        initial={p.reduced ? false : { opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={p.reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
        transition={p.reduced ? { duration: 0 } : PROMPT_QUEUE_COLLAPSE_TRANSITION}
        className="overflow-hidden"
      >
        <ul className="m-0 flex list-none flex-col divide-y divide-border/70 border-t border-solid border-border/70 p-0 dark:divide-white/10 dark:border-white/10">
          <AnimatePresence initial={false}>
            {p.items.map((item, idx) => (
              <QueueRow
                key={item.id}
                item={item}
                index={idx}
                size={p.size}
                reduced={p.reduced}
                onSendNow={p.onSendNow}
                onEdit={p.onEdit}
                onRemove={p.onRemove}
              />
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    )}
  </AnimatePresence>
);

export const PromptQueue = (props: PromptQueueProps) => {
  const variant = props.variant ?? "default";
  const size = props.size ?? "md";
  const paused = props.paused ?? false;
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? true);

  if (props.items.length === 0) return null;

  return (
    <div
      data-slot="prompt-queue"
      data-variant={variant}
      data-paused={paused ? "true" : "false"}
      className={cn(
        "@container flex w-full flex-col overflow-hidden rounded-xl border border-solid font-sans text-foreground",
        PROMPT_QUEUE_SHELL_VARIANT[variant],
        props.className,
      )}
    >
      <QueueHeader
        count={props.items.length}
        expanded={expanded}
        size={size}
        paused={paused}
        statusLabel={props.statusLabel ?? "当前回复完成后自动发出"}
        onToggle={() => setExpanded((prev) => !prev)}
        onTogglePause={props.onTogglePause}
        onClearAll={props.onClearAll}
      />
      <QueueBody
        expanded={expanded}
        items={props.items}
        size={size}
        reduced={reduced}
        onSendNow={props.onSendNow}
        onEdit={props.onEdit}
        onRemove={props.onRemove}
      />
    </div>
  );
};
