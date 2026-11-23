/**
 * 站点页脚：细边线分隔，左侧为品牌标识与定位，右侧为导航链接，底部为版权与协议。
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
  <footer className="border-t border-border/60">
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-5 py-9 md:flex-row md:items-center md:justify-between md:px-9">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground">
          <span
            aria-hidden="true"
            className="inline-flex size-5 items-center justify-center rounded-full bg-signal shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
          >
            <span className="size-1.5 rounded-full bg-signal-foreground" />
          </span>
          {SITE_NAME}
        </span>
        <span aria-hidden="true" className="text-border">
          ·
        </span>
        <span>© 2026 MIT License</span>
      </div>
      <nav aria-label="页脚导航" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  </footer>
);
