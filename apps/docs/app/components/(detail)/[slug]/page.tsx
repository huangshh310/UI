/**
 * 组件详情页：主面板（预览 / 用法 / 代码）、安装、API、示例、可访问性、相关组件。
 * 去分隔线与多余角标，靠卡片明度层次与垂直留白组织信息。
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
import { cliCommand, COMPONENTS, findComponent } from "@/registry/registry";
import type { ComponentDoc } from "@/registry/registry.types";
import { highlightCode, highlightComponentSource, highlightSpecimen } from "@/registry/source";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () => COMPONENTS.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const component = findComponent((await params).slug);
  return component ? { title: component.name, description: component.description } : {};
};

const ComponentHeader = ({ component }: { component: ComponentDoc }) => (
  <header>
    <h1 className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{component.name}</h1>
    <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
      {component.description}
    </p>
  </header>
);

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
    <section aria-labelledby="examples-title" className="flex flex-col gap-5">
      <h2 id="examples-title" className="px-1 text-lg font-semibold tracking-tight">
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
