"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "@matt-ui/utils";
import type { TabsProps, TabsVariant } from "./tabs.types.js";

const LIST_CLASS: Record<TabsVariant, string> = {
  pill: "relative inline-flex items-center gap-0.5 rounded-full bg-secondary p-1",
  underline: "relative flex items-center gap-6 border-b border-solid border-border",
  card: "relative inline-flex items-center gap-1 rounded-2xl border border-solid border-border bg-card p-1 shadow-xs",
};

const TAB_CLASS: Record<TabsVariant, string> = {
  pill: "relative z-10 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3.5 font-sans text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:text-foreground data-active:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45",
  underline:
    "relative z-10 inline-flex cursor-pointer items-center gap-1.5 pb-2.5 font-sans text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:text-foreground data-active:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45",
  card: "relative z-10 inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-xl px-3.5 font-sans text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:text-foreground data-active:text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45",
};

const INDICATOR_CLASS: Record<TabsVariant, string> = {
  pill: "absolute top-1 left-0 z-0 h-[calc(100%-0.5rem)] w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-card shadow-sm transition-[transform,width] duration-(--ui-duration-fast) ease-(--ui-ease-out) motion-reduce:transition-none dark:ring-1 dark:ring-border",
  underline:
    "absolute bottom-0 left-0 z-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-foreground transition-[transform,width] duration-(--ui-duration-fast) ease-(--ui-ease-out) motion-reduce:transition-none",
  card: "absolute top-1 left-0 z-0 h-[calc(100%-0.5rem)] w-(--active-tab-width) translate-x-(--active-tab-left) rounded-xl bg-primary shadow-xs transition-[transform,width] duration-(--ui-duration-fast) ease-(--ui-ease-out) motion-reduce:transition-none",
};

export const Tabs = ({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "pill",
  className,
}: TabsProps) => (
  <BaseTabs.Root
    value={value}
    defaultValue={defaultValue ?? items[0]?.value}
    onValueChange={(next) => onValueChange?.(String(next))}
    data-slot="tabs"
    data-variant={variant}
    className={cn("flex w-full flex-col gap-3", className)}
  >
    <BaseTabs.List className={LIST_CLASS[variant]}>
      {items.map((item) => (
        <BaseTabs.Tab
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={TAB_CLASS[variant]}
        >
          {item.icon && <span aria-hidden="true">{item.icon}</span>}
          <span>{item.label}</span>
          {item.badge && (
            <span className="rounded-full bg-secondary px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground tabular-nums">
              {item.badge}
            </span>
          )}
        </BaseTabs.Tab>
      ))}
      <BaseTabs.Indicator className={INDICATOR_CLASS[variant]} />
    </BaseTabs.List>
    {items.map((item) => (
      <BaseTabs.Panel
        key={item.value}
        value={item.value}
        className="text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {item.content}
      </BaseTabs.Panel>
    ))}
  </BaseTabs.Root>
);
