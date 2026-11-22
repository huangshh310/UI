// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * OriginDropdown：基于 Base UI Menu 的锚点缩放下拉菜单。
 */

import { cn } from "@/lib/utils";
import { Menu } from "@base-ui/react/menu";
import { Check, ChevronDown } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";

export type OriginDropdownActionEntry = {
  kind: "action";
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  tone?: "default" | "destructive";
  disabled?: boolean;
  onSelect?: () => void;
};

export type OriginDropdownCheckboxEntry = {
  kind: "checkbox";
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export type OriginDropdownSeparatorEntry = {
  kind: "separator";
};

export type OriginDropdownGroupEntry = {
  kind: "group";
  label: string;
  items: (OriginDropdownActionEntry | OriginDropdownCheckboxEntry)[];
};

export type OriginDropdownEntry =
  | OriginDropdownActionEntry
  | OriginDropdownCheckboxEntry
  | OriginDropdownSeparatorEntry
  | OriginDropdownGroupEntry;

export interface OriginDropdownProps {
  /** 自定义触发元素；省略时使用默认按钮与 label */
  trigger?: ReactElement;
  /** 默认触发按钮文案 */
  label?: string;
  /** 菜单项列表（支持动作、勾选、分组与分隔线） */
  items: OriginDropdownEntry[];
  /** 展开方向 */
  side?: "top" | "bottom" | "left" | "right";
  /** 对齐方式 */
  align?: "start" | "center" | "end";
  /** 菜单面板自定义类名 */
  className?: string;
}
const POPUP_CLASS = cn(
  "z-50 min-w-52 origin-(--transform-origin) rounded-xl border border-solid border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none",
  "transition-[opacity,transform] duration-(--ui-duration-fast) ease-(--ui-ease-out) motion-reduce:transition-none",
  "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
);

const TRIGGER_CLASS = cn(
  "group inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-solid border-border bg-background px-3 font-sans text-sm font-medium text-foreground shadow-sm dark:bg-card",
  "transition-colors duration-(--ui-duration-fast) hover:border-foreground/22 hover:bg-accent/50 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
);

const ActionRow = ({ item }: { item: OriginDropdownActionEntry }) => (
  <Menu.Item
    disabled={item.disabled}
    onClick={item.onSelect}
    className={cn(
      "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-sm outline-none select-none transition-colors duration-(--ui-duration-fast)",
      item.tone === "destructive"
        ? "text-destructive data-highlighted:bg-destructive/10"
        : "text-foreground data-highlighted:bg-accent",
      "data-disabled:pointer-events-none data-disabled:opacity-45",
    )}
  >
    <span className="flex min-w-0 items-center gap-2.5">
      {item.icon && (
        <span aria-hidden="true" className="shrink-0 text-muted-foreground">
          {item.icon}
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{item.label}</span>
        {item.description && (
          <span className="truncate text-xs text-muted-foreground">{item.description}</span>
        )}
      </span>
    </span>
    {item.shortcut && (
      <kbd className="shrink-0 rounded border border-solid border-border bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        {item.shortcut}
      </kbd>
    )}
  </Menu.Item>
);

const CheckboxRow = ({ item }: { item: OriginDropdownCheckboxEntry }) => (
  <Menu.CheckboxItem
    checked={item.checked}
    disabled={item.disabled}
    onCheckedChange={(checked) => item.onCheckedChange?.(checked)}
    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-foreground outline-none select-none transition-colors duration-(--ui-duration-fast) data-disabled:pointer-events-none data-disabled:opacity-45 data-highlighted:bg-accent"
  >
    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded border border-solid border-border bg-background text-signal dark:bg-card">
      <Menu.CheckboxItemIndicator>
        <Check aria-hidden="true" className="size-3 stroke-[2.5]" />
      </Menu.CheckboxItemIndicator>
    </span>
    <span className="truncate font-medium">{item.label}</span>
  </Menu.CheckboxItem>
);

const renderEntry = (entry: OriginDropdownEntry, index: number) => {
  if (entry.kind === "separator") {
    return <Menu.Separator key={`sep-${index}`} className="my-1 h-px bg-border/80" />;
  }
  if (entry.kind === "group") {
    return (
      <Menu.Group key={`group-${entry.label}-${index}`}>
        <Menu.GroupLabel className="px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {entry.label}
        </Menu.GroupLabel>
        {entry.items.map((child) =>
          child.kind === "checkbox" ? (
            <CheckboxRow key={child.id} item={child} />
          ) : (
            <ActionRow key={child.id} item={child} />
          ),
        )}
      </Menu.Group>
    );
  }
  return entry.kind === "checkbox" ? (
    <CheckboxRow key={entry.id} item={entry} />
  ) : (
    <ActionRow key={entry.id} item={entry} />
  );
};

export const OriginDropdown = ({
  trigger,
  label = "操作菜单",
  items,
  side = "bottom",
  align = "start",
  className,
}: OriginDropdownProps) => (
  <Menu.Root>
    {trigger ? (
      <Menu.Trigger render={trigger} />
    ) : (
      <Menu.Trigger className={TRIGGER_CLASS}>
        <span>{label}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-data-popup-open:rotate-180"
        />
      </Menu.Trigger>
    )}
    <Menu.Portal>
      <Menu.Positioner side={side} align={align} sideOffset={6} className="z-50">
        <Menu.Popup data-slot="origin-dropdown" className={cn(POPUP_CLASS, className)}>
          {items.map(renderEntry)}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);
