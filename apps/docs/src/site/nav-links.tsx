"use client";

/**
 * 顶部导航链接：居中分段胶囊，当前页以抬升卡片高亮。
 * 需要读取当前路径来标记选中项，因此是客户端组件。
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
      className="flex items-center gap-0.5 rounded-full border border-border/75 bg-secondary/65 p-1"
    >
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(pathname, href) ? "page" : undefined}
          className="rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-all duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-4 aria-[current=page]:bg-card aria-[current=page]:text-foreground aria-[current=page]:shadow-xs"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
