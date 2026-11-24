"use client";

/**
 * SpringSelect：展开与收起带轻微回弹过冲的下选菜单，支持单选与多选芯片模式。
 * 内置完整的方向键导航、首字母快速检索、滚动锁定与关闭后焦点恢复。
 */
import { Select } from "@base-ui/react/select";
import { cn } from "@matt-ui/utils";
import { ChevronDown, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { OptionDot, SelectDropdown } from "./spring-select-dropdown.js";
import type {
  SpringSelectMultipleProps,
  SpringSelectOption,
  SpringSelectProps,
  SpringSelectSingleProps,
} from "./spring-select.types.js";
import { selectTriggerVariants } from "./spring-select.variants.js";

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
