// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SelectionActions：对标 BeautifulUI 20 Selection Actions 的划词选中文本 AI 浮动微编辑条，
 * 支持自然语言行内改写输入与快捷指令一键触发。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronRight, HelpCircle, Sparkles } from "lucide-react";
import { type ComponentProps, type FormEvent, type ReactNode, useState } from "react";

export const SELECTION_ACTIONS_FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset";

export const selectionActionsBarVariants = cva(
  "inline-flex max-w-full items-center gap-1 rounded-full border border-solid border-border bg-card/95 py-1 pr-1.5 pl-3.5 text-xs text-foreground shadow-[0_10px_30px_-12px_rgba(15,23,42,0.22),0_1px_2px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-white/12 dark:bg-card/95 dark:shadow-[0_14px_34px_-10px_rgba(0,0,0,0.72)]",
);

export const selectionActionsButtonVariants = cva(
  "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-solid border-transparent px-2.5 font-sans text-xs font-medium text-foreground/85 transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45 dark:hover:bg-white/[0.08]",
);
export interface SelectionActionItem {
  /** 指令唯一标识 */
  id: string;
  /** 按钮文案 */
  label: string;
  /** 可选前置图标 */
  icon?: ReactNode;
}

export interface SelectionActionsProps extends Omit<ComponentProps<"div">, "children"> {
  /** 当前选中的文本内容 */
  selectedText?: string;
  /** 快捷动作列表，默认包含「解释」与「润色」 */
  actions?: SelectionActionItem[];
  /** 行内输入框占位提示，默认 "描述修改意图…" */
  placeholder?: string;
  /** 是否处于处理中状态 */
  loading?: boolean;
  /** 点击快捷动作按钮回调 */
  onAction?: (actionId: string, selectedText: string) => void;
  /** 提交自定义自然语言指令回调 */
  onSubmitInstruction?: (instruction: string, selectedText: string) => void;
}
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
