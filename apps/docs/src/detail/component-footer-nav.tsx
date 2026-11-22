/**
 * 详情页底部：同分类的相关组件，以及上一个 / 下一个组件的翻页。
 * 没有相关组件或前后组件时，对应的部分不显示。
 */
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { neighbours, relatedComponents } from "@/registry/registry";
import type { ComponentDoc } from "@/registry/registry.types";

const CARD_CLASSES =
  "rounded-2xl border border-border bg-(--site-tile) p-5 transition-colors duration-(--ui-duration-fast) hover:border-foreground/40";

const RelatedList = ({ items }: { items: ComponentDoc[] }) => (
  <section aria-labelledby="related-title">
    <h2 id="related-title" className="mb-4 text-lg font-semibold tracking-tight">
      相关组件
    </h2>
    <ul className="grid gap-4 md:grid-cols-3">
      {items.map(({ slug, name, description }) => (
        <li key={slug}>
          <Link href={`/components/${slug}`} className={`block ${CARD_CLASSES}`}>
            <span className="font-medium">{name}</span>
            <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
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
              className={`flex items-center gap-3 ${CARD_CLASSES}`}
            >
              <ArrowLeftIcon weight="bold" className="size-4" aria-hidden="true" />
              {previous.name}
            </Link>
          )}
          {next && (
            <Link
              href={`/components/${next.slug}`}
              className={`flex items-center justify-end gap-3 md:col-start-2 ${CARD_CLASSES}`}
            >
              {next.name}
              <ArrowRightIcon weight="bold" className="size-4" aria-hidden="true" />
            </Link>
          )}
        </nav>
      )}
    </>
  );
};
