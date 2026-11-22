/**
 * 详情页的侧边导航：概览链接，以及按分类组织的全部组件列表。
 */
import Link from "next/link";
import { CATEGORIES, COMPONENTS } from "@/registry/registry";
import type { Category } from "@/registry/registry.types";

const GROUP_TITLE_CLASSES =
  "mb-2 flex items-center justify-between px-3 font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase";

const LINK_CLASSES =
  "group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:bg-secondary/65 hover:text-foreground aria-[current=page]:bg-secondary aria-[current=page]:font-medium aria-[current=page]:text-foreground";

const CategoryGroup = ({ category, activeSlug }: { category: Category; activeSlug: string }) => {
  const items = COMPONENTS.filter((component) => component.category === category.id);

  return (
    <div>
      <p className={GROUP_TITLE_CLASSES}>
        <span>{category.label}</span>
        <span aria-hidden="true" className="tabular-nums">
          {items.length}
        </span>
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map(({ slug, name }) => {
          const current = slug === activeSlug;
          return (
            <li key={slug}>
              <Link
                href={`/components/${slug}`}
                aria-current={current ? "page" : undefined}
                className={LINK_CLASSES}
              >
                <span className="truncate">{name}</span>
                {current && (
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-signal" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const ComponentSidebar = ({ activeSlug }: { activeSlug: string }) => (
  <nav aria-label="组件导航" className="flex flex-col gap-7">
    <div>
      <p className={GROUP_TITLE_CLASSES}>概览</p>
      <ul className="flex flex-col gap-0.5">
        <li>
          <Link href="/docs" className={LINK_CLASSES}>
            快速开始
          </Link>
        </li>
        <li>
          <Link href="/components" className={LINK_CLASSES}>
            组件目录
          </Link>
        </li>
      </ul>
    </div>
    {CATEGORIES.map((category) => (
      <CategoryGroup key={category.id} category={category} activeSlug={activeSlug} />
    ))}
  </nav>
);
