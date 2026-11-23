"use client";

/**
 * CommandMenu 的内部子视图：快捷键键帽序列、命令条目行、搜索栏与键盘提示页脚。
 */
import {
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandPage,
} from "@ui-sdk/react/command";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import type { CommandMenuGroup, CommandMenuItem } from "./command-menu.types.js";
import { commandMenuItemVariants, commandMenuKbdVariants } from "./command-menu.variants.js";

export const ShortcutKeys = ({ shortcut }: { shortcut: string }) => {
  const parts = shortcut.trim().split(/\s+/);
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      {parts.map((part, idx) => (
        <kbd key={`${part}-${idx}`} className={commandMenuKbdVariants()}>
          {part}
        </kbd>
      ))}
    </span>
  );
};

const CommandRow = ({
  item,
  onRun,
}: {
  item: CommandMenuItem;
  onRun: (item: CommandMenuItem) => void;
}) => (
  <CommandItem
    value={item.id}
    label={item.label}
    keywords={item.keywords}
    disabled={item.disabled}
    onSelect={() => onRun(item)}
    className={commandMenuItemVariants()}
  >
    <span className="flex min-w-0 items-center gap-2.5">
      {item.icon && (
        <span
          aria-hidden="true"
          className="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-colors group-data-[highlighted]/cmd:text-foreground"
        >
          {item.icon}
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <CommandItemText className="truncate font-medium" />
        {item.description && (
          <span className="truncate text-xs text-muted-foreground">{item.description}</span>
        )}
      </span>
    </span>
    <span className="flex shrink-0 items-center gap-2">
      {item.badge && (
        <span className="rounded-full bg-secondary/85 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground dark:bg-white/8">
          {item.badge}
        </span>
      )}
      {item.subPage ? (
        <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
      ) : item.shortcut ? (
        <ShortcutKeys shortcut={item.shortcut} />
      ) : null}
    </span>
  </CommandItem>
);

export const CommandPagesView = ({
  groups,
  onRun,
}: {
  groups: CommandMenuGroup[];
  onRun: (item: CommandMenuItem) => void;
}) => {
  const subPages = groups.flatMap((group) =>
    group.items
      .filter((item) => item.subPage)
      .map((item) => ({ id: item.id, page: item.subPage! })),
  );

  return (
    <>
      <CommandPage>
        {groups.map((group) => (
          <CommandGroup key={group.heading} className="mb-1.5 last:mb-0">
            <CommandGroupLabel className="px-2.5 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground">
              {group.heading}
            </CommandGroupLabel>
            {group.items.map((item) => (
              <CommandRow key={item.id} item={item} onRun={onRun} />
            ))}
          </CommandGroup>
        ))}
      </CommandPage>
      {subPages.map(({ id, page }) => (
        <CommandPage key={id} value={id}>
          <CommandGroup>
            <CommandGroupLabel className="px-2.5 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground">
              {page.heading}
            </CommandGroupLabel>
            {page.items.map((child) => (
              <CommandRow key={child.id} item={child} onRun={onRun} />
            ))}
          </CommandGroup>
        </CommandPage>
      ))}
    </>
  );
};

export const CommandSearchBar = ({
  hasBack,
  title,
  placeholder,
  onBack,
}: {
  hasBack: boolean;
  title: string;
  placeholder: string;
  onBack: () => void;
}) => (
  <div className="flex items-center gap-2.5 border-b border-solid border-border/75 px-3.5 py-3 dark:border-white/8">
    {hasBack ? (
      <button
        type="button"
        aria-label="返回上一级"
        onClick={onBack}
        className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-solid border-border/80 bg-secondary/80 text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10 dark:bg-white/8"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
      </button>
    ) : (
      <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    )}
    <CommandInput
      aria-label={title}
      placeholder={placeholder}
      className="h-6 min-w-0 flex-1 border-0 bg-transparent font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground"
    />
    <kbd className={commandMenuKbdVariants()}>ESC</kbd>
  </div>
);

export const CommandFooterBar = ({ hasBack }: { hasBack: boolean }) => (
  <div className="flex items-center justify-between gap-3 border-t border-solid border-border/75 bg-secondary/35 px-3.5 py-2 text-[11px] text-muted-foreground dark:border-white/8 dark:bg-white/[0.03]">
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5">
        <kbd className={commandMenuKbdVariants()}>↑↓</kbd>
        <span>选择</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <kbd className={commandMenuKbdVariants()}>↵</kbd>
        <span>执行</span>
      </span>
      {hasBack && (
        <span className="inline-flex items-center gap-1.5">
          <kbd className={commandMenuKbdVariants()}>⌫</kbd>
          <span>返回</span>
        </span>
      )}
    </div>
    <span className="inline-flex items-center gap-1.5">
      <kbd className={commandMenuKbdVariants()}>ESC</kbd>
      <span>关闭</span>
    </span>
  </div>
);
