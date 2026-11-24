/**
 * 组件目录页：去辅助说明，让分类筛选栏与实时组件网格直接承担表达。
 */
import type { Metadata } from "next";
import { SpecimenDirectory } from "@/gallery/specimen-directory";
import { recentComponentSlugs } from "@/registry/registry";

export const metadata: Metadata = {
  title: "组件目录",
};

const ComponentsPage = () => {
  const recentSlugs = recentComponentSlugs();

  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-10 pb-24 md:px-9 md:pt-14">
      <header className="mb-7">
        <h1 className="text-3xl leading-[1.08] font-semibold tracking-[-0.03em] md:text-[42px]">
          组件目录
        </h1>
      </header>
      <SpecimenDirectory recentSlugs={recentSlugs} />
    </div>
  );
};

export default ComponentsPage;
