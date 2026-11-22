/**
 * 首页的精选示例：与目录页相同的卡片网格，展示排在最前面的几个示例。
 */
import { SpecimenCard } from "@/gallery/specimen-card";
import { DIRECTORY, recentComponentSlugs } from "@/registry/registry";

/** 首页最多展示的示例数：填满三列网格的两行 */
const FEATURED_COUNT = 5;

export const FeaturedSection = () => {
  // 「最近」以构建时间为准
  const recentSlugs = recentComponentSlugs();

  return (
    <section
      aria-label="精选示例"
      className="grid grid-cols-1 gap-5 pb-24 md:grid-cols-2 xl:grid-cols-3"
    >
      {DIRECTORY.slice(0, FEATURED_COUNT).map((entry, index) => (
        <SpecimenCard
          key={entry.specimen.slug}
          entry={entry}
          index={index + 3}
          isNew={recentSlugs.includes(entry.component.slug)}
        />
      ))}
    </section>
  );
};
