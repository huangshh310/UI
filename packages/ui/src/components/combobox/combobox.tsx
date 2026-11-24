"use client";

/**
 * Combobox：支持关键词过滤、命中高亮、清空、异步加载与多选可移除芯片的组合选择器。
 * 内置实时过滤、方向键高亮、多重选择芯片与完整的无障碍组合框语义。
 */
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { cn } from "@matt-ui/utils";
import { ChevronDown, Search, X } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { ComboboxDotIndicator, ComboboxPopup } from "./combobox-popup.js";
import type {
  ComboboxMultipleProps,
  ComboboxOption,
  ComboboxProps,
  ComboboxSingleProps,
} from "./combobox.types.js";
import { comboboxGroupVariants } from "./combobox.variants.js";

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
