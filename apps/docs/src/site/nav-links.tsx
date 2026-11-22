"use client";

/**
 * 顶部导航链接：居中的胶囊。需要读取当前路径来标记选中项，因此是客户端组件。
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
      className="flex items-center gap-0.5 rounded-full border border-border bg-background/80 p-1 backdrop-blur-md"
    >
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(pathname, href) ? "page" : undefined}
          className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:text-foreground aria-[current=page]:bg-accent aria-[current=page]:text-foreground"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
