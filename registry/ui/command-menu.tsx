// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * CommandMenu：基于 @ui-sdk/react（Dialog + Command）的单底座磨砂命令面板，
 * 支持分组检索、匹配高亮、子级页面栈、多键帽提示与可选全局快捷键。
 */

import { cn } from "@/lib/utils";
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
import { cva } from "class-variance-authority";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

export const commandMenuTriggerVariants = cva([
  "inline-flex h-9 w-full max-w-xs cursor-pointer items-center justify-between gap-3 rounded-xl border border-solid border-border/85 bg-background px-3 font-sans text-sm text-muted-foreground outline-none",
  "shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,background-color,color,box-shadow] duration-(--ui-duration-fast)",
  "hover:border-foreground/22 hover:bg-card hover:text-foreground",
  "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  "dark:border-white/12 dark:bg-card/90 dark:hover:border-white/22 dark:hover:bg-card",
]);

export const commandMenuDialogVariants = cva(
  [
    "fixed top-[15vh] left-1/2 z-50 m-0 w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden",
    "rounded-2xl border border-solid border-border/80 bg-popover/96 p-0 text-popover-foreground backdrop-blur-xl outline-none",
    "shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18),0_4px_16px_-4px_rgba(0,0,0,0.06)]",
    "dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_28px_72px_-12px_rgba(0,0,0,0.78)]",
  ],
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const commandMenuItemVariants = cva([
  "group/cmd flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none select-none",
  "transition-colors duration-(--ui-duration-instant)",
  "data-[highlighted]:bg-accent/90 data-[highlighted]:text-accent-foreground dark:data-[highlighted]:bg-white/10",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
  "[&_mark]:rounded [&_mark]:bg-signal/15 [&_mark]:px-0.5 [&_mark]:font-medium [&_mark]:text-foreground [&_mark]:dark:bg-signal/25 [&_mark]:dark:text-info",
]);

export const commandMenuKbdVariants = cva(
  "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-solid border-border/85 bg-secondary/75 px-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:border-white/12 dark:bg-white/7 dark:shadow-[0_1px_0_rgba(0,0,0,0.35)]",
);
export type CommandMenuSize = "sm" | "md" | "lg";

export interface CommandMenuSubPage {
  heading: string;
  items: Omit<CommandMenuItem, "subPage">[];
}

export interface CommandMenuItem {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  badge?: string;
  shortcut?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  /** 点击后进入二级子命令页面栈 */
  subPage?: CommandMenuSubPage;
}

export interface CommandMenuGroup {
  heading: string;
  items: CommandMenuItem[];
}

export interface CommandMenuProps {
  /** 受控打开状态 */
  open?: boolean;
  /** 非受控初始打开状态 */
  defaultOpen?: boolean;
  /** 开关状态回调 */
  onOpenChange?: (open: boolean) => void;
  /** 默认触发按钮文案；传 null 时不渲染触发按钮 */
  triggerLabel?: string | null;
  /** 是否注册全局 ⌘K / Ctrl+K 快捷键（默认 false，避免多实例冲突） */
  enableGlobalShortcut?: boolean;
  /** 全局快捷键字母，默认 k */
  shortcutKey?: string;
  /** 搜索输入框占位符 */
  placeholder?: string;
  /** 弹窗无障碍标题 */
  title?: string;
  /** 分组命令列表 */
  groups: CommandMenuGroup[];
  /** 无匹配结果时的提示 */
  emptyText?: string;
  /** 弹窗最大宽度预设 */
  size?: CommandMenuSize;
  /** 是否在面板底部显示键盘操作提示栏 */
  showFooter?: boolean;
  /** 选中叶子命令后的回调 */
  onSelect?: (id: string) => void;
  /** 面板自定义类名 */
  className?: string;
}
const ShortcutKeys = ({ shortcut }: { shortcut: string }) => {
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

const CommandFooterBar = ({ hasBack }: { hasBack: boolean }) => (
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
