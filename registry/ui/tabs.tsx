// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Tabs：平滑滑动指示器页签，支持 pill / line / card / enclosed 四种风格与 sm / md / lg 尺寸。
 */

import { cn } from "@/lib/utils";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cva } from "class-variance-authority";
import { type ReactNode } from "react";

export const tabsListVariants = cva("relative items-center select-none", {
  variants: {
    variant: {
      pill: "inline-flex gap-0.5 rounded-full border border-solid border-border/75 bg-secondary/80 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/12 dark:bg-white/[0.06]",
      line: "flex gap-5 border-b border-solid border-border/80 dark:border-white/12",
      card: "inline-flex gap-1 rounded-xl border border-solid border-border/80 bg-card p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/12",
      enclosed:
        "inline-flex gap-1 rounded-xl border border-solid border-border/80 bg-secondary/60 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/12 dark:bg-white/[0.05]",
    },
    fullWidth: {
      true: "flex w-full",
      false: "",
    },
  },
  defaultVariants: {
    variant: "pill",
    fullWidth: false,
  },
});

export const tabsTriggerVariants = cva(
  "group relative z-10 inline-flex cursor-pointer items-center justify-center gap-1.5 font-sans font-medium whitespace-nowrap text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        pill: "rounded-full data-active:text-foreground",
        line: "rounded-t-md data-active:text-foreground",
        card: "rounded-lg data-active:text-primary-foreground",
        enclosed: "rounded-lg data-active:text-foreground",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3.5 text-xs",
        lg: "h-9.5 px-4 text-sm",
      },
      fullWidth: {
        true: "flex-1",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "line", size: "sm", class: "h-8 px-1 pb-2 text-xs" },
      { variant: "line", size: "md", class: "h-9 px-1 pb-2.5 text-sm" },
      { variant: "line", size: "lg", class: "h-10.5 px-1.5 pb-3 text-sm" },
    ],
    defaultVariants: {
      variant: "pill",
      size: "md",
      fullWidth: false,
    },
  },
);

export const tabsIndicatorVariants = cva(
  "pointer-events-none absolute left-0 z-0 w-(--active-tab-width) translate-x-(--active-tab-left) transition-[transform,width] duration-(--ui-duration-fast) ease-(--ui-ease-out) motion-reduce:transition-none",
  {
    variants: {
      variant: {
        pill: "top-1 h-[calc(100%-0.5rem)] rounded-full bg-card shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0.5px_1px_rgba(0,0,0,0.04)] ring-1 ring-border/75 dark:bg-card dark:ring-white/12",
        line: "-bottom-px h-0.5 rounded-full bg-foreground",
        card: "top-1 h-[calc(100%-0.5rem)] rounded-lg bg-primary shadow-[0_1px_3px_rgba(0,0,0,0.12)]",
        enclosed:
          "top-1 h-[calc(100%-0.5rem)] rounded-lg bg-background shadow-[0_1px_3px_rgba(0,0,0,0.07),0_0.5px_1px_rgba(0,0,0,0.04)] ring-1 ring-border/75 dark:bg-card dark:ring-white/12",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  },
);

export const tabsBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none tabular-nums transition-colors duration-(--ui-duration-fast)",
  {
    variants: {
      variant: {
        pill: "bg-secondary text-muted-foreground group-data-active:bg-secondary/90 group-data-active:text-foreground",
        line: "bg-secondary text-muted-foreground group-data-active:bg-foreground/10 group-data-active:text-foreground",
        card: "bg-secondary text-muted-foreground group-data-active:bg-primary-foreground/18 group-data-active:text-primary-foreground",
        enclosed:
          "bg-background/80 text-muted-foreground group-data-active:bg-secondary group-data-active:text-foreground dark:bg-white/8",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  },
);
export type TabsVariant = "pill" | "line" | "underline" | "card" | "enclosed";

export type TabsSize = "sm" | "md" | "lg";

export interface TabsItem {
  value: string;
  label: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps {
  /** 页签项数组 */
  items: TabsItem[];
  /** 受控当前值 */
  value?: string;
  /** 非受控默认值 */
  defaultValue?: string;
  /** 页签切换回调 */
  onValueChange?: (value: string) => void;
  /** 视觉变体：胶囊分段 / 极简底线 / 卡片 / 围合面板（underline 为 line 兼容别名） */
  variant?: TabsVariant;
  /** 尺寸规格 */
  size?: TabsSize;
  /** 是否撑满容器等宽分布 */
  fullWidth?: boolean;
  /** 页签列表容器附加类名 */
  listClassName?: string;
  /** 面板区域附加类名 */
  panelClassName?: string;
  /** 自定义容器类名 */
  className?: string;
}
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
