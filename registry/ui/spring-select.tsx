// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SpringSelect：展开与收起带轻微回弹过冲的下选菜单。
 * 交互行为、键盘导航、typeahead 与焦点管理由 Base UI 的 Select 提供。
 */

import { cn } from "@/lib/utils";
import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

export interface SpringSelectOption {
  value: string;
  label: string;
  /** 选项下方的补充说明 */
  description?: string;
  disabled?: boolean;
}

export interface SpringSelectProps {
  /** 下拉选项清单 */
  options: SpringSelectOption[];
  /** 选择器上方标签，也是触发器的可访问名称 */
  label?: string;
  /** 未选择时的占位提示 */
  placeholder?: string;
  /** 受控选中值；null 表示清空 */
  value?: string | null;
  /** 非受控初始选中值 */
  defaultValue?: string | null;
  /** 选中值变化时调用 */
  onValueChange?: (value: string | null) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
}
const TRIGGER_CLASSES = cn(
  "group inline-flex h-10 w-full cursor-pointer items-center justify-between gap-2.5 rounded-xl border border-solid border-border bg-background px-3.5 dark:bg-card",
  "font-sans text-sm text-foreground shadow-xs select-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast)",
  "hover:border-foreground/22 hover:bg-accent/40 data-popup-open:border-ring/70",
  "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
);

const POPUP_CLASSES = cn(
  "min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-xl border border-solid border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none",
  "transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  "data-starting-style:-translate-y-1 data-starting-style:scale-96 data-starting-style:opacity-0",
  "data-ending-style:-translate-y-1 data-ending-style:scale-96 data-ending-style:opacity-0",
);

const ITEM_CLASSES = cn(
  "flex cursor-default items-center justify-between gap-3 rounded-md px-2.5 py-2 font-sans text-sm outline-none select-none",
  "transition-colors duration-(--ui-duration-instant) data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-45",
);

const SelectDropdown = ({ options }: { options: SpringSelectOption[] }) => (
  <Select.Portal>
    <Select.Positioner
      sideOffset={6}
      alignItemWithTrigger={false}
      className="z-(--ui-z-dropdown) outline-none"
    >
      <Select.Popup className={POPUP_CLASSES}>
        <Select.List className="max-h-64 overflow-y-auto outline-none">
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={ITEM_CLASSES}
            >
              <span className="flex min-w-0 flex-col">
                <Select.ItemText className="truncate font-medium">{option.label}</Select.ItemText>
                {option.description && (
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
              <Select.ItemIndicator className="inline-flex shrink-0 text-foreground">
                <Check aria-hidden="true" className="size-3.5" />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
);

export const SpringSelect = ({
  options,
  label,
  placeholder = "请选择…",
  onValueChange,
  className,
  "aria-label": ariaLabel,
  ...rootProps
}: SpringSelectProps) => (
  <div
    data-slot="spring-select"
    className={cn("flex w-full max-w-xs flex-col gap-1.5 font-sans", className)}
  >
    <Select.Root
      items={options.map(({ value, label: itemLabel }) => ({ value, label: itemLabel }))}
      onValueChange={(next) => onValueChange?.(next === null ? null : String(next))}
      {...rootProps}
    >
      {label && (
        <Select.Label className="text-[13px] font-medium tracking-tight text-foreground">
          {label}
        </Select.Label>
      )}
      <Select.Trigger aria-label={label ? undefined : ariaLabel} className={TRIGGER_CLASSES}>
        <Select.Value
          placeholder={placeholder}
          className="truncate data-placeholder:text-muted-foreground"
        />
        <Select.Icon className="inline-flex shrink-0 text-muted-foreground">
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-popup-open:rotate-180"
          />
        </Select.Icon>
      </Select.Trigger>
      <SelectDropdown options={options} />
    </Select.Root>
  </div>
);
