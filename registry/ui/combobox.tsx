// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Combobox：支持关键词过滤、命中下划线高亮、清空与异步加载的组合选择器。
 * 交互行为、过滤、键盘导航与 ARIA 语义由 Base UI 的 Combobox 提供。
 */

import { cn } from "@/lib/utils";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, LoaderCircle, X } from "lucide-react";
import { useId, useState } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  /** 选项的补充说明 */
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** 候选项列表 */
  options: ComboboxOption[];
  /** 标签文本，自动关联到搜索输入框 */
  label?: string;
  /** 输入框占位文本 */
  placeholder?: string;
  /** 无匹配结果时的提示文案，默认「没有匹配项」 */
  emptyText?: string;
  /** 受控选中值；null 表示未选 */
  value?: string | null;
  /** 非受控初始选中值 */
  defaultValue?: string | null;
  /** 选中值变化时调用 */
  onValueChange?: (value: string | null) => void;
  /** 搜索关键词变化时调用（可用于异步远程检索） */
  onInputValueChange?: (query: string) => void;
  /** 是否处于远程检索中 */
  loading?: boolean;
  /** 是否允许点击清除按钮清空选中值，默认是 */
  clearable?: boolean;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
}
const GROUP_CLASSES = cn(
  "group relative flex h-10 w-full items-center gap-1 rounded-lg border border-solid border-border bg-background px-3 shadow-sm transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) dark:bg-card",
  "hover:border-foreground/22 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
);

const POPUP_CLASSES = cn(
  "min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-xl border border-solid border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none",
  "transition-[transform,opacity] duration-(--ui-duration-fast) ease-out",
  "data-starting-style:-translate-y-1 data-starting-style:scale-96 data-starting-style:opacity-0",
  "data-ending-style:scale-96 data-ending-style:opacity-0",
);

const ITEM_CLASSES = cn(
  "flex cursor-default items-center justify-between gap-3 rounded-md px-2.5 py-2 font-sans text-sm outline-none select-none",
  "transition-colors duration-(--ui-duration-instant) data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-45",
);

const ACTION_BTN_CLASSES =
  "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring";

/** 高亮选项文本中与输入关键字匹配的子串 */
const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
  const needle = query.trim();
  if (!needle) return <>{text}</>;
  const index = text.toLowerCase().indexOf(needle.toLowerCase());
  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-signal/15 px-0.5 font-medium text-foreground">
        {text.slice(index, index + needle.length)}
      </mark>
      {text.slice(index + needle.length)}
    </>
  );
};

const ComboboxControl = ({
  id,
  ariaLabel,
  placeholder,
  clearable,
}: {
  id: string;
  ariaLabel?: string;
  placeholder: string;
  clearable: boolean;
}) => (
  <BaseCombobox.InputGroup className={GROUP_CLASSES}>
    <BaseCombobox.Input
      id={id}
      aria-label={ariaLabel}
      placeholder={placeholder}
      className="h-full w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-muted-foreground"
    />
    {clearable && (
      <BaseCombobox.Clear aria-label="清除选项" className={ACTION_BTN_CLASSES}>
        <X aria-hidden="true" className="size-3.5" />
      </BaseCombobox.Clear>
    )}
    <BaseCombobox.Trigger aria-label="展开选项" className={ACTION_BTN_CLASSES}>
      <ChevronDown
        aria-hidden="true"
        className="size-4 transition-transform duration-(--ui-duration-fast) group-data-popup-open:rotate-180"
      />
    </BaseCombobox.Trigger>
  </BaseCombobox.InputGroup>
);

const ComboboxPopup = ({
  query,
  emptyText,
  loading,
}: {
  query: string;
  emptyText: string;
  loading: boolean;
}) => (
  <BaseCombobox.Portal>
    <BaseCombobox.Positioner sideOffset={6} className="z-(--ui-z-dropdown) outline-none">
      <BaseCombobox.Popup className={POPUP_CLASSES}>
        {loading && (
          <BaseCombobox.Status className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted-foreground">
            <LoaderCircle
              aria-hidden="true"
              className="size-3.5 animate-spin motion-reduce:animate-none"
            />
            正在搜索…
          </BaseCombobox.Status>
        )}
        <BaseCombobox.Empty className="px-3 py-5 text-center text-xs text-muted-foreground empty:hidden">
          {emptyText}
        </BaseCombobox.Empty>
        <BaseCombobox.List className="max-h-64 overflow-y-auto outline-none empty:hidden">
          {(item: ComboboxOption) => (
            <BaseCombobox.Item
              key={item.value}
              value={item}
              disabled={item.disabled}
              className={ITEM_CLASSES}
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium">
                  <HighlightMatch text={item.label} query={query} />
                </span>
                {item.description && (
                  <span className="truncate text-xs text-muted-foreground">{item.description}</span>
                )}
              </span>
              <BaseCombobox.ItemIndicator className="inline-flex shrink-0 text-signal">
                <Check aria-hidden="true" className="size-3.5" />
              </BaseCombobox.ItemIndicator>
            </BaseCombobox.Item>
          )}
        </BaseCombobox.List>
      </BaseCombobox.Popup>
    </BaseCombobox.Positioner>
  </BaseCombobox.Portal>
);

const findOption = (options: ComboboxOption[], val: string | null | undefined) =>
  val ? (options.find((item) => item.value === val) ?? null) : null;

const ComboboxLabel = ({ htmlFor, label }: { htmlFor: string; label?: string }) =>
  label ? (
    <label htmlFor={htmlFor} className="text-[13px] font-medium tracking-tight text-foreground">
      {label}
    </label>
  ) : null;

export const Combobox = ({
  options,
  label,
  placeholder = "输入关键词搜索…",
  emptyText = "没有匹配项",
  value,
  defaultValue,
  onValueChange,
  onInputValueChange,
  loading = false,
  clearable = true,
  className,
  "aria-label": ariaLabel,
  ...rootProps
}: ComboboxProps) => {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const controlled = value !== undefined ? { value: findOption(options, value) } : {};

  return (
    <div
      data-slot="combobox"
      className={cn("flex w-full max-w-xs flex-col gap-1.5 font-sans", className)}
    >
      <BaseCombobox.Root
        items={options}
        {...controlled}
        defaultValue={findOption(options, defaultValue)}
        isItemEqualToValue={(a, b) => a?.value === b?.value}
        onValueChange={(next) => onValueChange?.(next?.value ?? null)}
        onInputValueChange={(next) => {
          setQuery(next);
          onInputValueChange?.(next);
        }}
        {...rootProps}
      >
        <ComboboxLabel htmlFor={inputId} label={label} />
        <ComboboxControl
          id={inputId}
          ariaLabel={label ? undefined : ariaLabel}
          placeholder={placeholder}
          clearable={clearable}
        />
        <ComboboxPopup query={query} emptyText={emptyText} loading={loading} />
      </BaseCombobox.Root>
    </div>
  );
};
