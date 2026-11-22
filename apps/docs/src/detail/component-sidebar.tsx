/**
 * 详情页的侧边导航：概览链接，以及全部组件的列表。
 */
import Link from "next/link";
import { COMPONENTS } from "@/registry/registry";

const GROUP_TITLE_CLASSES =
  "mb-2 px-3 font-mono text-xs tracking-wide text-muted-foreground uppercase";

const LINK_CLASSES =
  "block rounded-md border-l-2 border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-(--ui-duration-fast) hover:text-foreground aria-[current=page]:border-signal aria-[current=page]:rounded-l-none aria-[current=page]:bg-accent aria-[current=page]:text-foreground";

export const ComponentSidebar = ({ activeSlug }: { activeSlug: string }) => (
  <nav aria-label="组件导航" className="flex flex-col gap-8">
    <div>
      <p className={GROUP_TITLE_CLASSES}>概览</p>
      <ul>
        <li>
          <Link href="/components" className={LINK_CLASSES}>
            组件目录
          </Link>
        </li>
      </ul>
    </div>
    <div>
      <p className={GROUP_TITLE_CLASSES}>组件</p>
      <ul>
        {COMPONENTS.map(({ slug, name }) => (
          <li key={slug}>
            <Link
              href={`/components/${slug}`}
              aria-current={slug === activeSlug ? "page" : undefined}
              className={LINK_CLASSES}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);
