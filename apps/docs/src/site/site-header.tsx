/**
 * 站点页头：标识、主导航、仓库链接与主题切换。吸顶显示。
 */
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { REPOSITORY_URL, SITE_NAME } from "./constants";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export const SiteHeader = () => (
  <header className="sticky top-0 z-(--ui-z-sticky) border-b border-border bg-background/85 backdrop-blur-md">
    <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8">
      <Link href="/" className="flex items-center gap-2.5 justify-self-start font-mono text-sm">
        {/* 标识：一枚信号色方块 */}
        <span aria-hidden="true" className="size-3 bg-signal" />
        {SITE_NAME}
      </Link>
      <NavLinks />
      <div className="flex items-center gap-1 justify-self-end">
        <a
          href={REPOSITORY_URL}
          aria-label="GitHub 仓库"
          className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent"
        >
          <GithubLogoIcon weight="bold" className="size-4" aria-hidden="true" />
        </a>
        <ThemeToggle />
      </div>
    </div>
  </header>
);
