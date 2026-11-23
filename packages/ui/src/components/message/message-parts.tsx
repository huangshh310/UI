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
