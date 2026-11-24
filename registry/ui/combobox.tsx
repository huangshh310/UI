// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Combobox：支持关键词过滤、命中高亮、清空、异步加载与多选可移除芯片的组合选择器。
 * 内置实时过滤、方向键高亮、多重选择芯片与完整的无障碍组合框语义。
 */

import { cn } from "@/lib/utils";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, LoaderCircle, Search, X } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

export const comboboxGroupVariants = cva(
  "group relative flex w-full items-center gap-1.5 border border-solid font-sans transition-[border-color,box-shadow,background-color] duration-(--ui-duration-fast) focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset data-disabled:pointer-events-none data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input/50 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/25 hover:bg-card dark:border-white/12 dark:bg-card/85 dark:hover:border-white/22 dark:hover:bg-card",
        filled:
          "border-transparent bg-secondary/75 hover:bg-secondary focus-within:bg-card dark:bg-white/7 dark:hover:bg-white/11",
        elevated:
          "border-border/85 bg-card shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:border-foreground/20 dark:border-white/12 dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.5)]",
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
        true: "border-destructive hover:border-destructive focus-within:border-destructive focus-within:ring-destructive dark:border-destructive dark:hover:border-destructive",
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

export const comboboxPopupVariants = cva(
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

export const comboboxItemVariants = cva(
  "group/item flex cursor-pointer items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 font-sans text-sm text-foreground outline-none select-none transition-colors duration-(--ui-duration-instant) data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-45",
);

export const comboboxDotVariants = cva("size-1.5 shrink-0 rounded-full", {
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
export type ComboboxVariant = NonNullable<VariantProps<typeof comboboxGroupVariants>["variant"]>;
export type ComboboxSize = NonNullable<VariantProps<typeof comboboxGroupVariants>["size"]>;
export type ComboboxRadius = NonNullable<VariantProps<typeof comboboxGroupVariants>["radius"]>;
export type ComboboxDot = NonNullable<VariantProps<typeof comboboxDotVariants>["dot"]>;

export interface ComboboxOption {
  value: string;
  label: string;
  /** 选项的补充说明 */
  description?: string;
  /** 选项左侧图标或头像微件 */
  icon?: ReactNode;
  /** 选项右侧紧凑附加文本（例如版本号或角色） */
  badge?: string;
  /** 选项左侧状态圆点颜色 */
  dot?: ComboboxDot;
  disabled?: boolean;
}

interface ComboboxBaseProps {
  /** 候选项列表 */
  options: ComboboxOption[];
  /** 标签文本，自动关联到搜索输入框 */
  label?: string;
  /** 输入框占位文本 */
  placeholder?: string;
  /** 无匹配结果时的提示文案，默认「没有匹配项」 */
  emptyText?: string;
  /** 视觉风格：标准描边、柔灰填充或轻浮雕 */
  variant?: ComboboxVariant;
  /** 触发器高度尺寸 */
  size?: ComboboxSize;
  /** 圆角风格 */
  radius?: ComboboxRadius;
  /** 输入框前置装饰图标（不传时可通过 showSearchIcon 显示默认搜索图标） */
  prefix?: ReactNode;
  /** 是否显示前置搜索图标，默认否 */
  showSearchIcon?: boolean;
  /** 搜索关键词变化时调用（可用于异步远程检索） */
  onInputValueChange?: (query: string) => void;
  /** 是否处于远程检索中 */
  loading?: boolean;
  /** 是否允许点击清除按钮清空选中值，默认是 */
  clearable?: boolean;
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

export interface ComboboxSingleProps extends ComboboxBaseProps {
  /** 单选模式（默认） */
  multiple?: false;
  /** 受控选中值；null 表示未选 */
  value?: string | null;
  /** 非受控初始选中值 */
  defaultValue?: string | null;
  /** 选中值变化时调用 */
  onValueChange?: (value: string | null) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  /** 开启多选可移除芯片模式 */
  multiple: true;
  /** 受控选中值数组 */
  value?: string[];
  /** 非受控初始选中值数组 */
  defaultValue?: string[];
  /** 选中值数组变化时调用 */
  onValueChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;
const ComboboxDotIndicator = ({ dot }: { dot?: ComboboxDot }) => {
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
      <mark className="rounded bg-signal/15 px-0.5 font-medium text-foreground dark:bg-signal/25 dark:text-[#b4c8ff]">
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
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-solid border-input/70 bg-transparent transition-colors duration-(--ui-duration-instant) group-data-selected/item:border-signal group-data-selected/item:bg-signal group-data-selected/item:text-signal-foreground"
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
        <BaseCombobox.ItemIndicator className="inline-flex shrink-0 text-signal dark:text-[#93b4ff]">
          <Check aria-hidden="true" className="size-3.5 stroke-[2.25]" />
        </BaseCombobox.ItemIndicator>
      )}
    </span>
  </BaseCombobox.Item>
);

interface ComboboxPopupProps {
  query: string;
  emptyText: string;
  loading: boolean;
  radius: ComboboxRadius;
  multiple: boolean;
  anchorEl?: HTMLDivElement | null;
}

const ComboboxPopup = ({
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
const ACTION_BTN_CLASSES =
  "inline-flex size-5.5 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring";

const findOption = (options: ComboboxOption[], val: string | null | undefined) =>
  val ? (options.find((item) => item.value === val) ?? null) : null;

const findOptions = (options: ComboboxOption[], vals: string[] | undefined) =>
  vals
    ? vals
        .map((val) => options.find((item) => item.value === val))
        .filter((item): item is ComboboxOption => Boolean(item))
    : undefined;

const ComboboxLabel = ({ htmlFor, label }: { htmlFor: string; label?: string }) =>
  label ? (
    <label htmlFor={htmlFor} className="text-[13px] font-medium tracking-tight text-foreground">
      {label}
    </label>
  ) : null;

const ComboboxFeedback = ({ hint, error }: { hint?: string; error?: string }) => {
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

const LeadingIcon = ({
  prefix,
  showSearchIcon,
}: {
  prefix?: ReactNode;
  showSearchIcon: boolean;
}) => {
  if (prefix) {
    return (
      <span aria-hidden="true" className="inline-flex shrink-0 text-muted-foreground/80">
        {prefix}
      </span>
    );
  }
  if (showSearchIcon) {
    return <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground/80" />;
  }
  return null;
};

const normalizeConfig = (props: ComboboxProps) => ({
  placeholder: props.placeholder ?? "输入关键词搜索…",
  emptyText: props.emptyText ?? "没有匹配项",
  variant: props.variant ?? "default",
  size: props.size ?? "md",
  radius: props.radius ?? "md",
  showSearchIcon: props.showSearchIcon ?? false,
  loading: props.loading ?? false,
  clearable: props.clearable ?? true,
  invalid: Boolean(props.error),
});

const SingleControl = ({
  id,
  ariaLabel,
  placeholder,
  groupClassName,
  prefix,
  showSearchIcon,
  clearable,
  invalid,
}: {
  id: string;
  ariaLabel?: string;
  placeholder: string;
  groupClassName: string;
  prefix?: ReactNode;
  showSearchIcon: boolean;
  clearable: boolean;
  invalid: boolean;
}) => (
  <BaseCombobox.InputGroup className={groupClassName}>
    <LeadingIcon prefix={prefix} showSearchIcon={showSearchIcon} />
    <BaseCombobox.Input
      id={id}
      aria-label={ariaLabel}
      aria-invalid={invalid ? true : undefined}
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
        className="size-3.5 transition-transform duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-popup-open:rotate-180"
      />
    </BaseCombobox.Trigger>
  </BaseCombobox.InputGroup>
);

const SelectedChip = ({ item }: { item: ComboboxOption }) => (
  <BaseCombobox.Chip className="inline-flex max-w-40 items-center gap-1 rounded-md border border-solid border-border/80 bg-secondary/75 py-0.5 pr-1 pl-1.5 text-xs leading-4 font-medium text-foreground dark:border-white/10 dark:bg-white/8">
    <ComboboxDotIndicator dot={item.dot} />
    <span className="truncate">{item.label}</span>
    <BaseCombobox.ChipRemove
      aria-label={`移除 ${item.label}`}
      className="inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <X aria-hidden="true" className="size-2.5" />
    </BaseCombobox.ChipRemove>
  </BaseCombobox.Chip>
);

interface MultiChipsControlProps {
  id: string;
  ariaLabel?: string;
  placeholder: string;
  groupClassName: string;
  prefix?: ReactNode;
  showSearchIcon: boolean;
  clearable: boolean;
  invalid: boolean;
  onAnchorMount: (el: HTMLDivElement | null) => void;
}

const MultiChipsControl = ({
  id,
  ariaLabel,
  placeholder,
  groupClassName,
  prefix,
  showSearchIcon,
  clearable,
  invalid,
  onAnchorMount,
}: MultiChipsControlProps) => (
  <BaseCombobox.Chips ref={onAnchorMount} className={cn(groupClassName, "flex-wrap")}>
    <LeadingIcon prefix={prefix} showSearchIcon={showSearchIcon} />
    <BaseCombobox.Value>
      {(selected: ComboboxOption[]) => (
        <>
          {selected.map((item) => (
            <SelectedChip key={item.value} item={item} />
          ))}
          <BaseCombobox.Input
            id={id}
            aria-label={ariaLabel}
            aria-invalid={invalid ? true : undefined}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="min-w-20 flex-1 appearance-none border-0 bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </>
      )}
    </BaseCombobox.Value>
    {clearable && (
      <BaseCombobox.Clear aria-label="清除选项" className={ACTION_BTN_CLASSES}>
        <X aria-hidden="true" className="size-3.5" />
      </BaseCombobox.Clear>
    )}
    <BaseCombobox.Trigger aria-label="展开选项" className={ACTION_BTN_CLASSES}>
      <ChevronDown
        aria-hidden="true"
        className="size-3.5 transition-transform duration-(--ui-duration-normal) ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-popup-open:rotate-180"
      />
    </BaseCombobox.Trigger>
  </BaseCombobox.Chips>
);

const SingleComboboxRoot = (props: ComboboxSingleProps) => {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const config = normalizeConfig(props);
  const controlled =
    props.value !== undefined ? { value: findOption(props.options, props.value) } : {};

  return (
    <BaseCombobox.Root
      items={props.options}
      {...controlled}
      defaultValue={findOption(props.options, props.defaultValue)}
      name={props.name}
      disabled={props.disabled}
      required={props.required}
      isItemEqualToValue={(a, b) => a?.value === b?.value}
      onValueChange={(next) => props.onValueChange?.(next?.value ?? null)}
      onInputValueChange={(next) => {
        setQuery(next);
        props.onInputValueChange?.(next);
      }}
    >
      <ComboboxLabel htmlFor={inputId} label={props.label} />
      <SingleControl
        id={inputId}
        ariaLabel={props.label ? undefined : props["aria-label"]}
        placeholder={config.placeholder}
        groupClassName={comboboxGroupVariants(config)}
        prefix={props.prefix}
        showSearchIcon={config.showSearchIcon}
        clearable={config.clearable}
        invalid={config.invalid}
      />
      <ComboboxPopup
        query={query}
        emptyText={config.emptyText}
        loading={config.loading}
        radius={config.radius}
        multiple={false}
      />
    </BaseCombobox.Root>
  );
};

const MultipleComboboxRoot = (props: ComboboxMultipleProps) => {
  const inputId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const config = normalizeConfig(props);
  const controlled =
    props.value !== undefined ? { value: findOptions(props.options, props.value) ?? [] } : {};

  return (
    <BaseCombobox.Root
      multiple
      items={props.options}
      {...controlled}
      defaultValue={findOptions(props.options, props.defaultValue)}
      name={props.name}
      disabled={props.disabled}
      required={props.required}
      isItemEqualToValue={(a, b) => a?.value === b?.value}
      onValueChange={(next) => props.onValueChange?.(next.map((item) => item.value))}
      onInputValueChange={(next) => {
        setQuery(next);
        props.onInputValueChange?.(next);
      }}
    >
      <ComboboxLabel htmlFor={inputId} label={props.label} />
      <MultiChipsControl
        id={inputId}
        ariaLabel={props.label ? undefined : props["aria-label"]}
        placeholder={config.placeholder}
        groupClassName={comboboxGroupVariants(config)}
        prefix={props.prefix}
        showSearchIcon={config.showSearchIcon}
        clearable={config.clearable}
        invalid={config.invalid}
        onAnchorMount={setAnchorEl}
      />
      <ComboboxPopup
        query={query}
        emptyText={config.emptyText}
        loading={config.loading}
        radius={config.radius}
        multiple
        anchorEl={anchorEl}
      />
    </BaseCombobox.Root>
  );
};

export const Combobox = (props: ComboboxProps) => (
  <div
    data-slot="combobox"
    className={cn("flex w-full max-w-xs flex-col gap-1.5 font-sans", props.className)}
  >
    {props.multiple ? <MultipleComboboxRoot {...props} /> : <SingleComboboxRoot {...props} />}
    <ComboboxFeedback hint={props.hint} error={props.error} />
  </div>
);
