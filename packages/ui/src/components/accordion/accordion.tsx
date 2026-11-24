"use client";

/**
 * Accordion：精密无障碍折叠面板，支持 default / card / separated 变体与 chevron / plus 指示器。
 */
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "@matt-ui/utils";
import { ChevronDown } from "lucide-react";
import type {
  AccordionIndicator,
  AccordionItem,
  AccordionProps,
  AccordionVariant,
} from "./accordion.types.js";
import {
  accordionBodyVariants,
  accordionItemVariants,
  accordionRootVariants,
  accordionTriggerVariants,
} from "./accordion.variants.js";

type ResolvedAccordionVariant = "default" | "card" | "separated";

const resolveVariant = (variant: AccordionVariant): ResolvedAccordionVariant => {
  if (variant === "divided") return "default";
  if (variant === "boxed") return "card";
  return variant;
};

const AccordionIcon = ({ indicator }: { indicator: AccordionIndicator }) => {
  if (indicator === "plus") {
    return (
      <span
        aria-hidden="true"
        className="relative flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--ui-duration-fast) group-hover:text-foreground"
      >
        <span className="h-[1.5px] w-3 rounded-full bg-current" />
        <span className="absolute h-3 w-[1.5px] rounded-full bg-current transition-[transform,opacity] duration-(--ui-duration-fast) group-data-panel-open:scale-y-0 group-data-panel-open:opacity-0 motion-reduce:transition-none" />
      </span>
    );
  }
  return (
    <ChevronDown
      aria-hidden="true"
      className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:text-foreground group-data-panel-open:rotate-180 motion-reduce:transition-none"
    />
  );
};

const AccordionTriggerLabel = ({ item }: { item: AccordionItem }) => (
  <span className="flex min-w-0 items-center gap-3">
    {item.icon && (
      <span
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-solid border-border/75 bg-secondary/60 text-foreground dark:border-white/12 dark:bg-white/[0.06]"
      >
        {item.icon}
      </span>
    )}
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="flex items-center gap-2">
        <span className="truncate">{item.title}</span>
        {item.badge && (
          <span className="rounded-full bg-secondary px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
            {item.badge}
          </span>
        )}
      </span>
      {item.subtitle && (
        <span className="text-xs font-normal text-muted-foreground">{item.subtitle}</span>
      )}
    </span>
  </span>
);

const AccordionRow = ({
  item,
  variant,
  indicator,
}: {
  item: AccordionItem;
  variant: ResolvedAccordionVariant;
  indicator: AccordionIndicator;
}) => (
  <BaseAccordion.Item
    value={item.value}
    disabled={item.disabled}
    data-slot="accordion-item"
    className={accordionItemVariants({ variant })}
  >
    <BaseAccordion.Header render={<div />} className="m-0">
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={accordionTriggerVariants({ variant })}
      >
        <AccordionTriggerLabel item={item} />
        <AccordionIcon indicator={indicator} />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
    <BaseAccordion.Panel
      role="presentation"
      data-slot="accordion-panel"
      className="h-(--accordion-panel-height) overflow-hidden transition-[height,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out) data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none"
    >
      <div className={accordionBodyVariants({ variant })}>{item.content}</div>
    </BaseAccordion.Panel>
  </BaseAccordion.Item>
);

export const Accordion = ({
  items,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  variant = "default",
  indicator = "chevron",
  className,
}: AccordionProps) => {
  const visualVariant = resolveVariant(variant);
  return (
    <BaseAccordion.Root
      multiple={multiple}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next.map(String))}
      data-slot="accordion"
      data-variant={variant}
      data-indicator={indicator}
      className={cn(accordionRootVariants({ variant: visualVariant }), className)}
    >
      {items.map((item) => (
        <AccordionRow key={item.value} item={item} variant={visualVariant} indicator={indicator} />
      ))}
    </BaseAccordion.Root>
  );
};
