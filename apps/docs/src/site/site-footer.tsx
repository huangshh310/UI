/**
 * 站点页脚。
 */
import { REPOSITORY_URL, SITE_NAME } from "./constants";

export const SiteFooter = () => (
  <footer className="border-t border-border">
    <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
      <p className="font-mono text-xs">{SITE_NAME} · MIT License</p>
      <a
        href={REPOSITORY_URL}
        className="underline decoration-1 underline-offset-4 hover:text-foreground"
      >
        查看源码
      </a>
    </div>
  </footer>
);
