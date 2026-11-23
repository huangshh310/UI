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
const Specimens = async ({
  component,
  responsive,
}: {
  component: ComponentDoc;
  responsive: boolean;
}) => {
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
          responsive={responsive}
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
  const responsive =
    component.category === "blocks" ||
    component.slug === "data-table" ||
    component.slug === "advanced-data-table";

  return (
    <article className="flex min-w-0 flex-col gap-8">
      <Breadcrumb trail={[{ href: "/components", label: "组件" }]} current={component.name} />
      <ComponentHeader component={component} />
      <ComponentMain
        preview={Hero ? <Hero /> : null}
        usageHtml={usageHtml}
        sourceHtml={sourceHtml}
        prompt={installPrompt(component)}
        responsive={responsive}
      />
      <InstallBlock
        command={cliCommand(component)}
        dependencies={component.dependencies}
        targetPath={`components/ui/${component.registryName}.tsx`}
      />
      <ApiTable props={component.api} />
      <Specimens component={component} responsive={responsive} />
      <AccessibilityNotes notes={component.accessibility} />
      <ComponentFooterNav component={component} />
    </article>
  );
};

export default ComponentPage;
