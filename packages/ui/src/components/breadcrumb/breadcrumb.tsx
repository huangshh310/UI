"use client";

/**
 * Breadcrumb：语义化面包屑导航，支持 chevron / slash / pill 三种变体、图标与深层自动折叠展开。
 */
import { cn } from "@matt-ui/utils";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { BreadcrumbItem, BreadcrumbProps, BreadcrumbVariant } from "./breadcrumb.types.js";
import {
  breadcrumbCurrentVariants,
  breadcrumbLinkVariants,
  breadcrumbNavVariants,
} from "./breadcrumb.variants.js";

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
