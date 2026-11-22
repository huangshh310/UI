"use client";

/**
 * 命令面板的搜索区：输入框与结果列表。
 *
 * 使用 Base UI 的 Autocomplete 的内联模式：列表始终可见，焦点留在输入框，
 * 方向键移动高亮，combobox 与 listbox 的 ARIA 语义由 Base UI 提供。
 */
import { Autocomplete } from "@base-ui/react/autocomplete";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { COMMAND_ITEMS, matchesCommand, type CommandItem } from "./command-items";

interface CommandSearchProps {
  /** 用户选中某个条目（点击，或高亮后按 Enter） */
  onSelect: (href: string) => void;
}

export const CommandSearch = ({ onSelect }: CommandSearchProps) => {
  const [query, setQuery] = useState("");

  return (
    <Autocomplete.Root
      inline
      open
      items={COMMAND_ITEMS}
      value={query}
      onValueChange={setQuery}
      autoHighlight="always"
      keepHighlight
      itemToStringValue={(item: CommandItem) => item.label}
      filter={(item: CommandItem, value: string) => matchesCommand(item, value)}
    >
      <div className="flex items-center gap-3 border-b border-border px-4">
        <MagnifyingGlassIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        <Autocomplete.Input
          aria-label="搜索"
          placeholder="搜索组件与页面"
          className="h-13 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ESC
        </kbd>
      </div>
      <Autocomplete.Empty className="px-4 py-10 text-center text-sm text-muted-foreground empty:hidden">
        没有匹配的结果
      </Autocomplete.Empty>
      <Autocomplete.List className="max-h-80 overflow-y-auto p-2 empty:hidden">
        {(item: CommandItem) => (
          <Autocomplete.Item
            key={item.id}
            value={item}
            onClick={() => onSelect(item.href)}
            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm data-highlighted:bg-accent"
          >
            {item.label}
            <span className="font-mono text-xs text-muted-foreground">{item.group}</span>
          </Autocomplete.Item>
        )}
      </Autocomplete.List>
    </Autocomplete.Root>
  );
};
