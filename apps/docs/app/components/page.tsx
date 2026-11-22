/**
 * 组件目录页：全部示例的可搜索画廊。
 */
import type { Metadata } from "next";
import { SpecimenDirectory } from "@/gallery/specimen-directory";
import { COMPONENTS, recentComponentSlugs, TOTAL_SPECIMEN_COUNT } from "@/registry/registry";
import { Breadcrumb } from "@/site/breadcrumb";

export const metadata: Metadata = {
  title: "组件目录",
};

const ComponentsPage = () => {
  // 「最近」以构建时间为准，在服务端算好后交给客户端
  const recentSlugs = recentComponentSlugs();

  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-8 pb-24 md:px-9">
      <Breadcrumb current="全部组件" />
      <header className="mt-8 mb-10 max-w-2xl">
        <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
          Directory
        </p>
        <h1 className="mt-3 text-4xl leading-[1.08] font-semibold tracking-[-0.03em] md:text-[50px]">
          组件目录
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          收录 <span className="font-mono font-medium text-foreground">{COMPONENTS.length}</span>{" "}
          个组件与区块、
          <span className="font-mono font-medium text-foreground">{TOTAL_SPECIMEN_COUNT}</span>{" "}
          个场景示例。支持在线交互预览，通过 shadcn Registry 只安装你需要的那一个。
        </p>
      </header>
      <SpecimenDirectory recentSlugs={recentSlugs} />
    </div>
  );
};

export default ComponentsPage;
