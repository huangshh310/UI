"use client";

/**
 * Combobox 的磨砂弹性下拉面板：关键词命中高亮、加载指示、空状态与单选/多选勾选。
 */
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Check, LoaderCircle } from "lucide-react";
import type { ComboboxDot, ComboboxOption, ComboboxRadius } from "./combobox.types.js";
import {
  comboboxDotVariants,
  comboboxItemVariants,
  comboboxPopupVariants,
} from "./combobox.variants.js";

export const ComboboxDotIndicator = ({ dot }: { dot?: ComboboxDot }) => {
  if (!dot) return null;
  return <span aria-hidden="true" className={comboboxDotVariants({ dot })} />;
};

/** 高亮选项文本中与输入关键字匹配的子串 */
const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
  const needle = query.trim();
  if (!needle) return <>{text}</>;
  const index = text.toLowerCase().indexOf(needle.toLowerCase());
  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-signal/15 px-0.5 font-medium text-foreground dark:bg-signal/25 dark:text-info">
        {text.slice(index, index + needle.length)}
      </mark>
      {text.slice(index + needle.length)}
    </>
  );
};

const OptionLeading = ({ item, multiple }: { item: ComboboxOption; multiple: boolean }) => (
  <>
    {multiple && (
      <span
        aria-hidden="true"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-solid border-input bg-transparent transition-colors duration-(--ui-duration-instant) group-data-selected/item:border-signal group-data-selected/item:bg-signal group-data-selected/item:text-signal-foreground"
      >
        <BaseCombobox.ItemIndicator className="inline-flex items-center justify-center">
          <Check aria-hidden="true" className="size-2.5 stroke-[2.75]" />
        </BaseCombobox.ItemIndicator>
      </span>
    )}
    {item.icon ? (
      <span
        aria-hidden="true"
        className="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground group-data-highlighted/item:text-foreground"
      >
        {item.icon}
      </span>
    ) : (
      <ComboboxDotIndicator dot={item.dot} />
    )}
  </>
);

const ComboboxOptionItem = ({
  item,
  query,
  multiple,
}: {
  item: ComboboxOption;
  query: string;
  multiple: boolean;
}) => (
  <BaseCombobox.Item value={item} disabled={item.disabled} className={comboboxItemVariants()}>
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <OptionLeading item={item} multiple={multiple} />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">
          <HighlightMatch text={item.label} query={query} />
        </span>
        {item.description && (
          <span className="truncate text-xs text-muted-foreground">{item.description}</span>
        )}
      </span>
    </span>
    <span className="flex shrink-0 items-center gap-2">
      {item.badge && (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {item.badge}
        </span>
      )}
      {!multiple && (
        <BaseCombobox.ItemIndicator className="inline-flex shrink-0 text-info">
          <Check aria-hidden="true" className="size-3.5 stroke-[2.25]" />
        </BaseCombobox.ItemIndicator>
      )}
    </span>
  </BaseCombobox.Item>
);

export interface ComboboxPopupProps {
  query: string;
  emptyText: string;
  loading: boolean;
  radius: ComboboxRadius;
  multiple: boolean;
  anchorEl?: HTMLDivElement | null;
}

export const ComboboxPopup = ({
  query,
  emptyText,
  loading,
  radius,
  multiple,
  anchorEl,
}: ComboboxPopupProps) => (
  <BaseCombobox.Portal>
    <BaseCombobox.Positioner
      anchor={anchorEl ?? undefined}
      side="bottom"
      align="start"
      sideOffset={6}
      className="z-(--ui-z-dropdown) outline-none"
    >
      <BaseCombobox.Popup className={comboboxPopupVariants({ radius })}>
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
        <BaseCombobox.List className="max-h-64 overflow-y-auto p-1 outline-none empty:hidden">
          {(item: ComboboxOption) => (
            <ComboboxOptionItem key={item.value} item={item} query={query} multiple={multiple} />
          )}
        </BaseCombobox.List>
      </BaseCombobox.Popup>
    </BaseCombobox.Positioner>
  </BaseCombobox.Portal>
);
