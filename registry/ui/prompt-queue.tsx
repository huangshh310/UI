// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * PromptQueue：生成期间的待发送消息队列胶囊栈（参考 HextaUI Queue 与 Cursor/Claude 待发队列）。
 * 队列消息随物理弹簧平滑入栈与退栈，支持立即插队发送、取回编辑与单条移除。
 */

import { cn } from "@/lib/utils";
import { ChevronDown, CornerDownRight, Pencil, Trash2, X, Zap } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export interface QueuedPromptItem {
  id: string;
  /** 待发送的指令文本 */
  content: string;
  /** 可选附加说明（如附带文件数） */
  meta?: string;
}

export interface PromptQueueProps {
  /** 队列中的待发送消息列表 */
  items: QueuedPromptItem[];
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
const ITEM_ACTION_BTN =
  "inline-flex size-6.5 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

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
  <div className="flex shrink-0 items-center gap-0.5">
    {onSendNow && (
      <button
        type="button"
        aria-label={`立即插队发送：${item.content}`}
        title="中断当前生成并立即发送"
        onClick={() => onSendNow(item)}
        className={cn(ITEM_ACTION_BTN, "hover:text-foreground")}
      >
        <Zap aria-hidden="true" className="size-3.5" />
      </button>
    )}
    {onEdit && (
      <button
        type="button"
        aria-label={`编辑待发消息：${item.content}`}
        onClick={() => onEdit(item)}
        className={ITEM_ACTION_BTN}
      >
        <Pencil aria-hidden="true" className="size-3" />
      </button>
    )}
    {onRemove && (
      <button
        type="button"
        aria-label={`移除待发消息：${item.content}`}
        onClick={() => onRemove(item.id)}
        className={ITEM_ACTION_BTN}
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    )}
  </div>
);

const QueueRow = ({
  item,
  index,
  reduced,
  onSendNow,
  onEdit,
  onRemove,
}: {
  item: QueuedPromptItem;
  index: number;
  reduced: boolean | null;
  onSendNow?: (item: QueuedPromptItem) => void;
  onEdit?: (item: QueuedPromptItem) => void;
  onRemove?: (id: string) => void;
}) => (
  <motion.li
    layout={!reduced}
    initial={reduced ? false : { opacity: 0, y: 6, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
    transition={{ type: "spring", stiffness: 460, damping: 32 }}
    className="flex items-center justify-between gap-2.5 rounded-xl border border-solid border-border/75 bg-card px-3 py-2 shadow-xs"
  >
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <CornerDownRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">#{index + 1}</span>
      <span className="truncate font-sans text-xs text-foreground">{item.content}</span>
      {item.meta && (
        <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {item.meta}
        </span>
      )}
    </div>
    <QueueRowActions item={item} onSendNow={onSendNow} onEdit={onEdit} onRemove={onRemove} />
  </motion.li>
);

const QueueHeader = ({
  count,
  expanded,
  onToggle,
  onClearAll,
}: {
  count: number;
  expanded: boolean;
  onToggle: () => void;
  onClearAll?: () => void;
}) => (
  <div className="flex items-center justify-between gap-2 px-3 py-2">
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onToggle}
      className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-sans text-xs font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="inline-flex size-2 animate-pulse rounded-full bg-foreground motion-reduce:animate-none" />
      <span>{count} 条待发送</span>
      <span className="hidden text-[11px] font-normal text-muted-foreground @sm:inline">
        当前回复完成后自动发出
      </span>
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast)",
          expanded && "rotate-180",
        )}
      />
    </button>
    {onClearAll && count > 1 && (
      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border-0 bg-transparent px-1.5 font-sans text-[11px] text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Trash2 aria-hidden="true" className="size-3" />
        <span>清空</span>
      </button>
    )}
  </div>
);

export const PromptQueue = ({
  items,
  onSendNow,
  onEdit,
  onRemove,
  onClearAll,
  defaultExpanded = true,
  className,
}: PromptQueueProps) => {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (items.length === 0) return null;

  return (
    <div
      data-slot="prompt-queue"
      className={cn(
        "@container flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-solid border-border bg-secondary/75 font-sans text-foreground",
        className,
      )}
    >
      <QueueHeader
        count={items.length}
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
        onClearAll={onClearAll}
      />
      {expanded && (
        <ul className="m-0 flex list-none flex-col gap-1.5 px-2.5 pt-0.5 pb-2.5">
          <AnimatePresence initial={false}>
            {items.map((item, idx) => (
              <QueueRow
                key={item.id}
                item={item}
                index={idx}
                reduced={reduced}
                onSendNow={onSendNow}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};
