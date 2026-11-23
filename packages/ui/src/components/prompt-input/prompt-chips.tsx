"use client";

/**
 * PromptInput 芯片与菜单子部件：@ 上下文标签、附件芯片、毛玻璃斜杠命令菜单与快捷建议条。
 */
import { cn } from "@matt-ui/utils";
import { AtSign, Code2, FileText, Image as ImageIcon, Paperclip, Terminal, X } from "lucide-react";
import type {
  PromptAttachment,
  PromptContextRef,
  PromptSlashCommand,
} from "./prompt-input.types.js";
import { PROMPT_FOCUS_RING } from "./prompt-input.variants.js";

const ATTACHMENT_ICON = {
  file: FileText,
  image: ImageIcon,
  code: Code2,
} as const;

const ContextChipItem = ({
  item,
  onRemove,
}: {
  item: PromptContextRef;
  onRemove?: (id: string) => void;
}) => (
  <span className="inline-flex h-6.5 items-center gap-1 rounded-lg border border-solid border-signal/25 bg-signal/8 px-2 font-mono text-[11px] font-medium text-foreground dark:border-signal/35 dark:bg-signal/12">
    <AtSign aria-hidden="true" className="size-3 text-signal" />
    <span className="max-w-32 truncate">{item.label}</span>
    {onRemove && (
      <button
        type="button"
        aria-label={`移除上下文 ${item.label}`}
        onClick={() => onRemove(item.id)}
        className={cn(
          "inline-flex size-4 cursor-pointer items-center justify-center rounded-full border border-solid border-transparent bg-transparent text-muted-foreground hover:text-foreground",
          PROMPT_FOCUS_RING,
        )}
      >
        <X aria-hidden="true" className="size-2.5" />
      </button>
    )}
  </span>
);

const AttachmentChipItem = ({
  item,
  onRemove,
}: {
  item: PromptAttachment;
  onRemove?: (id: string) => void;
}) => {
  const Icon = ATTACHMENT_ICON[item.kind ?? "file"] ?? Paperclip;
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-xl border border-solid border-border/80 bg-secondary/65 px-2.5 text-xs text-foreground dark:border-white/10 dark:bg-white/7">
      <Icon aria-hidden="true" className="size-3.5 shrink-0 text-signal" />
      <span className="max-w-36 truncate font-medium">{item.name}</span>
      {item.size && (
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {item.size}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          aria-label={`移除附件 ${item.name}`}
          onClick={() => onRemove(item.id)}
          className={cn(
            "inline-flex size-4 cursor-pointer items-center justify-center rounded-full border border-solid border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
            PROMPT_FOCUS_RING,
          )}
        >
          <X aria-hidden="true" className="size-3" />
        </button>
      )}
    </span>
  );
};

export const HeaderChips = ({
  contextRefs,
  onRemoveContextRef,
  attachments,
  onRemoveAttachment,
}: {
  contextRefs: PromptContextRef[];
  onRemoveContextRef?: (id: string) => void;
  attachments: PromptAttachment[];
  onRemoveAttachment?: (id: string) => void;
}) => (
  <div className="flex flex-wrap items-center gap-1.5 px-1.5 pt-0.5 pb-1.5">
    {contextRefs.map((refItem) => (
      <ContextChipItem key={refItem.id} item={refItem} onRemove={onRemoveContextRef} />
    ))}
    {attachments.map((item) => (
      <AttachmentChipItem key={item.id} item={item} onRemove={onRemoveAttachment} />
    ))}
  </div>
);

export const SlashMenu = ({
  commands,
  activeIdx,
  onPick,
}: {
  commands: PromptSlashCommand[];
  activeIdx: number;
  onPick: (cmd: PromptSlashCommand) => void;
}) => (
  <ul
    aria-label="快捷指令菜单"
    className="m-0 mb-1 flex list-none flex-col gap-0.5 rounded-2xl border border-solid border-border/80 bg-popover/96 p-1.5 text-popover-foreground backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]"
  >
    {commands.map((cmd, idx) => {
      const active = idx === activeIdx;
      return (
        <li key={cmd.id}>
          <button
            type="button"
            aria-pressed={active}
            onClick={() => onPick(cmd)}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-solid border-transparent px-2.5 py-1.5 text-left transition-colors duration-(--ui-duration-fast)",
              PROMPT_FOCUS_RING,
              active ? "bg-accent text-foreground" : "bg-transparent hover:bg-accent/60",
            )}
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
              <Terminal aria-hidden="true" className="size-3 text-signal" />
              <span>/{cmd.command}</span>
            </span>
            <span className="truncate font-sans text-xs text-muted-foreground">
              {cmd.description}
            </span>
          </button>
        </li>
      );
    })}
  </ul>
);

export const SuggestionChips = ({
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
        className={cn(
          "cursor-pointer rounded-full border border-solid border-border/80 bg-background px-3 py-1 font-sans text-xs font-medium text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[border-color,color,background-color,transform] duration-(--ui-duration-fast) hover:-translate-y-0.5 hover:border-foreground/22 hover:bg-card hover:text-foreground dark:border-white/12 dark:bg-card/75 dark:hover:border-white/22",
          PROMPT_FOCUS_RING,
        )}
      >
        {text}
      </button>
    ))}
  </div>
);
