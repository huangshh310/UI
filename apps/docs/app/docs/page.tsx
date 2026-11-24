/**
 * 文档页：无框线卡片与直接命令示例，去除装饰性序号与多余引导语。
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { REGISTRY_ADDRESS, REPOSITORY_URL } from "@/site/constants";
import { DocCommand } from "@/site/doc-command";

export const metadata: Metadata = {
  title: "快速开始",
};

const Code = ({ children }: { children: ReactNode }) => (
  <code className="rounded-md bg-(--site-stage) px-1.5 py-0.5 font-mono text-xs text-foreground">
    {children}
  </code>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-3xl bg-(--site-surface) p-6 shadow-xs md:p-7">
    <h2 className="mb-3 text-lg font-semibold tracking-tight">{title}</h2>
    <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
  </section>
);

const DocsPage = () => (
  <div className="mx-auto max-w-3xl px-5 pt-10 pb-24 md:px-9 md:pt-14">
    <header className="mb-9">
      <h1 className="text-3xl leading-[1.08] font-semibold tracking-[-0.03em] md:text-[44px]">
        快速开始
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        组件以源码形式分发，安装即把 TypeScript 源文件直接写入你的项目。
      </p>
    </header>

    <div className="flex flex-col gap-5">
      <Section title="初始化项目">
        <p>需要 React 19 与 Tailwind CSS v4：</p>
        <DocCommand command="pnpm dlx shadcn@latest init" />
      </Section>

      <Section title="安装组件">
        <p>以安装 Button 为例：</p>
        <DocCommand command={`pnpm dlx shadcn@latest add ${REGISTRY_ADDRESS}/button`} />
        <p>
          源文件写入 <Code>components/ui/</Code>，依赖与主题变量自动同步至项目配置。
        </p>
      </Section>

      <Section title="主题与信号色">
        <p>
          组件直接沿用宿主项目的语义主题色，并附带全系统统一的强调信号色 <Code>signal</Code>
          ，在浅色与深色主题下保持一致辨识度。
        </p>
      </Section>

      <Section title="源码仓库">
        <p>
          项目以 MIT 许可开源，完整实现与测试见{" "}
          <a
            href={REPOSITORY_URL}
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            GitHub 仓库
          </a>
          。
        </p>
      </Section>
    </div>
  </div>
);

export default DocsPage;
