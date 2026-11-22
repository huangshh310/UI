/**
 * 文档页：介绍这套组件是什么，以及怎样把它装进项目。
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/site/breadcrumb";
import { REGISTRY_ADDRESS, REPOSITORY_URL } from "@/site/constants";
import { DocCommand } from "@/site/doc-command";

export const metadata: Metadata = {
  title: "快速开始",
};

/** 文档中的一节 */
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-t border-border py-10">
    <h2 className="mb-4 text-xl font-semibold tracking-tight">{title}</h2>
    <div className="leading-relaxed text-muted-foreground">{children}</div>
  </section>
);

const DocsPage = () => (
  <div className="mx-auto max-w-3xl px-5 pt-10 pb-24 md:px-9">
    <Breadcrumb current="快速开始" />
    <header className="mt-12 mb-10">
      <h1 className="text-4xl leading-[1.05] font-medium tracking-[-0.035em] md:text-[56px]">
        快速开始
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        matt-ui 的组件以源码的形式分发。安装一个组件，就是把它的 TypeScript 源文件加入你的项目，
        之后可以随意修改，没有运行时的黑盒依赖。
      </p>
    </header>

    <Section title="1. 准备一个 shadcn 项目">
      <p>组件通过 shadcn CLI 安装。如果项目还没有初始化 shadcn，先运行：</p>
      <DocCommand command="pnpm dlx shadcn@latest init" />
      <p>需要 React 19 与 Tailwind CSS v4。</p>
    </Section>

    <Section title="2. 安装组件">
      <p>把命令最后一段换成组件名。例如安装 Button：</p>
      <DocCommand command={`pnpm dlx shadcn@latest add ${REGISTRY_ADDRESS}/button`} />
      <p>
        CLI 会把源文件写入 <code className="font-mono text-foreground">components/ui/</code>，
        安装需要的 npm 依赖，并把组件用到的颜色与动效变量加进你的样式表。
      </p>
    </Section>

    <Section title="3. 使用">
      <p>
        从你自己的 <code className="font-mono text-foreground">components/ui</code> 目录引入。
        每个组件的详情页都有可以直接复制的用法示例，以及给 AI 编程助手用的安装提示词。
      </p>
    </Section>

    <Section title="主题">
      <p>
        组件沿用你项目里的 shadcn 主题，另外带来一个全系统唯一的高饱和色{" "}
        <code className="font-mono text-foreground">signal</code>。它在浅色与深色主题下取值相同，
        一个页面只应该用一次，留给最需要被看到的操作。
      </p>
    </Section>

    <Section title="源码">
      <p>
        项目以 MIT 许可开源。组件的实现、测试与这个站点的代码都在{" "}
        <a href={REPOSITORY_URL} className="text-foreground underline underline-offset-4">
          GitHub 仓库
        </a>
        。
      </p>
    </Section>
  </div>
);

export default DocsPage;
