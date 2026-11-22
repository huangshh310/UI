/**
 * 组件详情页：示例（预览与源码）、安装、API、可访问性。
 * 所有组件的页面在构建时静态生成。
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccessibilityNotes } from "@/detail/accessibility-notes";
import { ApiTable } from "@/detail/api-table";
import { ComponentSidebar } from "@/detail/component-sidebar";
import { InstallBlock } from "@/detail/install-block";
import { SpecimenBlock } from "@/detail/specimen-block";
import { COMPONENTS, findComponent } from "@/registry/registry";
import { highlightSpecimen } from "@/registry/source";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () => COMPONENTS.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const component = findComponent((await params).slug);
  return component ? { title: component.name, description: component.description } : {};
};

const ComponentPage = async ({ params }: PageProps) => {
  const component = findComponent((await params).slug);
  if (!component) notFound();

  const codes = await Promise.all(component.specimens.map(({ file }) => highlightSpecimen(file)));
  const [first, ...rest] = component.specimens.map(({ slug, name, description, Demo }, index) => (
    <SpecimenBlock
      key={slug}
      id={slug}
      name={name}
      description={description}
      preview={<Demo />}
      codeHtml={codes[index] ?? ""}
    />
  ));

  return (
    <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pt-10 pb-24 md:px-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <ComponentSidebar activeSlug={component.slug} />
        </div>
      </aside>
      <article className="flex min-w-0 flex-col gap-14">
        <header>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{component.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {component.description}
          </p>
        </header>
        {first}
        <InstallBlock command={component.install} />
        {rest}
        <ApiTable props={component.api} />
        <AccessibilityNotes notes={component.accessibility} />
      </article>
    </div>
  );
};

export default ComponentPage;
