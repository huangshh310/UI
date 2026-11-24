/**
 * 组件详情页布局：侧边栏位于动态段 [slug] 之外的路由组布局中，
 * 切换不同组件时不会卸载，从而稳定保留侧边栏自身的滚动位置；靠留白分隔导航与正文。
 */
import type { ReactNode } from "react";
import { ComponentSidebar, type SidebarGroup } from "@/detail/component-sidebar";
import { CATEGORIES, COMPONENTS } from "@/registry/registry";

const SIDEBAR_GROUPS: SidebarGroup[] = CATEGORIES.map((category) => ({
  id: category.id,
  label: category.label,
  items: COMPONENTS.filter((component) => component.category === category.id).map(
    ({ slug, name }) => ({ slug, name }),
  ),
}));

const ComponentDetailLayout = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto max-w-[1400px] px-5 pt-8 pb-24 md:px-9">
    <div className="grid gap-10 lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-14">
      <aside className="hidden lg:block">
        <ComponentSidebar groups={SIDEBAR_GROUPS} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  </div>
);

export default ComponentDetailLayout;
