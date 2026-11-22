/**
 * 组件目录页：全部示例的可搜索网格。
 */
import type { Metadata } from "next";
import { SpecimenDirectory } from "@/gallery/specimen-directory";
import { COMPONENTS, DIRECTORY } from "@/registry/registry";

export const metadata: Metadata = {
  title: "组件目录",
};

const ComponentsPage = () => (
  <div className="mx-auto max-w-[1400px] px-5 pt-14 pb-24 md:px-8">
    <header className="mb-12 max-w-2xl">
      <p className="mb-4 font-mono text-xs tracking-wide text-muted-foreground uppercase">
        Directory
      </p>
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">组件目录</h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        目前收录 {COMPONENTS.length} 个组件、{DIRECTORY.length} 个示例。
        每张卡片里都是真实运行的组件，可以直接点按和用键盘操作。
      </p>
    </header>
    <SpecimenDirectory />
  </div>
);

export default ComponentsPage;
