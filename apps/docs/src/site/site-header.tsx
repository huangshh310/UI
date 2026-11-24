/**
 * 站点页头：三枚独立悬浮毛玻璃胶囊（品牌、主导航、工具操作），
 * 靠表面明度与轻柔漫射微影同冷灰画布自然分离，无框线干扰。
 */
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CommandPalette } from "@/command/command-palette";
import { BrandLogo } from "./brand-logo";
import { REPOSITORY_URL, SITE_NAME } from "./constants";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

const PILL_SURFACE =
  "pointer-events-auto bg-(--site-surface)/90 shadow-[0_2px_12px_rgba(19,20,24,0.05)] backdrop-blur-xl dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)]";

export const SiteHeader = () => (
  <header className="pointer-events-none sticky top-0 z-(--ui-z-sticky) pt-4 pb-1">
    <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 md:px-9">
      <Link
        href="/"
        className={`group inline-flex h-11 items-center gap-2 justify-self-start rounded-full px-2.5 outline-none transition-colors duration-(--ui-duration-fast) hover:bg-(--site-surface) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:pr-4 ${PILL_SURFACE}`}
      >
        <BrandLogo className="size-7 transition-transform duration-(--ui-duration-fast) group-hover:scale-[1.04]" />
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
          className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <GithubLogoIcon weight="bold" className="size-4" aria-hidden="true" />
        </a>
        <ThemeToggle />
      </div>
    </div>
  </header>
);
