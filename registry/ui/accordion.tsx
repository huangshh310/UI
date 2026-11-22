// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import { type ReactNode } from "react";

export type AccordionVariant = "divided" | "boxed";

export interface AccordionItem {
  value: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  /** 折叠面板条目 */
  items: AccordionItem[];
  /** 是否允许同时展开多项 */
  multiple?: boolean;
  /** 受控展开项值数组 */
  value?: string[];
  /** 初始展开项值数组 */
  defaultValue?: string[];
  /** 展开项变化回调 */
  onValueChange?: (value: string[]) => void;
  /** 外观变体：发丝分隔或卡片盒装 */
  variant?: AccordionVariant;
  /** 自定义容器类名 */
  className?: string;
}
const AccordionRow = ({ item, variant }: { item: AccordionItem; variant: AccordionVariant }) => (
  <BaseAccordion.Item value={item.value} disabled={item.disabled}>
    <BaseAccordion.Header render={<div />} className="m-0">
      <BaseAccordion.Trigger
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent text-left font-sans text-sm font-medium text-foreground outline-none",
          "transition-colors duration-(--ui-duration-fast) hover:text-foreground/85 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45",
          variant === "boxed" ? "px-5 py-3.5" : "px-1 py-3.5",
        )}
      >
        <span className="flex min-w-0 flex-col gap-0.5">
          <span>{item.title}</span>
          {item.subtitle && (
            <span className="text-xs font-normal text-muted-foreground">{item.subtitle}</span>
          )}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-data-panel-open:rotate-180 motion-reduce:transition-none"
        />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
    <BaseAccordion.Panel
      role="presentation"
      className="h-(--accordion-panel-height) overflow-hidden text-xs leading-relaxed text-muted-foreground transition-[height,opacity] duration-(--ui-duration-normal) ease-(--ui-ease-out) data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none"
    >
      <div className={cn(variant === "boxed" ? "px-5 pb-4" : "px-1 pb-4")}>{item.content}</div>
    </BaseAccordion.Panel>
  </BaseAccordion.Item>
);

export const Accordion = ({
  items,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  variant = "divided",
  className,
}: AccordionProps) => (
  <BaseAccordion.Root
    multiple={multiple}
    value={value}
    defaultValue={defaultValue}
    onValueChange={(next) => onValueChange?.(next.map(String))}
    data-slot="accordion"
    data-variant={variant}
    className={cn(
      "flex w-full flex-col divide-y divide-border/80",
      variant === "boxed"
        ? "overflow-hidden rounded-2xl border border-solid border-border bg-card shadow-sm"
        : "border-y border-solid border-border/80",
      className,
    )}
  >
    {items.map((item) => (
      <AccordionRow key={item.value} item={item} variant={variant} />
    ))}
  </BaseAccordion.Root>
);
