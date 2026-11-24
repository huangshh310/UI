"use client";

/**
 * OriginDropdown：带锚点缩放动效、分组快捷键与完整键盘导航的磨砂下拉菜单。
 */
import { Menu } from "@base-ui/react/menu";
import { cn } from "@matt-ui/utils";
import { Check, ChevronDown } from "lucide-react";
import type {
  OriginDropdownActionEntry,
  OriginDropdownCheckboxEntry,
  OriginDropdownEntry,
  OriginDropdownProps,
  OriginDropdownSize,
} from "./origin-dropdown.types.js";
import {
  originDropdownItemVariants,
  originDropdownPopupVariants,
  originDropdownTriggerVariants,
} from "./origin-dropdown.variants.js";

const KBD_CLASS =
  "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md border border-solid border-border/85 bg-secondary/75 px-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:border-white/12 dark:bg-white/7 dark:shadow-[0_1px_0_rgba(0,0,0,0.35)]";

const ActionRow = ({
  item,
  size,
}: {
  item: OriginDropdownActionEntry;
  size: OriginDropdownSize;
}) => (
  <Menu.Item
    disabled={item.disabled}
    onClick={item.onSelect}
    className={originDropdownItemVariants({ tone: item.tone ?? "default", size })}
  >
    <span className="flex min-w-0 items-center gap-2.5">
      {item.icon && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex shrink-0 items-center justify-center transition-colors",
            item.tone === "destructive"
              ? "text-destructive"
              : item.tone === "signal"
                ? "text-info"
                : "text-muted-foreground group-data-highlighted/item:text-foreground",
          )}
        >
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
    {(item.badge || item.shortcut) && (
      <span className="flex shrink-0 items-center gap-1.5">
        {item.badge && (
          <span className="rounded-full bg-secondary/85 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground dark:bg-white/8">
            {item.badge}
          </span>
        )}
        {item.shortcut && <kbd className={KBD_CLASS}>{item.shortcut}</kbd>}
      </span>
    )}
  </Menu.Item>
);

const CheckboxRow = ({
  item,
  size,
}: {
  item: OriginDropdownCheckboxEntry;
  size: OriginDropdownSize;
}) => (
  <Menu.CheckboxItem
    checked={item.checked}
    disabled={item.disabled}
    onCheckedChange={(checked) => item.onCheckedChange?.(checked)}
    className={originDropdownItemVariants({ tone: "default", size })}
  >
    <span className="flex min-w-0 items-center gap-2.5">
      <span
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-solid transition-colors duration-(--ui-duration-instant)",
          item.checked
            ? "border-signal bg-signal text-signal-foreground"
            : "border-input bg-card text-transparent",
        )}
      >
        <Menu.CheckboxItemIndicator className="inline-flex items-center justify-center">
          <Check aria-hidden="true" className="size-2.5 stroke-[2.75]" />
        </Menu.CheckboxItemIndicator>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{item.label}</span>
        {item.description && (
          <span className="truncate text-xs text-muted-foreground">{item.description}</span>
        )}
      </span>
    </span>
    {item.shortcut && <kbd className={KBD_CLASS}>{item.shortcut}</kbd>}
  </Menu.CheckboxItem>
);

const renderEntry = (entry: OriginDropdownEntry, index: number, size: OriginDropdownSize) => {
  if (entry.kind === "separator") {
    return (
      <Menu.Separator key={`sep-${index}`} className="my-1 h-px bg-border/75 dark:bg-white/8" />
    );
  }
  if (entry.kind === "group") {
    return (
      <Menu.Group key={`group-${entry.label}-${index}`}>
        <Menu.GroupLabel className="px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground">
          {entry.label}
        </Menu.GroupLabel>
        {entry.items.map((child) =>
          child.kind === "checkbox" ? (
            <CheckboxRow key={child.id} item={child} size={size} />
          ) : (
            <ActionRow key={child.id} item={child} size={size} />
          ),
        )}
      </Menu.Group>
    );
  }
  return entry.kind === "checkbox" ? (
    <CheckboxRow key={entry.id} item={entry} size={size} />
  ) : (
    <ActionRow key={entry.id} item={entry} size={size} />
  );
};

export const OriginDropdown = ({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  label = "操作菜单",
  triggerVariant = "default",
  size = "md",
  items,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  className,
}: OriginDropdownProps) => (
  <Menu.Root open={open} defaultOpen={defaultOpen} onOpenChange={(next) => onOpenChange?.(next)}>
    {trigger ? (
      <Menu.Trigger render={trigger} />
    ) : (
      <Menu.Trigger className={originDropdownTriggerVariants({ variant: triggerVariant, size })}>
        <span>{label}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-data-popup-open:rotate-180"
        />
      </Menu.Trigger>
    )}
    <Menu.Portal>
      <Menu.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50">
        <Menu.Popup
          data-slot="origin-dropdown"
          data-size={size}
          className={cn(originDropdownPopupVariants({ size }), className)}
        >
          {items.map((entry, index) => renderEntry(entry, index, size))}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);
