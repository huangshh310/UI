/**
 * 组件目录页：全部示例的极简无边框画廊。
 */
import type { Metadata } from "next";
import { SpecimenDirectory } from "@/gallery/specimen-directory";
import { COMPONENTS, recentComponentSlugs, TOTAL_SPECIMEN_COUNT } from "@/registry/registry";

export const metadata: Metadata = {
  title: "组件目录",
};

const ComponentsPage = () => {
  // 「最近」以构建时间为准，在服务端算好后交给客户端
  const recentSlugs = recentComponentSlugs();

  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-10 pb-24 md:px-9 md:pt-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl leading-[1.08] font-semibold tracking-[-0.03em] md:text-[44px]">
          组件目录
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          收录 <span className="font-mono font-medium text-foreground">{COMPONENTS.length}</span>{" "}
          个组件与区块、
          <span className="font-mono font-medium text-foreground">{TOTAL_SPECIMEN_COUNT}</span>{" "}
          个场景示例。悬停任意画廊卡片即可快速复制 CLI 安装命令。
        </p>
      </header>
      <SpecimenDirectory recentSlugs={recentSlugs} />
    </div>
  );
};

export default ComponentsPage;
