// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SpringSelect：展开与收起带轻微回弹过冲的下选菜单，支持单选与多选芯片模式。
 * 交互行为、键盘导航、typeahead 与焦点管理由 Base UI 的 Select 提供。
 */

import { cn } from "@/lib/utils";
import { Select } from "@base-ui/react/select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, X } from "lucide-react";
import { type ReactNode, useState } from "react";

export const selectTriggerVariants = cva(
  "group inline-flex w-full cursor-pointer items-center justify-between gap-2 border border-solid font-sans text-foreground select-none transition-[border-color,background-color,box-shadow] duration-(--ui-duration-fast) outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-inset data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input/50 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 hover:bg-card data-popup-open:border-ring dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22 dark:hover:bg-card",
        filled:
          "border-transparent bg-secondary/75 hover:bg-secondary data-popup-open:border-ring data-popup-open:bg-card focus-visible:bg-card dark:bg-white/7 dark:hover:bg-white/11",
        elevated:
          "border-border/85 bg-card shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/20 data-popup-open:border-ring dark:border-white/12 dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.5)]",
        ghost: "border-transparent bg-transparent hover:bg-accent/70 data-popup-open:bg-accent/80",
      },
      size: {
        sm: "min-h-8 px-2.5 py-1 text-xs",
        md: "min-h-9.5 px-3 py-1.5 text-sm",
        lg: "min-h-11 px-3.5 py-2 text-sm",
      },
      radius: {
        md: "rounded-lg",
        lg: "rounded-xl",
        pill: "rounded-full",
      },
      invalid: {
        true: "border-destructive hover:border-destructive data-popup-open:border-destructive focus-visible:border-destructive focus-visible:ring-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "md",
      invalid: false,
    },
  },
);

export const selectPopupVariants = cva(
  "min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden border border-solid border-border/80 bg-popover/96 text-popover-foreground backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.12),0_2px_6px_-1px_rgba(0,0,0,0.04)] outline-none transition-[transform,opacity] duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] data-starting-style:-translate-y-1 data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:-translate-y-0.5 data-ending-style:scale-[0.98] data-ending-style:opacity-0 dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]",
  {
    variants: {
      radius: {
        md: "rounded-xl",
        lg: "rounded-2xl",
        pill: "rounded-2xl",
      },
    },
    defaultVariants: {
      radius: "md",
    },
  },
);

export const selectItemVariants = cva(
  "group/item flex cursor-pointer items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 font-sans text-sm outline-none select-none transition-colors duration-(--ui-duration-instant) data-disabled:pointer-events-none data-disabled:opacity-45",
  {
    variants: {
      tone: {
        default:
          "text-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        signal:
          "text-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:text-signal dark:data-selected:text-[#93b4ff]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const selectCheckVariants = cva(
  "inline-flex size-4 shrink-0 items-center justify-center transition-transform duration-(--ui-duration-fast) ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  {
    variants: {
      tone: {
        default: "text-foreground",
        signal: "text-signal dark:text-[#93b4ff]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const selectMultiBoxVariants = cva(
  "inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-solid border-input/70 bg-transparent transition-colors duration-(--ui-duration-instant)",
  {
    variants: {
      tone: {
        default:
          "group-data-selected/item:border-foreground group-data-selected/item:bg-foreground group-data-selected/item:text-background",
        signal:
          "group-data-selected/item:border-signal group-data-selected/item:bg-signal group-data-selected/item:text-signal-foreground",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export const selectDotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    dot: {
      signal: "bg-signal",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      destructive: "bg-destructive",
      muted: "bg-muted-foreground/55",
    },
  },
});
export type SpringSelectVariant = NonNullable<
  VariantProps<typeof selectTriggerVariants>["variant"]
>;
export type SpringSelectSize = NonNullable<VariantProps<typeof selectTriggerVariants>["size"]>;
export type SpringSelectRadius = NonNullable<VariantProps<typeof selectTriggerVariants>["radius"]>;
export type SpringSelectTone = NonNullable<VariantProps<typeof selectItemVariants>["tone"]>;
export type SpringSelectDot = NonNullable<VariantProps<typeof selectDotVariants>["dot"]>;

export interface SpringSelectOption {
  value: string;
  label: string;
  /** 选项下方的补充说明 */
  description?: string;
  /** 选项左侧图标或微件 */
  icon?: ReactNode;
  /** 选项右侧紧凑附加信息（例如 "18ms" / "Pro" / "推荐"） */
  badge?: string;
  /** 选项左侧状态圆点颜色 */
  dot?: SpringSelectDot;
  /** 分组标题；同组选项会自动归入同一分组渲染 */
  group?: string;
  disabled?: boolean;
}

interface SpringSelectBaseProps {
  /** 下拉选项清单 */
  options: SpringSelectOption[];
  /** 选择器上方标签，也是触发器的可访问名称 */
  label?: string;
  /** 未选择时的占位提示 */
  placeholder?: string;
  /** 视觉风格：标准描边、柔灰填充、轻浮雕或极简幽灵 */
  variant?: SpringSelectVariant;
  /** 触发器尺寸 */
  size?: SpringSelectSize;
  /** 圆角风格：标准、柔和圆角或胶囊形 */
  radius?: SpringSelectRadius;
  /** 选中态与勾选图标色调 */
  tone?: SpringSelectTone;
  /** 触发器前置装饰图标（未选中时显示） */
  prefix?: ReactNode;
  /** 单选时是否在触发器内一并显示已选项的说明文字 */
  showSelectedDescription?: boolean;
  /** 选中后是否显示一键清空按钮 */
  clearable?: boolean;
  /** 下拉面板顶部标题栏 */
  popupHeader?: ReactNode;
  /** 下拉面板底部信息栏 */
  popupFooter?: ReactNode;
  /** 下方辅助提示文案 */
  hint?: string;
  /** 错误校验文案（传入时触发错误边框与 aria-invalid） */
  error?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
}

export interface SpringSelectSingleProps extends SpringSelectBaseProps {
  /** 单选模式（默认） */
  multiple?: false;
  /** 受控选中值；null 表示清空 */
  value?: string | null;
  /** 非受控初始选中值 */
  defaultValue?: string | null;
  /** 选中值变化时调用 */
  onValueChange?: (value: string | null) => void;
  maxTagCount?: never;
}

export interface SpringSelectMultipleProps extends SpringSelectBaseProps {
  /** 开启多选模式，触发器以紧凑标签芯片展示已选项 */
  multiple: true;
  /** 受控选中值数组 */
  value?: string[];
  /** 非受控初始选中值数组 */
  defaultValue?: string[];
  /** 选中值数组变化时调用 */
  onValueChange?: (value: string[]) => void;
  /** 触发器内最多展示的芯片数量，超出折叠为 +N（默认 3） */
  maxTagCount?: number;
}

export type SpringSelectProps = SpringSelectSingleProps | SpringSelectMultipleProps;
const OptionDot = ({ dot }: { dot?: SpringSelectDot }) => {
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

interface SelectDropdownProps {
  options: SpringSelectOption[];
  radius: SpringSelectRadius;
  tone: SpringSelectTone;
  multiple: boolean;
  selectedCount: number;
  onClearAll?: () => void;
  popupHeader?: ReactNode;
  popupFooter?: ReactNode;
}

const SelectDropdown = ({
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
const useSingleValue = (props: SpringSelectSingleProps) => {
  const isControlled = props.value !== undefined;
  const [internal, setInternal] = useState<string | null>(props.defaultValue ?? null);
  const current = isControlled ? props.value : internal;

  const update = (next: string | null) => {
    if (!isControlled) setInternal(next);
    props.onValueChange?.(next);
  };

  return { current: current ?? null, update };
};

const useMultipleValue = (props: SpringSelectMultipleProps) => {
  const isControlled = props.value !== undefined;
  const [internal, setInternal] = useState<string[]>(props.defaultValue ?? []);
  const current = isControlled ? props.value : internal;

  const update = (next: string[]) => {
    if (!isControlled) setInternal(next);
    props.onValueChange?.(next);
  };

  return { current: current ?? [], update };
};

const PlaceholderView = ({ placeholder, prefix }: { placeholder: string; prefix?: ReactNode }) => (
  <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
    {prefix && (
      <span aria-hidden="true" className="inline-flex shrink-0 text-muted-foreground/80">
        {prefix}
      </span>
    )}
    <span className="truncate">{placeholder}</span>
  </span>
);

const SingleValueView = ({
  option,
  showDescription,
}: {
  option: SpringSelectOption;
  showDescription: boolean;
}) => (
  <span className="flex min-w-0 items-center gap-2">
    {option.icon ? (
      <span aria-hidden="true" className="inline-flex shrink-0 items-center text-muted-foreground">
        {option.icon}
      </span>
    ) : (
      <OptionDot dot={option.dot} />
    )}
    <span className="flex min-w-0 flex-col text-left">
      <span className="flex min-w-0 items-center gap-1.5">
        {option.icon && <OptionDot dot={option.dot} />}
        <span className="truncate font-medium text-foreground">{option.label}</span>
        {option.badge && (
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
            {option.badge}
          </span>
        )}
      </span>
      {showDescription && option.description && (
        <span className="truncate text-[11px] leading-tight text-muted-foreground">
          {option.description}
        </span>
      )}
    </span>
  </span>
);

const MultipleValueView = ({
  selected,
  optionMap,
  placeholder,
  prefix,
  maxTagCount,
}: {
  selected: string[];
  optionMap: Map<string, SpringSelectOption>;
  placeholder: string;
  prefix?: ReactNode;
  maxTagCount: number;
}) => {
  if (selected.length === 0) {
    return <PlaceholderView placeholder={placeholder} prefix={prefix} />;
  }
  const visible = selected.slice(0, maxTagCount);
  const overflow = selected.length - visible.length;

  return (
    <span className="flex min-w-0 flex-wrap items-center gap-1">
      {visible.map((item) => {
        const option = optionMap.get(item);
        return (
          <span
            key={item}
            className="inline-flex max-w-36 items-center gap-1 rounded-md border border-solid border-border/80 bg-secondary/75 px-1.5 py-0.5 text-xs leading-4 font-medium text-foreground dark:border-white/10 dark:bg-white/8"
          >
            {option?.dot && <OptionDot dot={option.dot} />}
            <span className="truncate">{option?.label ?? item}</span>
          </span>
        );
      })}
      {overflow > 0 && (
        <span className="inline-flex shrink-0 items-center rounded-md bg-secondary/75 px-1.5 py-0.5 font-mono text-[11px] leading-4 font-medium text-muted-foreground tabular-nums">
          +{overflow}
        </span>
      )}
    </span>
  );
};

const ClearButton = ({ onClear }: { onClear: () => void }) => (
  <button
    type="button"
    aria-label="清空选择"
    onClick={onClear}
    className="absolute top-1/2 right-8 inline-flex size-4.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-solid"
  >
    <X aria-hidden="true" className="size-3" />
  </button>
);

const FieldFeedback = ({ hint, error }: { hint?: string; error?: string }) => {
  if (error) {
    return (
      <p role="alert" className="m-0 text-xs text-destructive">
        {error}
      </p>
    );
  }
  if (hint) {
    return <p className="m-0 text-xs text-muted-foreground">{hint}</p>;
  }
  return null;
};

interface TriggerShellProps {
  triggerClassName: string;
  ariaLabel?: string;
  invalid: boolean;
  showClear: boolean;
  onClear: () => void;
  valueNode: ReactNode;
}

const SelectTriggerShell = (props: TriggerShellProps) => (
  <div className="relative flex w-full items-center">
    <Select.Trigger
      aria-label={props.ariaLabel}
      aria-invalid={props.invalid ? true : undefined}
      className={cn(props.triggerClassName, props.showClear && "pr-14")}
    >
      <Select.Value className="min-w-0 flex-1">{props.valueNode}</Select.Value>
      <Select.Icon className="inline-flex shrink-0 text-muted-foreground/80">
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 transition-transform duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-popup-open:rotate-180"
        />
      </Select.Icon>
    </Select.Trigger>
    {props.showClear && <ClearButton onClear={props.onClear} />}
  </div>
);

const normalizeConfig = (props: SpringSelectProps) => ({
  placeholder: props.placeholder ?? "请选择…",
  variant: props.variant ?? "default",
  size: props.size ?? "md",
  radius: props.radius ?? "md",
  tone: props.tone ?? "default",
  showDescription: props.showSelectedDescription ?? false,
  clearable: props.clearable ?? false,
  invalid: Boolean(props.error),
});

const SingleSpringSelect = (props: SpringSelectSingleProps) => {
  const config = normalizeConfig(props);
  const { current, update } = useSingleValue(props);
  const optionMap = new Map(props.options.map((option) => [option.value, option]));
  const items = props.options.map(({ value, label }) => ({ value, label }));
  const selectedOption = current ? optionMap.get(current) : undefined;

  return (
    <Select.Root
      items={items}
      value={current}
      name={props.name}
      required={props.required}
      disabled={props.disabled}
      onValueChange={(next) => update(next === null ? null : String(next))}
    >
      {props.label && (
        <Select.Label className="text-[13px] font-medium tracking-tight text-foreground">
          {props.label}
        </Select.Label>
      )}
      <SelectTriggerShell
        triggerClassName={selectTriggerVariants(config)}
        ariaLabel={props.label ? undefined : props["aria-label"]}
        invalid={config.invalid}
        showClear={Boolean(config.clearable && !props.disabled && current != null)}
        onClear={() => update(null)}
        valueNode={
          selectedOption ? (
            <SingleValueView option={selectedOption} showDescription={config.showDescription} />
          ) : (
            <PlaceholderView placeholder={config.placeholder} prefix={props.prefix} />
          )
        }
      />
      <SelectDropdown
        options={props.options}
        radius={config.radius}
        tone={config.tone}
        multiple={false}
        selectedCount={current ? 1 : 0}
        popupHeader={props.popupHeader}
        popupFooter={props.popupFooter}
      />
    </Select.Root>
  );
};

const MultipleSpringSelect = (props: SpringSelectMultipleProps) => {
  const config = normalizeConfig(props);
  const { current, update } = useMultipleValue(props);
  const optionMap = new Map(props.options.map((option) => [option.value, option]));
  const items = props.options.map(({ value, label }) => ({ value, label }));

  return (
    <Select.Root
      multiple
      items={items}
      value={current}
      name={props.name}
      required={props.required}
      disabled={props.disabled}
      onValueChange={(next) => update(next.map(String))}
    >
      {props.label && (
        <Select.Label className="text-[13px] font-medium tracking-tight text-foreground">
          {props.label}
        </Select.Label>
      )}
      <SelectTriggerShell
        triggerClassName={selectTriggerVariants(config)}
        ariaLabel={props.label ? undefined : props["aria-label"]}
        invalid={config.invalid}
        showClear={Boolean(config.clearable && !props.disabled && current.length > 0)}
        onClear={() => update([])}
        valueNode={
          <MultipleValueView
            selected={current}
            optionMap={optionMap}
            placeholder={config.placeholder}
            prefix={props.prefix}
            maxTagCount={props.maxTagCount ?? 3}
          />
        }
      />
      <SelectDropdown
        options={props.options}
        radius={config.radius}
        tone={config.tone}
        multiple
        selectedCount={current.length}
        onClearAll={() => update([])}
        popupHeader={props.popupHeader}
        popupFooter={props.popupFooter}
      />
    </Select.Root>
  );
};

export const SpringSelect = (props: SpringSelectProps) => (
  <div
    data-slot="spring-select"
    className={cn("flex w-full max-w-xs flex-col gap-1.5 font-sans", props.className)}
  >
    {props.multiple ? <MultipleSpringSelect {...props} /> : <SingleSpringSelect {...props} />}
    <FieldFeedback hint={props.hint} error={props.error} />
  </div>
);
