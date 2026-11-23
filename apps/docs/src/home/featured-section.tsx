/**
 * 首页精选画廊：直接承接首屏的 3×3 无边框单体组件网格，底部以克制的居中文字链引导浏览全量组件。
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
      className="mx-auto max-w-[1400px] px-5 pt-2 pb-20 md:px-9 md:pb-24"
    >
      <h2 id="featured-title" className="sr-only">
        精选组件
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <div className="mt-12 flex justify-center">
        <Link
          href="/components"
          className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground outline-none transition-colors duration-(--ui-duration-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span>查看全部 {COMPONENTS.length} 个组件</span>
          <ArrowRightIcon
            weight="bold"
            aria-hidden="true"
            className="size-3.5 transition-transform duration-(--ui-duration-fast) group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
};
