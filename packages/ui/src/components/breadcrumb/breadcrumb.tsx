"use client";

import { cn } from "@matt-ui/utils";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { BreadcrumbItem, BreadcrumbProps } from "./breadcrumb.types.js";

const LINK_CLASS =
  "rounded-md text-muted-foreground no-underline transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const CrumbNode = ({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) => {
  if (isLast) {
    return (
      <span aria-current="page" className="font-medium text-foreground">
        {item.label}
      </span>
    );
  }
  if (item.href) {
    return (
      <a href={item.href} onClick={item.onClick} className={LINK_CLASS}>
        {item.label}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={item.onClick}
      className={cn(LINK_CLASS, "cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px]")}
    >
      {item.label}
    </button>
  );
};

export const Breadcrumb = ({
  items,
  maxItems,
  ariaLabel = "面包屑导航",
  className,
}: BreadcrumbProps) => {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse =
    !expanded && maxItems !== undefined && maxItems >= 3 && items.length > maxItems;
  const visible = shouldCollapse ? [items[0], null, ...items.slice(-(maxItems - 1))] : items;

  return (
    <nav aria-label={ariaLabel} data-slot="breadcrumb" className={cn("text-[13px]", className)}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
        {visible.map((item, idx) => {
          const isLast = idx === visible.length - 1;
          return (
            <li
              key={item ? `${item.label}-${idx}` : "ellipsis"}
              className="inline-flex items-center gap-1.5"
            >
              {item ? (
                <CrumbNode item={item} isLast={isLast} />
              ) : (
                <button
                  type="button"
                  aria-label="展开省略路径"
                  onClick={() => setExpanded(true)}
                  className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <MoreHorizontal aria-hidden="true" className="size-3.5" />
                </button>
              )}
              {!isLast && (
                <ChevronRight aria-hidden="true" className="size-3.5 text-muted-foreground/70" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
