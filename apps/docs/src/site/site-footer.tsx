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
  <footer className="border-t border-border/75 bg-(--site-surface)/40">
    <div className="mx-auto max-w-[1400px] px-5 md:px-9">
      <div className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight">
            <span
              aria-hidden="true"
              className="inline-flex size-6 items-center justify-center rounded-md bg-signal shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
            >
              <span className="size-2 rounded-full bg-signal-foreground" />
            </span>
            {SITE_NAME}
          </p>
          <p className="mt-2.5 max-w-sm text-sm text-muted-foreground">
            开源、讲究细节的 React 组件平台，源码可控、无障碍优先。
          </p>
        </div>
        <nav aria-label="页脚导航" className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
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
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 py-5 text-xs text-muted-foreground">
        <p>© 2026 {SITE_NAME} · MIT License</p>
        <p className="font-mono">React 19 · Tailwind CSS v4 · Base UI</p>
      </div>
    </div>
  </footer>
);
