"use client";

/**
 * SpringSelect 的弹性下拉面板：极简磨砂浮层、分组标题、单选勾选与多选复选指示。
 */
import { Select } from "@base-ui/react/select";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type {
  SpringSelectDot,
  SpringSelectOption,
  SpringSelectRadius,
  SpringSelectTone,
} from "./spring-select.types.js";
import {
  selectCheckVariants,
  selectDotVariants,
  selectItemVariants,
  selectMultiBoxVariants,
  selectPopupVariants,
} from "./spring-select.variants.js";

export const OptionDot = ({ dot }: { dot?: SpringSelectDot }) => {
  if (!dot) return null;
  return <span aria-hidden="true" className={selectDotVariants({ dot })} />;
};

const OptionLeading = ({
  option,
  multiple,
  tone,
}: {
  option: SpringSelectOption;
  multiple: boolean;
  tone: SpringSelectTone;
}) => (
  <>
    {multiple && (
      <span aria-hidden="true" className={selectMultiBoxVariants({ tone })}>
        <Select.ItemIndicator className="inline-flex items-center justify-center">
          <Check aria-hidden="true" className="size-2.5 stroke-[2.75]" />
        </Select.ItemIndicator>
      </span>
    )}
    {option.icon ? (
      <span
        aria-hidden="true"
        className="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-colors group-data-highlighted/item:text-foreground group-data-selected/item:text-current"
      >
        {option.icon}
      </span>
    ) : (
      <OptionDot dot={option.dot} />
    )}
  </>
);

const OptionRow = ({
  option,
  tone,
  multiple,
}: {
  option: SpringSelectOption;
  tone: SpringSelectTone;
  multiple: boolean;
}) => (
  <Select.Item
    value={option.value}
    disabled={option.disabled}
    className={selectItemVariants({ tone })}
  >
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <OptionLeading option={option} multiple={multiple} tone={tone} />
      <span className="flex min-w-0 flex-col">
        <span className="flex min-w-0 items-center gap-1.5">
          {option.icon && <OptionDot dot={option.dot} />}
          <Select.ItemText className="truncate font-medium">{option.label}</Select.ItemText>
        </span>
        {option.description && (
          <span className="truncate text-xs text-muted-foreground">{option.description}</span>
        )}
      </span>
    </span>
    <span className="flex shrink-0 items-center gap-2">
      {option.badge && (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {option.badge}
        </span>
      )}
      {!multiple && (
        <Select.ItemIndicator className={selectCheckVariants({ tone })}>
          <Check aria-hidden="true" className="size-3.5 stroke-[2.25]" />
        </Select.ItemIndicator>
      )}
    </span>
  </Select.Item>
);

interface OptionBucket {
  group?: string;
  items: SpringSelectOption[];
}

const groupOptions = (options: SpringSelectOption[]): OptionBucket[] => {
  const buckets: OptionBucket[] = [];
  const byName = new Map<string, OptionBucket>();
  for (const option of options) {
    const key = option.group ?? "__ungrouped__";
    let bucket = byName.get(key);
    if (!bucket) {
      bucket = { group: option.group, items: [] };
      byName.set(key, bucket);
      buckets.push(bucket);
    }
    bucket.items.push(option);
  }
  return buckets;
};

const OptionListContent = ({
  options,
  tone,
  multiple,
}: {
  options: SpringSelectOption[];
  tone: SpringSelectTone;
  multiple: boolean;
}) => {
  if (!options.some((option) => Boolean(option.group))) {
    return (
      <>
        {options.map((option) => (
          <OptionRow key={option.value} option={option} tone={tone} multiple={multiple} />
        ))}
      </>
    );
  }

  return (
    <>
      {groupOptions(options).map((bucket, index) => (
        <Select.Group key={bucket.group ?? `group-${index}`}>
          {index > 0 && <Select.Separator className="mx-1 my-1 h-px bg-border/65" />}
          {bucket.group && (
            <Select.GroupLabel className="px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {bucket.group}
            </Select.GroupLabel>
          )}
          {bucket.items.map((option) => (
            <OptionRow key={option.value} option={option} tone={tone} multiple={multiple} />
          ))}
        </Select.Group>
      ))}
    </>
  );
};

const MultiSelectionFooter = ({ count, onClear }: { count: number; onClear: () => void }) => (
  <div className="flex items-center justify-between border-t border-solid border-border/65 px-2.5 py-1.5 text-[11px] text-muted-foreground">
    <span className="tabular-nums">已选 {count} 项</span>
    <button
      type="button"
      onClick={onClear}
      className="cursor-pointer rounded-md border-0 bg-transparent px-1.5 py-0.5 text-[11px] font-medium text-foreground transition-colors hover:bg-accent"
    >
      清空已选
    </button>
  </div>
);

export interface SelectDropdownProps {
  options: SpringSelectOption[];
  radius: SpringSelectRadius;
  tone: SpringSelectTone;
  multiple: boolean;
  selectedCount: number;
  onClearAll?: () => void;
  popupHeader?: ReactNode;
  popupFooter?: ReactNode;
}

export const SelectDropdown = ({
  options,
  radius,
  tone,
  multiple,
  selectedCount,
  onClearAll,
  popupHeader,
  popupFooter,
}: SelectDropdownProps) => (
  <Select.Portal>
    <Select.Positioner
      side="bottom"
      align="start"
      sideOffset={6}
      alignItemWithTrigger={false}
      className="z-(--ui-z-dropdown) outline-none"
    >
      <Select.Popup className={selectPopupVariants({ radius })}>
        {popupHeader && (
          <div className="border-b border-solid border-border/65 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
            {popupHeader}
          </div>
        )}
        <Select.List className="max-h-64 overflow-y-auto p-1 outline-none">
          <OptionListContent options={options} tone={tone} multiple={multiple} />
        </Select.List>
        {popupFooter ? (
          <div className="border-t border-solid border-border/65 px-3 py-1.5 text-[11px] text-muted-foreground">
            {popupFooter}
          </div>
        ) : (
          multiple &&
          selectedCount > 0 &&
          onClearAll && <MultiSelectionFooter count={selectedCount} onClear={onClearAll} />
        )}
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
);
