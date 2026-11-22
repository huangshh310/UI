/**
 * 组件详情页：主面板（预览 / 用法 / 代码）、安装、API、更多示例、可访问性、相关组件。
 * 所有组件的页面在构建时静态生成。
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccessibilityNotes } from "@/detail/accessibility-notes";
import { ApiTable } from "@/detail/api-table";
import { ComponentFooterNav } from "@/detail/component-footer-nav";
import { ComponentMain } from "@/detail/component-main";
import { ComponentSidebar } from "@/detail/component-sidebar";
import { InstallBlock } from "@/detail/install-block";
import { SpecimenBlock } from "@/detail/specimen-block";
import { installPrompt } from "@/registry/install-prompt";
import { CATEGORIES, cliCommand, COMPONENTS, findComponent } from "@/registry/registry";
import type { ComponentDoc } from "@/registry/registry.types";
import { highlightCode, highlightComponentSource, highlightSpecimen } from "@/registry/source";
import { Breadcrumb } from "@/site/breadcrumb";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () => COMPONENTS.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const component = findComponent((await params).slug);
  return component ? { title: component.name, description: component.description } : {};
};

const ComponentHeader = ({ component }: { component: ComponentDoc }) => {
  const categoryLabel =
    CATEGORIES.find(({ id }) => id === component.category)?.label ?? component.category;
  const pkgName = component.dependencies.includes("motion") ? "@matt-ui/motion" : "@matt-ui/ui";

  return (
    <header className="border-b border-border/70 pb-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-(--site-surface) px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
          {categoryLabel}
        </span>
        <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          {pkgName}
        </span>
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
        {component.name}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {component.description}
      </p>
    </header>
  );
};

/** 「更多示例」一节：每个示例一个可切换预览与源码的区块 */
const Specimens = async ({ component }: { component: ComponentDoc }) => {
  const codes = await Promise.all(
    component.specimens.map(({ file }) => highlightSpecimen(file, component.registryName)),
  );

  return (
    <section aria-labelledby="examples-title" className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between border-b border-border/70 pb-3">
        <h2 id="examples-title" className="text-lg font-semibold tracking-tight">
          示例
        </h2>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {component.specimens.length} 个示例
        </span>
      </div>
      {component.specimens.map(({ slug, name, description, Demo }, index) => (
        <SpecimenBlock
          key={slug}
          id={slug}
          name={name}
          description={description}
          preview={<Demo />}
          codeHtml={codes[index] ?? ""}
        />
      ))}
    </section>
  );
};

const ComponentPage = async ({ params }: PageProps) => {
  const component = findComponent((await params).slug);
  if (!component) notFound();

  const [usageHtml, sourceHtml] = await Promise.all([
    highlightCode(component.usage),
    highlightComponentSource(component.registryName),
  ]);
  const Hero = component.specimens[0]?.Demo;

  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-8 pb-24 md:px-9">
      <div className="border-b border-border/70 pb-5">
        <Breadcrumb trail={[{ href: "/components", label: "组件" }]} current={component.name} />
      </div>
      <div className="grid gap-10 pt-8 lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block lg:border-r lg:border-border/70 lg:pr-6">
          <div className="sticky top-24">
            <ComponentSidebar activeSlug={component.slug} />
          </div>
        </aside>
        <article className="flex min-w-0 flex-col gap-8">
          <ComponentHeader component={component} />
          <ComponentMain
            preview={Hero ? <Hero /> : null}
            usageHtml={usageHtml}
            sourceHtml={sourceHtml}
            prompt={installPrompt(component)}
          />
          <InstallBlock
            command={cliCommand(component)}
            dependencies={component.dependencies}
            targetPath={`components/ui/${component.registryName}.tsx`}
          />
          <ApiTable props={component.api} />
          <Specimens component={component} />
          <AccessibilityNotes notes={component.accessibility} />
          <ComponentFooterNav component={component} />
        </article>
      </div>
    </div>
  );
};

export default ComponentPage;
