"use client";

/**
 * 详情页的侧边导航：独立滚动容器，挂在持久布局中，切换组件时保留滚动位置。
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export interface SidebarGroup {
  id: string;
  label: string;
  items: { slug: string; name: string }[];
}

const GROUP_TITLE_CLASSES = "mb-1.5 px-3 text-xs font-medium text-muted-foreground";

const LINK_CLASSES =
  "group flex items-center justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-(--site-surface)/65 hover:text-foreground aria-[current=page]:bg-(--site-surface) aria-[current=page]:font-medium aria-[current=page]:text-foreground aria-[current=page]:shadow-2xs";

const activeSlugFromPathname = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] === "components" ? (segments[1] ?? "") : "";
};

const useSidebarScroll = (activeSlug: string) => {
  const navRef = useRef<HTMLElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !activeSlug) return;
    const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = active.getBoundingClientRect();
    const isAbove = itemRect.top < navRect.top + 12;
    const isBelow = itemRect.bottom > navRect.bottom - 12;

    if (!initializedRef.current) {
      initializedRef.current = true;
      if (isAbove || isBelow) {
        const offset = itemRect.top - navRect.top + nav.scrollTop;
        nav.scrollTop = Math.max(0, offset - nav.clientHeight / 2 + active.offsetHeight / 2);
      }
      return;
    }

    if (isAbove) {
      nav.scrollTop += itemRect.top - navRect.top - 24;
    } else if (isBelow) {
      nav.scrollTop += itemRect.bottom - navRect.bottom + 24;
    }
  }, [activeSlug]);

  return navRef;
};

const CategoryGroup = ({ group, activeSlug }: { group: SidebarGroup; activeSlug: string }) => (
  <div>
    <p className={GROUP_TITLE_CLASSES}>{group.label}</p>
    <ul className="flex flex-col gap-0.5">
      {group.items.map(({ slug, name }) => {
        const current = slug === activeSlug;
        return (
          <li key={slug}>
            <Link
              href={`/components/${slug}`}
              aria-current={current ? "page" : undefined}
              className={LINK_CLASSES}
            >
              <span className="truncate">{name}</span>
              {current && (
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

export const ComponentSidebar = ({ groups }: { groups: SidebarGroup[] }) => {
  const activeSlug = activeSlugFromPathname(usePathname());
  const navRef = useSidebarScroll(activeSlug);

  return (
    <nav
      ref={navRef}
      aria-label="组件导航"
      className="sticky top-20 flex max-h-[calc(100dvh-5.5rem)] flex-col gap-6 overflow-y-auto overscroll-contain pr-1 pb-10 [scrollbar-width:thin]"
    >
      {groups.map((group) => (
        <CategoryGroup key={group.id} group={group} activeSlug={activeSlug} />
      ))}
    </nav>
  );
};
