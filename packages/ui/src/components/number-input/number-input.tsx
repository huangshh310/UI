"use client";

import { NumberField } from "@base-ui/react/number-field";
import { cn } from "@matt-ui/utils";
import { Minus, MoveHorizontal, Plus } from "lucide-react";
import { useId } from "react";
import type { NumberInputProps } from "./number-input.types.js";

const STEP_BTN = cn(
  "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-muted-foreground",
  "transition-colors duration-(--ui-duration-fast) hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

const NumberLabel = ({ id, label, scrub }: { id: string; label?: string; scrub: boolean }) => {
  if (!label) return null;
  if (!scrub) {
    return (
      <label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
      </label>
    );
  }
  return (
    <NumberField.ScrubArea className="inline-flex w-fit cursor-ew-resize items-center gap-1 select-none">
      <label htmlFor={id} className="cursor-ew-resize text-xs font-medium text-foreground">
        {label}
      </label>
      <MoveHorizontal aria-hidden="true" className="size-3 text-muted-foreground" />
      <NumberField.ScrubAreaCursor />
    </NumberField.ScrubArea>
  );
};

export const NumberInput = (props: NumberInputProps) => {
  const { defaultValue = 0, step = 1, scrub = true, disabled = false } = props;
  const inputId = useId();

  return (
    <NumberField.Root
      id={inputId}
      value={props.value}
      defaultValue={props.value === undefined ? defaultValue : undefined}
      onValueChange={(next) => props.onValueChange?.(next)}
      min={props.min}
      max={props.max}
      step={step}
      format={props.format}
      disabled={disabled}
      data-slot="number-input"
      className={cn("flex w-full max-w-48 flex-col gap-1.5", props.className)}
    >
      <NumberLabel id={inputId} label={props.label} scrub={scrub} />
      <NumberField.Group className="inline-flex h-10 w-full items-center overflow-hidden rounded-xl border border-solid border-border bg-background shadow-xs transition-[border-color,box-shadow] duration-(--ui-duration-fast) focus-within:border-ring focus-within:ring-1 focus-within:ring-ring focus-within:ring-inset dark:bg-card">
        <NumberField.Decrement
          aria-label="减少"
          className={cn(STEP_BTN, "border-r border-solid border-border/70")}
        >
          <Minus aria-hidden="true" className="size-3.5" />
        </NumberField.Decrement>
        <NumberField.Input className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-center font-mono text-sm font-medium text-foreground tabular-nums outline-none" />
        <NumberField.Increment
          aria-label="增加"
          className={cn(STEP_BTN, "border-l border-solid border-border/70")}
        >
          <Plus aria-hidden="true" className="size-3.5" />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
};
