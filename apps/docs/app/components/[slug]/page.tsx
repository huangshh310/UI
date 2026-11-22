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
import { cliCommand, COMPONENTS, findComponent } from "@/registry/registry";
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

/** 「更多示例」一节：每个示例一个可切换预览与源码的区块 */
const Specimens = async ({ component }: { component: ComponentDoc }) => {
  const codes = await Promise.all(
    component.specimens.map(({ file }) => highlightSpecimen(file, component.registryName)),
  );

  return (
    <section aria-labelledby="examples-title" className="flex flex-col gap-10">
      <h2 id="examples-title" className="text-lg font-semibold tracking-tight">
        示例
      </h2>
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
      <div className="border-b border-border pb-5">
        <Breadcrumb trail={[{ href: "/components", label: "组件" }]} current={component.name} />
      </div>
      <div className="grid gap-10 pt-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ComponentSidebar activeSlug={component.slug} />
          </div>
        </aside>
        <article className="flex min-w-0 flex-col gap-8">
          <header>
            <h1 className="text-4xl font-semibold tracking-[-0.03em]">{component.name}</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{component.description}</p>
          </header>
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
