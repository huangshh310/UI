/**
 * 面包屑：标明当前页面在站点中的位置。
 */
import Link from "next/link";
import { SITE_NAME } from "./constants";

interface BreadcrumbProps {
  /** 中间层级；最后一级由 current 表示 */
  trail?: { href: string; label: string }[];
  current: string;
}

export const Breadcrumb = ({ trail = [], current }: BreadcrumbProps) => (
  <nav aria-label="面包屑" className="font-mono text-xs text-muted-foreground">
    <ol className="flex flex-wrap items-center gap-2">
      {[{ href: "/", label: SITE_NAME }, ...trail].map(({ href, label }) => (
        <li key={href} className="flex items-center gap-2">
          <Link href={href} className="transition-colors hover:text-foreground">
            {label}
          </Link>
          <span aria-hidden="true" className="text-border">
            /
          </span>
        </li>
      ))}
      <li aria-current="page" className="font-medium text-foreground">
        {current}
      </li>
    </ol>
  </nav>
);
