// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * Breadcrumb：语义化面包屑导航，支持 chevron / slash / pill 三种变体、图标与深层自动折叠展开。
 */

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { type ReactNode, useState } from "react";

export const breadcrumbNavVariants = cva("font-sans", {
  variants: {
    variant: {
      chevron: "",
      slash: "",
      pill: "inline-flex max-w-full rounded-full border border-solid border-border/80 bg-card px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/12",
    },
    size: {
      sm: "text-xs",
      md: "text-[13px]",
    },
  },
  defaultVariants: {
    variant: "chevron",
    size: "md",
  },
});

export const breadcrumbLinkVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md text-muted-foreground no-underline transition-colors duration-(--ui-duration-fast) outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        chevron: "",
        slash: "",
        pill: "rounded-full px-1.5 py-0.5 hover:bg-secondary/80 dark:hover:bg-white/[0.06]",
      },
    },
    defaultVariants: {
      variant: "chevron",
    },
  },
);

export const breadcrumbCurrentVariants = cva(
  "inline-flex items-center gap-1.5 font-medium text-foreground",
  {
    variants: {
      variant: {
        chevron: "",
        slash: "",
        pill: "rounded-full bg-secondary/85 px-2 py-0.5 dark:bg-white/[0.08]",
      },
    },
    defaultVariants: {
      variant: "chevron",
    },
  },
);
export type BreadcrumbVariant = "chevron" | "slash" | "pill";

export type BreadcrumbSize = "sm" | "md";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  /** 路径节点列表，末项自动标记 aria-current="page" */
  items: BreadcrumbItem[];
  /** 视觉风格：箭头分隔 / 斜杠分隔 / 胶囊容器 */
  variant?: BreadcrumbVariant;
  /** 字号与间距规格 */
  size?: BreadcrumbSize;
  /** 自定义分隔符（覆盖变体默认分隔符） */
  separator?: ReactNode;
  /** 最多展示节点数，超出时折叠中间路径 */
  maxItems?: number;
  /** 导航无障碍名称 */
  ariaLabel?: string;
  /** 自定义类名 */
  className?: string;
}
const CrumbContent = ({ item }: { item: BreadcrumbItem }) => (
  <>
    {item.icon && (
      <span aria-hidden="true" className="inline-flex shrink-0 items-center">
        {item.icon}
      </span>
    )}
    {item.label}
  </>
);

const CrumbNode = ({
  item,
  isLast,
  variant,
}: {
  item: BreadcrumbItem;
  isLast: boolean;
  variant: BreadcrumbVariant;
}) => {
  if (isLast) {
    return (
      <span aria-current="page" className={breadcrumbCurrentVariants({ variant })}>
        <CrumbContent item={item} />
      </span>
    );
  }
  const linkClass = breadcrumbLinkVariants({ variant });
  if (item.href) {
    return (
      <a href={item.href} onClick={item.onClick} className={linkClass}>
        <CrumbContent item={item} />
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={item.onClick}
      className={cn(linkClass, "cursor-pointer border-0 bg-transparent p-0 font-sans text-inherit")}
    >
      <CrumbContent item={item} />
    </button>
  );
};

const CrumbSeparator = ({
  variant,
  separator,
}: {
  variant: BreadcrumbVariant;
  separator?: ReactNode;
}) => {
  if (separator !== undefined) {
    return (
      <span aria-hidden="true" className="inline-flex items-center text-muted-foreground/70">
        {separator}
      </span>
    );
  }
  if (variant === "slash") {
    return (
      <span
        aria-hidden="true"
        className="px-0.5 font-mono text-xs text-muted-foreground/60 select-none"
      >
        /
      </span>
    );
  }
  return <ChevronRight aria-hidden="true" className="size-3.5 text-muted-foreground/65" />;
};

export const Breadcrumb = ({
  items,
  variant = "chevron",
  size = "md",
  separator,
  maxItems,
  ariaLabel = "面包屑导航",
  className,
}: BreadcrumbProps) => {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse =
    !expanded && maxItems !== undefined && maxItems >= 3 && items.length > maxItems;
  const visible = shouldCollapse ? [items[0], null, ...items.slice(-(maxItems - 1))] : items;

  return (
    <nav
      aria-label={ariaLabel}
      data-slot="breadcrumb"
      data-variant={variant}
      data-size={size}
      className={cn(breadcrumbNavVariants({ variant, size }), className)}
    >
      <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
        {visible.map((item, idx) => {
          const isLast = idx === visible.length - 1;
          return (
            <li
              key={item ? `${item.label}-${idx}` : "ellipsis"}
              className="inline-flex items-center gap-1.5"
            >
              {item ? (
                <CrumbNode item={item} isLast={isLast} variant={variant} />
              ) : (
                <button
                  type="button"
                  aria-label="展开省略路径"
                  onClick={() => setExpanded(true)}
                  className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <MoreHorizontal aria-hidden="true" className="size-3.5" />
                </button>
              )}
              {!isLast && <CrumbSeparator variant={variant} separator={separator} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
