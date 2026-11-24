"use client";

/**
 * 顶部导航链接：居中悬浮毛玻璃胶囊，当前页以柔和次级底色轻盈高亮。
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./constants";

/** 首页只精确匹配，其余按路径前缀匹配 */
const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="主导航"
      className="pointer-events-auto flex h-11 items-center gap-0.5 rounded-full bg-(--site-surface)/90 p-1 shadow-[0_2px_12px_rgba(19,20,24,0.05)] backdrop-blur-xl dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
    >
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(pathname, href) ? "page" : undefined}
          className="rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-4 aria-[current=page]:bg-secondary aria-[current=page]:text-foreground"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
