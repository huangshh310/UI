/**
 * 站点页脚：左侧是标识与一句说明，右侧是站内链接，最下方是版权行。
 */
import Link from "next/link";
import { REPOSITORY_URL, SITE_NAME } from "./constants";

const LINKS = [
  { href: "/components", label: "组件" },
  { href: "/docs", label: "文档" },
  { href: REPOSITORY_URL, label: "GitHub" },
  { href: "/llms.txt", label: "LLMs" },
];

export const SiteFooter = () => (
  <footer className="border-t border-border">
    <div className="mx-auto max-w-[1400px] px-5 md:px-9">
      <div className="flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-2.5 font-mono text-sm">
            <span aria-hidden="true" className="size-3 rounded-full bg-signal" />
            {SITE_NAME}
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            开源、讲究细节的 React 组件，为现代界面而作。
          </p>
        </div>
        <nav aria-label="页脚导航" className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="transition-colors hover:text-muted-foreground">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="border-t border-border py-5 text-xs text-muted-foreground">
        © 2026 {SITE_NAME} · MIT License
      </p>
    </div>
  </footer>
);
