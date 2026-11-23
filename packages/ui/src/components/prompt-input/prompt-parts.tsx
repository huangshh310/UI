"use client";

/**
 * PromptInput 复合结构与工具栏子部件：Header、Footer、Tools、Submit 与默认工具栏。
 */
import { cn } from "@matt-ui/utils";
import { ArrowUp, ListPlus, Loader2, Paperclip, Square } from "lucide-react";
import { createContext, useContext, type ReactNode } from "react";
import type {
  PromptInputFooterProps,
  PromptInputHeaderProps,
  PromptInputStatus,
  PromptInputSubmitProps,
  PromptInputToolsProps,
  PromptModelOption,
} from "./prompt-input.types.js";

export interface PromptContextValue {
  text: string;
  status: PromptInputStatus;
  canSubmit: boolean;
  canQueue: boolean;
  maxLength?: number;
  placeholder: string;
  ariaLabel: string;
  registerTextarea: (el: HTMLTextAreaElement | null) => void;
  updateText: (next: string) => void;
  submitOrQueue: () => void;
  onStop?: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const PromptCtx = createContext<PromptContextValue>({
  text: "",
  status: "idle",
  canSubmit: false,
  canQueue: false,
  placeholder: "输入你的问题…",
  ariaLabel: "指令输入框",
  registerTextarea: () => {},
  updateText: () => {},
  submitOrQueue: () => {},
  onKeyDown: () => {},
});

const ModelPills = ({
  models,
  selectedModel,
  onSelect,
}: {
  models: PromptModelOption[];
  selectedModel?: string;
  onSelect?: (id: string) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-full border border-solid border-border/80 bg-secondary p-0.5">
    {models.map(({ id, label }) => {
      const active = id === selectedModel;
      return (
        <button
          key={id}
          type="button"
          aria-pressed={active}
          onClick={() => onSelect?.(id)}
          className={cn(
            "h-7 cursor-pointer rounded-full border-0 px-2.5 font-sans text-xs font-medium transition-all duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "bg-card text-foreground shadow-xs"
              : "bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export const PromptInputHeader = ({ className, ...props }: PromptInputHeaderProps) => (
  <div
    data-slot="prompt-input-header"
    className={cn("flex flex-wrap items-center gap-1.5 px-1.5 pb-1", className)}
    {...props}
  />
);

export const PromptInputFooter = ({ className, ...props }: PromptInputFooterProps) => (
  <div
    data-slot="prompt-input-footer"
    className={cn("mt-1 flex items-center justify-between gap-2 px-1", className)}
    {...props}
  />
);

export const PromptInputTools = ({ className, ...props }: PromptInputToolsProps) => (
  <div
    data-slot="prompt-input-tools"
    className={cn("flex min-w-0 flex-wrap items-center gap-1.5", className)}
    {...props}
  />
);

const resolveSubmitMeta = (status: PromptInputStatus, canSubmit: boolean, canQueue: boolean) => {
  const isQueue = status === "streaming" && canQueue;
  const isSubmitting = status === "submitting";
  const enabled = (canSubmit || isQueue) && status !== "disabled" && !isSubmitting;
  const label = isQueue ? "加入待发队列" : isSubmitting ? "提交中" : "发送";
  return { isQueue, isSubmitting, enabled, label };
};

const SubmitGlyph = ({ isSubmitting, isQueue }: { isSubmitting: boolean; isQueue: boolean }) => {
  if (isSubmitting) {
    return (
      <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
    );
  }
  if (isQueue) return <ListPlus aria-hidden="true" className="size-4" />;
  return <ArrowUp aria-hidden="true" className="size-4" />;
};

export const PromptInputSubmit = ({ className, onClick, ...props }: PromptInputSubmitProps) => {
  const ctx = useContext(PromptCtx);

  if (ctx.status === "streaming" && !ctx.canQueue) {
    return (
      <button
        type="button"
        aria-label="停止生成"
        data-slot="prompt-input-submit"
        onClick={(e) => {
          ctx.onStop?.();
          onClick?.(e);
        }}
        className={cn(
          "inline-flex size-8.5 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-primary-foreground shadow-xs transition-transform duration-(--ui-duration-fast) hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95",
          className,
        )}
        {...props}
      >
        <Square aria-hidden="true" className="size-3 fill-current" />
      </button>
    );
  }

  const meta = resolveSubmitMeta(ctx.status, ctx.canSubmit, ctx.canQueue);

  return (
    <button
      type="button"
      aria-label={meta.label}
      aria-busy={meta.isSubmitting || undefined}
      disabled={!meta.enabled}
      data-slot="prompt-input-submit"
      onClick={(e) => {
        ctx.submitOrQueue();
        onClick?.(e);
      }}
      className={cn(
        "inline-flex size-8.5 cursor-pointer items-center justify-center rounded-full border-0 transition-all duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
        meta.enabled
          ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95"
          : "cursor-not-allowed bg-secondary text-muted-foreground/50",
        className,
      )}
      {...props}
    >
      <SubmitGlyph isSubmitting={meta.isSubmitting} isQueue={meta.isQueue} />
    </button>
  );
};

export const DefaultToolbar = (p: {
  onAttach?: () => void;
  models: PromptModelOption[];
  selectedModel?: string;
  onModelChange?: (id: string) => void;
  toolbarLeft?: ReactNode;
  toolbarRight?: ReactNode;
  maxLength?: number;
  length: number;
  disabled: boolean;
}) => (
  <PromptInputFooter>
    <PromptInputTools>
      {p.onAttach && (
        <button
          type="button"
          aria-label="添加附件"
          disabled={p.disabled}
          onClick={p.onAttach}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
        >
          <Paperclip aria-hidden="true" className="size-4" />
        </button>
      )}
      {p.models.length > 0 && (
        <ModelPills models={p.models} selectedModel={p.selectedModel} onSelect={p.onModelChange} />
      )}
      {p.toolbarLeft}
    </PromptInputTools>
    <div className="flex shrink-0 items-center gap-2">
      {p.maxLength !== undefined && (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {p.length}/{p.maxLength}
        </span>
      )}
      {p.toolbarRight}
      <PromptInputSubmit />
    </div>
  </PromptInputFooter>
);
