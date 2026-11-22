"use client";

/**
 * CommandMenu：基于 @ui-sdk/react（Dialog + Command）的单底座命令面板，
 * 支持分组检索、匹配高亮、子级页面栈与可选全局快捷键。
 */
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandPage,
} from "@ui-sdk/react/command";
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { cn } from "@matt-ui/utils";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { CommandMenuGroup, CommandMenuItem, CommandMenuProps } from "./command-menu.types.js";

const TRIGGER_CLASS = cn(
  "inline-flex h-9 w-full max-w-xs cursor-pointer items-center justify-between gap-3 rounded-lg border border-solid border-border bg-background px-3 font-sans text-sm text-muted-foreground shadow-sm dark:bg-card",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
);

const ITEM_CLASS = cn(
  "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none select-none",
  "transition-colors duration-(--ui-duration-fast) data-[highlighted]:bg-signal/10 data-[highlighted]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
  "[&_mark]:rounded [&_mark]:bg-signal/20 [&_mark]:px-0.5 [&_mark]:text-signal [&_mark]:font-medium",
);

const useGlobalCommandShortcut = (enabled: boolean, key: string, toggle: () => void) => {
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
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
    className={ITEM_CLASS}
  >
    <span className="flex min-w-0 items-center gap-2.5">
      {item.icon && (
        <span aria-hidden="true" className="shrink-0 text-muted-foreground">
          {item.icon}
        </span>
      )}
      <CommandItemText className="truncate font-medium" />
    </span>
    {item.subPage ? (
      <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
    ) : item.shortcut ? (
      <kbd className="shrink-0 rounded border border-solid border-border bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        {item.shortcut}
      </kbd>
    ) : null}
  </CommandItem>
);

const CommandPagesView = ({
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
          <CommandGroup key={group.heading} className="mb-1 last:mb-0">
            <CommandGroupLabel className="px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground">
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
            <CommandGroupLabel className="px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground">
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

const CommandSearchBar = ({
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
  <div className="flex items-center gap-2 border-b border-solid border-border/80 px-3.5 py-2.5">
    {hasBack ? (
      <button
        type="button"
        aria-label="返回上一级"
        onClick={onBack}
        className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md border-0 bg-secondary text-foreground hover:bg-accent"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
      </button>
    ) : (
      <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    )}
    <CommandInput
      aria-label={title}
      placeholder={placeholder}
      className="h-7 min-w-0 flex-1 border-0 bg-transparent font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground"
    />
    <kbd className="shrink-0 rounded border border-solid border-border bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      ESC
    </kbd>
  </div>
);

interface CommandDialogBodyProps {
  title: string;
  placeholder: string;
  emptyText: string;
  groups: CommandMenuGroup[];
  query: string;
  pages: string[];
  className?: string;
  onQueryChange: (next: string) => void;
  onPagesChange: (next: string[]) => void;
  onRun: (item: CommandMenuItem) => void;
}

const CommandDialogBody = (p: CommandDialogBodyProps) => (
  <DialogContent
    data-slot="command-menu"
    className={cn(
      "fixed top-[16vh] left-1/2 z-50 m-0 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-solid border-border bg-popover p-0 text-popover-foreground shadow-lg outline-none",
      p.className,
    )}
  >
    <DialogTitle className="sr-only">{p.title}</DialogTitle>
    <DialogDescription className="sr-only">输入关键字过滤并按回车执行命令</DialogDescription>
    <Command
      query={p.query}
      onQueryChange={p.onQueryChange}
      pages={p.pages}
      onPagesChange={p.onPagesChange}
      loop
      autoHighlight
      className="flex flex-col"
    >
      <CommandSearchBar
        hasBack={p.pages.length > 0}
        title={p.title}
        placeholder={p.placeholder}
        onBack={() => p.onPagesChange(p.pages.slice(0, -1))}
      />
      <CommandList className="max-h-72 overflow-y-auto p-1.5">
        <CommandPagesView groups={p.groups} onRun={p.onRun} />
      </CommandList>
      <CommandEmpty className="py-8 text-center text-xs text-muted-foreground">
        {p.emptyText}
      </CommandEmpty>
    </Command>
  </DialogContent>
);

const useCommandMenuState = (
  open: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange: ((open: boolean) => void) | undefined,
  onSelect: ((id: string) => void) | undefined,
) => {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [pages, setPages] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const isOpen = open ?? innerOpen;

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    if (!next) {
      setPages([]);
      setQuery("");
    }
    onOpenChange?.(next);
  };

  const handleRun = (item: CommandMenuItem) => {
    if (item.subPage) {
      setPages((prev) => [...prev, item.id]);
      setQuery("");
      return;
    }
    item.onSelect?.();
    onSelect?.(item.id);
    setOpen(false);
  };

  return { isOpen, setOpen, pages, setPages, query, setQuery, handleRun };
};

export const CommandMenu = ({
  open,
  defaultOpen = false,
  onOpenChange,
  triggerLabel = "搜索命令…",
  enableGlobalShortcut = false,
  shortcutKey = "k",
  placeholder = "输入命令或关键词…",
  title = "命令面板",
  groups,
  emptyText = "没有匹配的命令",
  onSelect,
  className,
}: CommandMenuProps) => {
  const s = useCommandMenuState(open, defaultOpen, onOpenChange, onSelect);
  useGlobalCommandShortcut(enableGlobalShortcut, shortcutKey, () => s.setOpen(!s.isOpen));

  return (
    <Dialog open={s.isOpen} onOpenChange={(next) => s.setOpen(next)}>
      {triggerLabel !== null && (
        <DialogTrigger className={TRIGGER_CLASS}>
          <span className="inline-flex items-center gap-2">
            <Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
            <span>{triggerLabel}</span>
          </span>
          <kbd className="rounded border border-solid border-border bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘{shortcutKey.toUpperCase()}
          </kbd>
        </DialogTrigger>
      )}
      <DialogBackdrop className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm dark:bg-black/60" />
      <CommandDialogBody
        title={title}
        placeholder={placeholder}
        emptyText={emptyText}
        groups={groups}
        query={s.query}
        pages={s.pages}
        className={className}
        onQueryChange={s.setQuery}
        onPagesChange={s.setPages}
        onRun={s.handleRun}
      />
    </Dialog>
  );
};
