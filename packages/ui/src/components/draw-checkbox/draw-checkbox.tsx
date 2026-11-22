"use client";

/**
 * DrawCheckbox：勾选时对勾沿 SVG 路径平滑绘制出来的复选框。
 * 交互行为与 ARIA 语义由 Base UI 的 Checkbox 提供。
 */
import { Checkbox } from "@base-ui/react/checkbox";
import { cn } from "@matt-ui/utils";
import { useId, type ReactNode } from "react";
import type { DrawCheckboxProps } from "./draw-checkbox.types.js";

const BOX_BASE = cn(
  "group/cb relative mt-0.5 inline-flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-solid border-foreground/20 bg-background shadow-sm dark:bg-card",
  "transition-[transform,background-color,border-color,box-shadow] duration-(--ui-duration-fast) ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-foreground/35 active:scale-90",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
);

const TONE_CLASSES: Record<NonNullable<DrawCheckboxProps["tone"]>, string> = {
  primary:
    "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground",
  signal:
    "data-checked:border-signal data-checked:bg-signal data-checked:text-signal-foreground data-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] data-indeterminate:border-signal data-indeterminate:bg-signal data-indeterminate:text-signal-foreground",
};

const CheckGlyph = ({ indeterminate }: { indeterminate: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-3"
  >
    {indeterminate ? (
      <path d="M5 10H15" />
    ) : (
      <path
        d="M4.5 10.5L8.2 14.2L15.5 6.2"
        strokeDasharray={22}
        className="[stroke-dashoffset:22] transition-[stroke-dashoffset] duration-(--ui-duration-normal) ease-out group-data-checked/cb:[stroke-dashoffset:0]"
      />
    )}
  </svg>
);

const CheckboxLabel = ({
  htmlFor,
  label,
  description,
  disabled,
  className,
  children,
}: {
  htmlFor: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    data-disabled={disabled ? "" : undefined}
    className={cn(
      "inline-flex cursor-pointer items-start gap-3 font-sans select-none data-disabled:cursor-not-allowed data-disabled:opacity-60",
      className,
    )}
  >
    {children}
    <span className="flex flex-col gap-0.5">
      <span className="text-[13px] leading-snug font-medium text-foreground">{label}</span>
      {description && (
        <span className="text-xs leading-relaxed text-muted-foreground">{description}</span>
      )}
    </span>
  </label>
);

export const DrawCheckbox = ({
  id,
  label,
  description,
  tone = "primary",
  indeterminate = false,
  onCheckedChange,
  className,
  "aria-label": ariaLabel,
  ...rest
}: DrawCheckboxProps) => {
  const autoId = useId();
  const controlId = id ?? autoId;

  const control = (
    <Checkbox.Root
      id={controlId}
      indeterminate={indeterminate}
      aria-label={label ? undefined : ariaLabel}
      onCheckedChange={(next) => onCheckedChange?.(next)}
      data-slot="draw-checkbox"
      className={cn(BOX_BASE, TONE_CLASSES[tone], !label && className)}
      {...rest}
    >
      <Checkbox.Indicator keepMounted className="inline-flex items-center justify-center">
        <CheckGlyph indeterminate={indeterminate} />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );

  if (!label) return control;

  return (
    <CheckboxLabel
      htmlFor={controlId}
      label={label}
      description={description}
      disabled={rest.disabled}
      className={className}
    >
      {control}
    </CheckboxLabel>
  );
};
