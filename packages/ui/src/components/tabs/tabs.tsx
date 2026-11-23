"use client";

/**
 * Tabs：基于 Base UI Tabs 的平滑滑动指示器页签，支持 pill / line / card / enclosed 四种风格与 sm / md / lg 尺寸。
 */
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "@matt-ui/utils";
import type { TabsItem, TabsProps, TabsSize, TabsVariant } from "./tabs.types.js";
import {
  tabsBadgeVariants,
  tabsIndicatorVariants,
  tabsListVariants,
  tabsTriggerVariants,
} from "./tabs.variants.js";

type VisualTabsVariant = "pill" | "line" | "card" | "enclosed";

const resolveVariant = (variant: TabsVariant): VisualTabsVariant =>
  variant === "underline" ? "line" : variant;

const TabTrigger = ({
  item,
  variant,
  size,
  fullWidth,
}: {
  item: TabsItem;
  variant: VisualTabsVariant;
  size: TabsSize;
  fullWidth: boolean;
}) => (
  <BaseTabs.Tab
    value={item.value}
    disabled={item.disabled}
    data-slot="tabs-trigger"
    className={tabsTriggerVariants({ variant, size, fullWidth })}
  >
    {item.icon && (
      <span aria-hidden="true" className="inline-flex shrink-0 items-center">
        {item.icon}
      </span>
    )}
    <span>{item.label}</span>
    {item.badge && <span className={tabsBadgeVariants({ variant })}>{item.badge}</span>}
  </BaseTabs.Tab>
);

const TabPanels = ({ items, panelClassName }: { items: TabsItem[]; panelClassName?: string }) => (
  <>
    {items.map((item) => (
      <BaseTabs.Panel
        key={item.value}
        value={item.value}
        data-slot="tabs-panel"
        className={cn(
          "text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
          panelClassName,
        )}
      >
        {item.content}
      </BaseTabs.Panel>
    ))}
  </>
);

export const Tabs = (props: TabsProps) => {
  const { items, variant = "pill", size = "md", fullWidth = false } = props;
  const visualVariant = resolveVariant(variant);
  return (
    <BaseTabs.Root
      value={props.value}
      defaultValue={props.defaultValue ?? items[0]?.value}
      onValueChange={(next) => props.onValueChange?.(String(next))}
      data-slot="tabs"
      data-variant={variant}
      data-size={size}
      className={cn("flex w-full flex-col gap-3.5", props.className)}
    >
      <BaseTabs.List
        data-slot="tabs-list"
        className={cn(tabsListVariants({ variant: visualVariant, fullWidth }), props.listClassName)}
      >
        {items.map((item) => (
          <TabTrigger
            key={item.value}
            item={item}
            variant={visualVariant}
            size={size}
            fullWidth={fullWidth}
          />
        ))}
        <BaseTabs.Indicator
          data-slot="tabs-indicator"
          className={tabsIndicatorVariants({ variant: visualVariant })}
        />
      </BaseTabs.List>
      <TabPanels items={items} panelClassName={props.panelClassName} />
    </BaseTabs.Root>
  );
};
