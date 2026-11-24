"use client";

/**
 * SelectionActions：对标 BeautifulUI 20 Selection Actions 的划词选中文本 AI 浮动微编辑条，
 * 支持自然语言行内改写输入与快捷指令一键触发。
 */
import { cn } from "@matt-ui/utils";
import { ChevronRight, HelpCircle, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { SelectionActionItem, SelectionActionsProps } from "./selection-actions.types.js";
import {
  SELECTION_ACTIONS_FOCUS_RING,
  selectionActionsBarVariants,
  selectionActionsButtonVariants,
} from "./selection-actions.variants.js";

const DEFAULT_ACTIONS: SelectionActionItem[] = [
  {
    id: "explain",
    label: "解释",
    icon: <HelpCircle aria-hidden="true" className="size-3.5 text-muted-foreground" />,
  },
  {
    id: "improve",
    label: "润色",
    icon: <Sparkles aria-hidden="true" className="size-3.5 text-muted-foreground" />,
  },
];

const SelectionActionButtons = ({
  actions,
  loading,
  selectedText,
  onAction,
}: {
  actions: SelectionActionItem[];
  loading: boolean;
  selectedText: string;
  onAction?: (actionId: string, selectedText: string) => void;
}) => {
  if (actions.length === 0) return null;
  return (
    <>
      <span aria-hidden="true" className="mx-0.5 h-4 w-px shrink-0 bg-border dark:bg-white/12" />
      <div className="flex items-center gap-0.5">
        {actions.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={loading}
            onClick={() => onAction?.(item.id, selectedText)}
            className={cn(selectionActionsButtonVariants(), SELECTION_ACTIONS_FOCUS_RING)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

const SelectionSubmitButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: (event: FormEvent) => void;
}) => (
  <button
    type="button"
    disabled={disabled}
    aria-label="提交修改指令"
    onClick={onClick}
    className={cn(
      "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/[0.08]",
      SELECTION_ACTIONS_FOCUS_RING,
    )}
  >
    <ChevronRight aria-hidden="true" className="size-3.5" />
  </button>
);

export const SelectionActions = ({
  selectedText = "",
  actions = DEFAULT_ACTIONS,
  placeholder = "描述修改意图…",
  loading = false,
  onAction,
  onSubmitInstruction,
  className,
  ...props
}: SelectionActionsProps) => {
  const [instruction, setInstruction] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = instruction.trim();
    if (!trimmed || loading) return;
    onSubmitInstruction?.(trimmed, selectedText);
    setInstruction("");
  };

  return (
    <div
      role="toolbar"
      aria-label="选中文本智能操作"
      data-slot="selection-actions"
      data-loading={loading ? "true" : undefined}
      className={cn(selectionActionsBarVariants(), className)}
      {...props}
    >
      <form onSubmit={handleSubmit} className="flex min-w-0 items-center">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={loading}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-7 w-32 min-w-0 border-0 bg-transparent font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none sm:w-40"
        />
      </form>
      <SelectionActionButtons
        actions={actions}
        loading={loading}
        selectedText={selectedText}
        onAction={onAction}
      />
      <SelectionSubmitButton disabled={loading || !instruction.trim()} onClick={handleSubmit} />
    </div>
  );
};
