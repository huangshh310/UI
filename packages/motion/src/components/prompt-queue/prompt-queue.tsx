"use client";

/**
 * PromptQueue：轻盈待发送消息停靠队列。
 * 队列消息随平滑动效入栈与退栈，支持整板折叠、暂停续发、立即插队发送、取回编辑与单条移除。
 */
import { cn } from "@matt-ui/utils";
import { ChevronDown, Pause, Pencil, Play, Trash2, X, Zap } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { PromptQueueProps, PromptQueueSize, QueuedPromptItem } from "./prompt-queue.types.js";
import {
  PROMPT_QUEUE_ACTION_BTN,
  PROMPT_QUEUE_COLLAPSE_TRANSITION,
  PROMPT_QUEUE_FOCUS_RING,
  PROMPT_QUEUE_HEADER_SIZE,
  PROMPT_QUEUE_ROW_SIZE,
  PROMPT_QUEUE_SHELL_VARIANT,
} from "./prompt-queue.variants.js";

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
          <span className="shrink-0 rounded-md bg-signal/12 px-1.5 py-0.5 font-mono text-[10px] font-medium text-info dark:bg-signal/22">
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
