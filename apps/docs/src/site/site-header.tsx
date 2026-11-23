/**
 * 站点页头：三枚独立悬浮毛玻璃胶囊（品牌、主导航、工具操作），
 * 与页面纯白/纯黑画布自然分离，无全宽分隔线干扰。
 */
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CommandPalette } from "@/command/command-palette";
import { REPOSITORY_URL, SITE_NAME } from "./constants";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

const PILL_SURFACE =
  "pointer-events-auto border border-border/80 bg-(--site-surface)/88 shadow-[0_2px_10px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:shadow-[0_2px_12px_rgba(0,0,0,0.28)]";

export const SiteHeader = () => (
  <header className="pointer-events-none sticky top-0 z-(--ui-z-sticky) pt-3.5 pb-1">
    <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 md:px-9">
      <Link
        href="/"
        className={`group inline-flex h-11 items-center gap-2.5 justify-self-start rounded-full px-3 outline-none transition-colors duration-(--ui-duration-fast) hover:border-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:pr-4 ${PILL_SURFACE}`}
      >
        <span
          aria-hidden="true"
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-signal shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition-transform duration-(--ui-duration-fast) group-hover:scale-[1.04]"
        >
          <span className="size-2 rounded-full bg-signal-foreground" />
        </span>
        <span className="font-mono text-[13px] font-semibold tracking-tight max-sm:sr-only">
          {SITE_NAME}
        </span>
      </Link>
      <NavLinks />
      <div
        className={`flex h-11 items-center gap-0.5 justify-self-end rounded-full px-1.5 ${PILL_SURFACE}`}
      >
        <CommandPalette />
        <a
          href={REPOSITORY_URL}
          aria-label="GitHub 仓库"
          className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-(--site-stage) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <GithubLogoIcon weight="bold" className="size-4" aria-hidden="true" />
        </a>
        <ThemeToggle />
      </div>
    </div>
  </header>
);
