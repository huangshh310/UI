/**
 * 首页的示例网格：与目录页相同的卡片，下方是进入完整目录的链接。
 */
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { SpecimenCard } from "@/gallery/specimen-card";
import { DIRECTORY, recentComponentSlugs } from "@/registry/registry";

/** 首页最多展示的示例数：三列网格的三行 */
const FEATURED_COUNT = 9;

export const FeaturedSection = () => {
  // 「最近」以构建时间为准
  const recentSlugs = recentComponentSlugs();

  return (
    <section aria-label="示例" className="pb-20">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {DIRECTORY.slice(0, FEATURED_COUNT).map((entry, index) => (
          <SpecimenCard
            key={entry.specimen.slug}
            entry={entry}
            index={index + 3}
            isNew={recentSlugs.includes(entry.component.slug)}
          />
        ))}
      </div>
      <div className="mt-14 flex justify-center">
        <Link
          href="/components"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          查看全部组件
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};
