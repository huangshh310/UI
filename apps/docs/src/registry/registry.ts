/**
 * 展示站的清单：全部组件、全部分类，以及查询它们的函数。
 * 新增组件时，在这里登记它的文档数据即可出现在目录与详情页。
 */
import { BUTTON_DOC } from "./button.doc";
import type { Category, ComponentDoc, Specimen } from "./registry.types";

export const CATEGORIES: Category[] = [{ id: "buttons", label: "按钮" }];

export const COMPONENTS: ComponentDoc[] = [BUTTON_DOC];

/** 目录页的一个条目：示例，加上它所属的组件 */
export interface DirectoryEntry {
  specimen: Specimen;
  component: ComponentDoc;
}

/** 把所有组件的示例摊平，供目录页展示 */
export const DIRECTORY: DirectoryEntry[] = COMPONENTS.flatMap((component) =>
  component.specimens.map((specimen) => ({ specimen, component })),
);

export const findComponent = (slug: string): ComponentDoc | undefined =>
  COMPONENTS.find((component) => component.slug === slug);

/** 示例在详情页上的地址 */
export const specimenHref = ({ specimen, component }: DirectoryEntry): string =>
  `/components/${component.slug}#${specimen.slug}`;
