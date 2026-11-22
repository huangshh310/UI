"use client";

/**
 * PromptInput 内部子部件：附件标签、模型切换胶囊、发送/停止按钮与快捷建议词。
 */
import { cn } from "@matt-ui/utils";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import type { ReactNode } from "react";
import type {
  PromptAttachment,
  PromptInputStatus,
  PromptModelOption,
} from "./prompt-input.types.js";

const ICON_BTN_CLASSES =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

export const AttachmentChips = ({
  attachments,
  onRemove,
}: {
  attachments: PromptAttachment[];
  onRemove?: (id: string) => void;
}) => (
  <div className="flex flex-wrap gap-1.5 px-2 pt-1 pb-1.5">
    {attachments.map((item) => (
      <span
        key={item.id}
        className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-solid border-border bg-secondary/70 px-2 text-xs text-foreground"
      >
        <Paperclip aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
        <span className="max-w-[140px] truncate font-medium">{item.name}</span>
        {item.size && <span className="text-muted-foreground tabular-nums">{item.size}</span>}
        {onRemove && (
          <button
            type="button"
            aria-label={`移除附件 ${item.name}`}
            onClick={() => onRemove(item.id)}
            className="inline-flex size-4 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X aria-hidden="true" className="size-3" />
          </button>
        )}
      </span>
    ))}
  </div>
);

const ModelPills = ({
  models,
  selectedModel,
  onSelect,
}: {
  models: PromptModelOption[];
  selectedModel?: string;
  onSelect?: (id: string) => void;
}) => (
  <div className="inline-flex items-center gap-0.5 rounded-lg border border-solid border-border/80 bg-secondary/60 p-0.5">
    {models.map(({ id, label }) => {
      const active = id === selectedModel;
      return (
        <button
          key={id}
          type="button"
          aria-pressed={active}
          onClick={() => onSelect?.(id)}
          className={cn(
            "h-7 cursor-pointer rounded-md border-0 px-2.5 font-sans text-xs font-medium transition-colors duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "bg-background text-foreground shadow-sm dark:bg-card"
              : "bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      );
    })}
  </div>
);

const SubmitControl = ({
  status,
  canSubmit,
  onSubmit,
  onStop,
}: {
  status: PromptInputStatus;
  canSubmit: boolean;
  onSubmit: () => void;
  onStop?: () => void;
}) => {
  if (status === "streaming") {
    return (
      <button
        type="button"
        aria-label="停止生成"
        onClick={onStop}
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-primary-foreground shadow-sm transition-transform duration-(--ui-duration-fast) hover:bg-primary/90 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Square aria-hidden="true" className="size-3.5 fill-current" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="发送"
      disabled={!canSubmit || status === "disabled"}
      onClick={onSubmit}
      className={cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 transition-[background-color,transform,color] duration-(--ui-duration-fast) outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        canSubmit && status !== "disabled"
          ? "bg-signal text-signal-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-signal/90 active:scale-95"
          : "cursor-not-allowed bg-secondary text-muted-foreground/55",
      )}
    >
      <ArrowUp aria-hidden="true" className="size-4" />
    </button>
  );
};

export const SuggestionRow = ({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (text: string) => void;
}) => (
  <div className="flex flex-wrap gap-1.5">
    {suggestions.map((text) => (
      <button
        key={text}
        type="button"
        onClick={() => onPick(text)}
        className="cursor-pointer rounded-full border border-solid border-border bg-background px-3 py-1 font-sans text-xs text-muted-foreground shadow-sm transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:bg-card"
      >
        {text}
      </button>
    ))}
  </div>
);

export interface PromptToolbarProps {
  onAttach?: () => void;
  models: PromptModelOption[];
  selectedModel?: string;
  onModelChange?: (id: string) => void;
  toolbarLeft?: ReactNode;
  maxLength?: number;
  length: number;
  status: PromptInputStatus;
  canSubmit: boolean;
  onSubmit: () => void;
  onStop?: () => void;
}

export const PromptToolbar = (props: PromptToolbarProps) => (
  <div className="mt-1 flex items-center justify-between gap-2 px-1">
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      {props.onAttach && (
        <button
          type="button"
          aria-label="添加附件"
          disabled={props.status === "disabled"}
          onClick={props.onAttach}
          className={ICON_BTN_CLASSES}
        >
          <Paperclip aria-hidden="true" className="size-4" />
        </button>
      )}
      {props.models.length > 0 && (
        <ModelPills
          models={props.models}
          selectedModel={props.selectedModel}
          onSelect={props.onModelChange}
        />
      )}
      {props.toolbarLeft}
    </div>
    <div className="flex shrink-0 items-center gap-2.5">
      {props.maxLength !== undefined && (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {props.length}/{props.maxLength}
        </span>
      )}
      <SubmitControl
        status={props.status}
        canSubmit={props.canSubmit}
        onSubmit={props.onSubmit}
        onStop={props.onStop}
      />
    </div>
  </div>
);
