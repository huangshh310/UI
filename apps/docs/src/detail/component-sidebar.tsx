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

const GROUP_TITLE_CLASSES =
  "mb-2 flex items-center justify-between px-3 font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase";

const LINK_CLASSES =
  "group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-secondary/65 hover:text-foreground aria-[current=page]:bg-secondary aria-[current=page]:font-medium aria-[current=page]:text-foreground";

const activeSlugFromPathname = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] === "components" ? (segments[1] ?? "") : "";
};

/**
 * 维护侧边栏自身滚动位置：
 * - 首次进入详情页时若当前项在可视区外，仅定位侧边栏自身使其居中可见；
 * - 后续在侧边栏内点击可见项时完全保持原位不回顶；
 * - 若通过命令面板或页脚上/下一组件跳到可视区外的项，仅最小幅度滚动侧边栏自身。
 */
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
    <p className={GROUP_TITLE_CLASSES}>
      <span>{group.label}</span>
      <span aria-hidden="true" className="tabular-nums">
        {group.items.length}
      </span>
    </p>
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
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-signal" />
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
      className="sticky top-20 flex max-h-[calc(100dvh-5.5rem)] flex-col gap-7 overflow-y-auto overscroll-contain pr-2 pb-10 [scrollbar-width:thin]"
    >
      <div>
        <p className={GROUP_TITLE_CLASSES}>概览</p>
        <ul className="flex flex-col gap-0.5">
          <li>
            <Link href="/docs" className={LINK_CLASSES}>
              快速开始
            </Link>
          </li>
          <li>
            <Link href="/components" className={LINK_CLASSES}>
              组件目录
            </Link>
          </li>
        </ul>
      </div>
      {groups.map((group) => (
        <CategoryGroup key={group.id} group={group} activeSlug={activeSlug} />
      ))}
    </nav>
  );
};
