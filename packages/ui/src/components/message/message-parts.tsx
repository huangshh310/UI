"use client";

/**
 * Message 内部复合子部件：多版本分支状态机与用户消息原位编辑器。
 */
import { cn } from "@matt-ui/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";
import type {
  MessageBranchContentProps,
  MessageBranchProps,
  MessageBranchSelectorProps,
  MessageEditFormProps,
} from "./message.types.js";
import { MESSAGE_FOCUS_RING, MESSAGE_PAGER_BTN } from "./message.variants.js";

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

export const MessageBranch = ({
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

export const MessageBranchContent = ({
  className,
  children,
  ...props
}: MessageBranchContentProps) => {
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

export const MessageBranchSelector = ({ className, ...props }: MessageBranchSelectorProps) => {
  const { branch, total, setBranch } = useContext(BranchCtx);
  if (total <= 1) return null;

  return (
    <div
      data-slot="message-branch-selector"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-solid border-border/70 bg-secondary/45 px-0.5 font-mono text-[11px] text-muted-foreground tabular-nums dark:border-white/10 dark:bg-white/5",
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
          "inline-flex h-7 cursor-pointer items-center rounded-full border border-solid border-border/80 bg-secondary/65 px-3 font-sans text-xs font-medium text-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent dark:border-white/10",
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
          "inline-flex h-7 cursor-pointer items-center rounded-full border border-solid border-transparent bg-primary px-3 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-opacity duration-(--ui-duration-fast) hover:opacity-90 disabled:pointer-events-none disabled:opacity-45",
          MESSAGE_FOCUS_RING,
        )}
      >
        {submitLabel}
      </button>
    </div>
  </div>
);

export const MessageEditForm = ({
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
        "ml-auto flex w-full max-w-[88%] flex-col gap-2.5 rounded-2xl border border-solid border-border/80 bg-card/95 p-3 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset dark:border-white/12 dark:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.65)]",
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
