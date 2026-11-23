// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Accordion：基于 Base UI Accordion 的精密折叠面板，支持 default / card / separated 变体与 chevron / plus 指示器。
 */

import { cn } from "@/lib/utils";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { type ReactNode } from "react";

export const accordionRootVariants = cva("flex w-full flex-col", {
  variants: {
    variant: {
      default:
        "divide-y divide-border/80 border-y border-solid border-border/80 dark:divide-white/10 dark:border-white/12",
      card: "divide-y divide-border/80 overflow-hidden rounded-2xl border border-solid border-border/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:divide-white/10 dark:border-white/12",
      separated: "gap-2.5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionItemVariants = cva("transition-colors duration-(--ui-duration-fast)", {
  variants: {
    variant: {
      default: "",
      card: "data-open:bg-secondary/25 dark:data-open:bg-white/[0.02]",
      separated:
        "overflow-hidden rounded-xl border border-solid border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-foreground/20 data-open:border-foreground/25 dark:border-white/12 dark:hover:border-white/20 dark:data-open:border-white/25",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionTriggerVariants = cva(
  "group flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent text-left font-sans text-sm font-medium text-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:text-foreground/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "px-1 py-3.5",
        card: "px-5 py-3.5 hover:bg-secondary/35 dark:hover:bg-white/[0.03]",
        separated: "px-4 py-3.5 hover:bg-secondary/35 dark:hover:bg-white/[0.03]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const accordionBodyVariants = cva("text-xs leading-relaxed text-muted-foreground", {
  variants: {
    variant: {
      default: "px-1 pb-4",
      card: "px-5 pb-4",
      separated: "px-4 pb-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
export type AccordionVariant = "default" | "card" | "separated" | "divided" | "boxed";

export type AccordionIndicator = "chevron" | "plus";

export interface AccordionItem {
  value: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
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
  /** 外观变体：发丝分隔 / 盒装卡片 / 独立分卡（divided / boxed 为兼容别名） */
  variant?: AccordionVariant;
  /** 展开指示图标形态：箭头或加减号 */
  indicator?: AccordionIndicator;
  /** 自定义容器类名 */
  className?: string;
}
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
