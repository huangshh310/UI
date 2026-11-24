/**
 * 详情页底部：同分类的相关组件与前后组件翻页，利用左右对齐与箭头方向直接表达关系。
 */
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { neighbours, relatedComponents } from "@/registry/registry";
import type { ComponentDoc } from "@/registry/registry.types";

const CARD_CLASSES =
  "rounded-2xl bg-(--site-surface) p-5 shadow-xs transition-shadow duration-(--ui-duration-fast) hover:shadow-md";

const RelatedList = ({ items }: { items: ComponentDoc[] }) => (
  <section aria-labelledby="related-title">
    <h2 id="related-title" className="mb-4 px-1 text-lg font-semibold tracking-tight">
      相关组件
    </h2>
    <ul className="grid gap-4 md:grid-cols-3">
      {items.map(({ slug, name, description }) => (
        <li key={slug}>
          <Link href={`/components/${slug}`} className={`group block h-full ${CARD_CLASSES}`}>
            <span className="flex items-center justify-between gap-2 font-medium text-foreground">
              <span className="truncate">{name}</span>
              <ArrowUpRightIcon
                weight="bold"
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
              />
            </span>
            <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
              {description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export const ComponentFooterNav = ({ component }: { component: ComponentDoc }) => {
  const related = relatedComponents(component);
  const { previous, next } = neighbours(component.slug);

  return (
    <>
      {related.length > 0 && <RelatedList items={related} />}
      {(previous || next) && (
        <nav aria-label="组件翻页" className="grid gap-4 md:grid-cols-2">
          {previous && (
            <Link
              href={`/components/${previous.slug}`}
              className={`group flex items-center gap-3 ${CARD_CLASSES}`}
            >
              <ArrowLeftIcon
                weight="bold"
                className="size-4 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:-translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
              <span className="font-medium text-foreground">{previous.name}</span>
            </Link>
          )}
          {next && (
            <Link
              href={`/components/${next.slug}`}
              className={`group flex items-center justify-end gap-3 text-right md:col-start-2 ${CARD_CLASSES}`}
            >
              <span className="font-medium text-foreground">{next.name}</span>
              <ArrowRightIcon
                weight="bold"
                className="size-4 text-muted-foreground transition-transform duration-(--ui-duration-fast) group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </Link>
          )}
        </nav>
      )}
    </>
  );
};
