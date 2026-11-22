/**
 * 站点页头：标识、居中的胶囊导航、仓库链接与主题切换。吸顶显示，没有底边线。
 */
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CommandPalette } from "@/command/command-palette";
import { REPOSITORY_URL, SITE_NAME } from "./constants";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export const SiteHeader = () => (
  <header className="sticky top-0 z-(--ui-z-sticky)">
    <div className="mx-auto grid h-[72px] max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-9">
      <Link
        href="/"
        className="flex items-center gap-2.5 justify-self-start rounded-full bg-background/80 py-1.5 pr-3 font-mono text-sm backdrop-blur-md"
      >
        {/* 标识：一枚信号色圆点 */}
        <span aria-hidden="true" className="size-3 rounded-full bg-signal" />
        {SITE_NAME}
      </Link>
      <NavLinks />
      <div className="flex items-center gap-0.5 justify-self-end rounded-full bg-background/80 backdrop-blur-md">
        <CommandPalette />
        <a
          href={REPOSITORY_URL}
          aria-label="GitHub 仓库"
          className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors duration-(--ui-duration-fast) hover:bg-accent"
        >
          <GithubLogoIcon weight="bold" className="size-4" aria-hidden="true" />
        </a>
        <ThemeToggle />
      </div>
    </div>
  </header>
);
