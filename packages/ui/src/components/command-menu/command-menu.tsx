"use client";

/**
 * CommandMenu：基于 @ui-sdk/react（Dialog + Command）的单底座磨砂命令面板，
 * 支持分组检索、匹配高亮、子级页面栈、多键帽提示与可选全局快捷键。
 */
import { Command, CommandEmpty, CommandList } from "@ui-sdk/react/command";
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { cn } from "@matt-ui/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandFooterBar, CommandPagesView, CommandSearchBar } from "./command-menu-parts.js";
import type {
  CommandMenuGroup,
  CommandMenuItem,
  CommandMenuProps,
  CommandMenuSize,
} from "./command-menu.types.js";
import {
  commandMenuDialogVariants,
  commandMenuKbdVariants,
  commandMenuTriggerVariants,
} from "./command-menu.variants.js";

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

interface CommandDialogBodyProps {
  title: string;
  placeholder: string;
  emptyText: string;
  size: CommandMenuSize;
  showFooter: boolean;
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
    data-size={p.size}
    className={cn(commandMenuDialogVariants({ size: p.size }), p.className)}
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
      {p.showFooter && <CommandFooterBar hasBack={p.pages.length > 0} />}
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

const CommandMenuTrigger = ({
  triggerLabel,
  shortcutKey,
}: {
  triggerLabel: string | null;
  shortcutKey: string;
}) => {
  if (triggerLabel === null) return null;
  return (
    <DialogTrigger className={commandMenuTriggerVariants()}>
      <span className="inline-flex min-w-0 items-center gap-2">
        <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{triggerLabel}</span>
      </span>
      <kbd className={commandMenuKbdVariants()}>⌘{shortcutKey.toUpperCase()}</kbd>
    </DialogTrigger>
  );
};

export const CommandMenu = (props: CommandMenuProps) => {
  const {
    open,
    defaultOpen = false,
    onOpenChange,
    triggerLabel = "搜索命令…",
    enableGlobalShortcut = false,
    shortcutKey = "k",
    placeholder = "输入命令或关键词…",
    title = "命令面板",
    emptyText = "没有匹配的命令",
    size = "md",
    showFooter = true,
  } = props;
  const s = useCommandMenuState(open, defaultOpen, onOpenChange, props.onSelect);
  useGlobalCommandShortcut(enableGlobalShortcut, shortcutKey, () => s.setOpen(!s.isOpen));

  return (
    <Dialog open={s.isOpen} onOpenChange={(next) => s.setOpen(next)}>
      <CommandMenuTrigger triggerLabel={triggerLabel} shortcutKey={shortcutKey} />
      <DialogBackdrop className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[6px] dark:bg-black/65" />
      <CommandDialogBody
        title={title}
        placeholder={placeholder}
        emptyText={emptyText}
        size={size}
        showFooter={showFooter}
        groups={props.groups}
        query={s.query}
        pages={s.pages}
        className={props.className}
        onQueryChange={s.setQuery}
        onPagesChange={s.setPages}
        onRun={s.handleRun}
      />
    </Dialog>
  );
};
