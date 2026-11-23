// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * OriginDropdown：基于 Base UI Menu 的锚点缩放磨砂下拉菜单。
 */

import { cn } from "@/lib/utils";
import { Menu } from "@base-ui/react/menu";
import { cva } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";

export const originDropdownTriggerVariants = cva(
  [
    "group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-solid font-sans font-medium outline-none",
    "transition-[background-color,border-color,color,box-shadow] duration-(--ui-duration-fast)",
    "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset",
  ],
  {
    variants: {
      variant: {
        default:
          "border-border/85 bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/22 hover:bg-card dark:border-white/12 dark:bg-card/90 dark:hover:border-white/22 dark:hover:bg-card",
        subtle:
          "border-transparent bg-secondary/75 text-foreground hover:bg-secondary dark:bg-white/8 dark:hover:bg-white/12",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-accent/80 dark:hover:bg-white/10",
      },
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-9.5 px-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const originDropdownPopupVariants = cva(
  [
    "z-50 origin-(--transform-origin) overflow-hidden rounded-xl border border-solid border-border/80 bg-popover/96 p-1 text-popover-foreground backdrop-blur-xl outline-none",
    "shadow-[0_14px_36px_-8px_rgba(0,0,0,0.14),0_2px_8px_-2px_rgba(0,0,0,0.05)]",
    "dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.72)]",
    "transition-[opacity,transform] duration-(--ui-duration-fast) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    "data-starting-style:scale-[0.95] data-starting-style:opacity-0 data-ending-style:scale-[0.96] data-ending-style:opacity-0",
  ],
  {
    variants: {
      size: {
        sm: "min-w-44",
        md: "min-w-54",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const originDropdownItemVariants = cva(
  [
    "group/item flex cursor-pointer items-center justify-between gap-3 rounded-lg outline-none select-none",
    "transition-colors duration-(--ui-duration-instant) data-disabled:pointer-events-none data-disabled:opacity-45",
  ],
  {
    variants: {
      tone: {
        default:
          "text-foreground data-highlighted:bg-accent/85 data-highlighted:text-accent-foreground dark:data-highlighted:bg-white/10",
        signal:
          "text-signal data-highlighted:bg-signal/12 dark:text-blue-300 dark:data-highlighted:bg-signal/20",
        destructive:
          "text-destructive data-highlighted:bg-destructive/10 dark:data-highlighted:bg-destructive/18",
      },
      size: {
        sm: "px-2 py-1.5 text-xs",
        md: "px-2.5 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "md",
    },
  },
);
export type OriginDropdownSize = "sm" | "md";
export type OriginDropdownTriggerVariant = "default" | "subtle" | "ghost";
export type OriginDropdownActionTone = "default" | "signal" | "destructive";

export type OriginDropdownActionEntry = {
  kind: "action";
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  shortcut?: string;
  tone?: OriginDropdownActionTone;
  disabled?: boolean;
  onSelect?: () => void;
};

export type OriginDropdownCheckboxEntry = {
  kind: "checkbox";
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
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
  /** 受控打开状态 */
  open?: boolean;
  /** 非受控初始打开状态 */
  defaultOpen?: boolean;
  /** 开关状态变更回调 */
  onOpenChange?: (open: boolean) => void;
  /** 自定义触发元素；省略时使用默认按钮与 label */
  trigger?: ReactElement;
  /** 默认触发按钮文案 */
  label?: string;
  /** 默认触发按钮视觉风格 */
  triggerVariant?: OriginDropdownTriggerVariant;
  /** 菜单密度尺寸 */
  size?: OriginDropdownSize;
  /** 菜单项列表（支持动作、勾选、分组与分隔线） */
  items: OriginDropdownEntry[];
  /** 展开方向 */
  side?: "top" | "bottom" | "left" | "right";
  /** 对齐方式 */
  align?: "start" | "center" | "end";
  /** 菜单与触发器的间距（像素） */
  sideOffset?: number;
  /** 菜单面板自定义类名 */
  className?: string;
}
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
                ? "text-signal dark:text-blue-300"
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
            : "border-input/70 bg-background text-transparent dark:border-white/20 dark:bg-card",
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
