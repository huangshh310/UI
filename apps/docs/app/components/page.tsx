/**
 * 组件目录页：全部示例的可搜索网格。
 */
import type { Metadata } from "next";
import { SpecimenDirectory } from "@/gallery/specimen-directory";
import { COMPONENTS, DIRECTORY, recentComponentSlugs } from "@/registry/registry";
import { Breadcrumb } from "@/site/breadcrumb";

export const metadata: Metadata = {
  title: "组件目录",
};

const ComponentsPage = () => {
  // 「最近」以构建时间为准，在服务端算好后交给客户端
  const recentSlugs = recentComponentSlugs();

  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-10 pb-24 md:px-9">
      <Breadcrumb current="全部组件" />
      <header className="mt-12 mb-12 max-w-xl">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Directory
        </p>
        <h1 className="text-4xl leading-[1.05] font-medium tracking-[-0.035em] md:text-[56px]">
          组件目录
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          收录 {COMPONENTS.length} 个组件、{DIRECTORY.length} 个示例。浏览实时演示，查看源码， 通过
          shadcn Registry 只安装你需要的那一个。
        </p>
      </header>
      <SpecimenDirectory recentSlugs={recentSlugs} />
    </div>
  );
};

export default ComponentsPage;
