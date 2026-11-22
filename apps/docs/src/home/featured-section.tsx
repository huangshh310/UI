/**
 * 首页的精选组件网格：按组件去重展示 9 个形态各异的实时交互组件。
 */
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { SpecimenCard } from "@/gallery/specimen-card";
import { COMPONENTS, FEATURED_DIRECTORY, recentComponentSlugs } from "@/registry/registry";

export const FeaturedSection = () => {
  // 「最近」以构建时间为准
  const recentSlugs = recentComponentSlugs();

  return (
    <section
      aria-labelledby="featured-title"
      className="mx-auto max-w-[1400px] px-5 py-16 md:px-9 lg:py-20"
    >
      <div className="mb-9 flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Showcase
          </p>
          <h2
            id="featured-title"
            className="mt-2 text-2xl font-semibold tracking-[-0.03em] md:text-3xl"
          >
            精选组件
            <span className="ml-2 font-normal text-muted-foreground">可直接点击体验</span>
          </h2>
        </div>
        <Link
          href="/components"
          className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-(--site-surface) px-4 py-2 text-xs font-medium text-foreground shadow-xs transition-colors duration-(--ui-duration-fast) hover:border-foreground/25 hover:bg-accent sm:self-auto"
        >
          查看全部 {COMPONENTS.length} 个组件
          <ArrowRightIcon weight="bold" className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {FEATURED_DIRECTORY.map((entry, index) => (
          <SpecimenCard
            key={entry.specimen.slug}
            entry={entry}
            index={index}
            isNew={recentSlugs.includes(entry.component.slug)}
            titleMode="component"
          />
        ))}
      </div>
    </section>
  );
};
