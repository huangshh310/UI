/**
 * 站点页脚：去分隔线留白收尾，左侧为品牌标识与许可信息，右侧为导航链接。
 */
import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { REPOSITORY_URL, SITE_NAME } from "./constants";

const LINKS = [
  { href: "/components", label: "组件" },
  { href: "/docs", label: "文档" },
  { href: REPOSITORY_URL, label: "GitHub" },
  { href: "/llms.txt", label: "LLMs" },
];

export const SiteFooter = () => (
  <footer className="pt-10 pb-12">
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-5 md:flex-row md:items-center md:justify-between md:px-9">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground">
          <BrandLogo className="size-6" />
          {SITE_NAME}
        </span>
        <span>MIT License</span>
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
