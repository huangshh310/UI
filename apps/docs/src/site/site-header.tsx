/**
 * 站点页头：全宽毛玻璃吸顶栏，避免滚动正文穿透重叠。
 * 左侧为品牌标识，居中为分段胶囊导航，右侧为搜索触发器、仓库与主题切换。
 */
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CommandPalette } from "@/command/command-palette";
import { REPOSITORY_URL, SITE_NAME } from "./constants";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export const SiteHeader = () => (
  <header className="sticky top-0 z-(--ui-z-sticky) border-b border-border/70 bg-background/82 backdrop-blur-xl">
    <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 md:px-9">
      <Link
        href="/"
        className="group inline-flex items-center gap-2.5 justify-self-start rounded-full py-1 pr-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {/* 标识：钴蓝微徽标内嵌一枚极简几何锚点 */}
        <span
          aria-hidden="true"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-signal shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition-transform duration-(--ui-duration-fast) group-hover:scale-[1.03]"
        >
          <span className="size-2.5 rounded-full bg-signal-foreground" />
        </span>
        <span className="font-mono text-sm font-semibold tracking-tight max-sm:sr-only">
          {SITE_NAME}
        </span>
      </Link>
      <NavLinks />
      <div className="flex items-center gap-1.5 justify-self-end">
        <CommandPalette />
        <a
          href={REPOSITORY_URL}
          aria-label="GitHub 仓库"
          className="inline-flex size-9 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:border-border hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <GithubLogoIcon weight="bold" className="size-4" aria-hidden="true" />
        </a>
        <ThemeToggle />
      </div>
    </div>
  </header>
);
