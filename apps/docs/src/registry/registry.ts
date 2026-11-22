/**
 * 展示站的清单：全部组件、全部分类，以及查询它们的函数。
 * 新增组件时，在这里登记它的文档数据即可出现在目录与详情页。
 */
import { REGISTRY_ADDRESS } from "@/site/constants";
import { BUTTON_DOC } from "./button.doc";
import type { Category, ComponentDoc, Specimen } from "./registry.types";

export const CATEGORIES: Category[] = [{ id: "buttons", label: "按钮" }];

export const COMPONENTS: ComponentDoc[] = [BUTTON_DOC];

/** 收录后多少天内算「最近」 */
const RECENT_DAYS = 30;

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

/** 通过 shadcn CLI 安装组件的命令 */
export const cliCommand = ({ registryName }: ComponentDoc): string =>
  `pnpm dlx shadcn@latest add ${REGISTRY_ADDRESS}/${registryName}`;

/**
 * 组件是否为最近收录。
 *
 * @param now 用于比较的当前时间；由调用方传入，便于在构建时固定
 */
export const isRecent = ({ createdAt }: ComponentDoc, now: Date): boolean =>
  now.getTime() - new Date(createdAt).getTime() <= RECENT_DAYS * 24 * 60 * 60 * 1000;

/**
 * 最近收录的组件，以调用时刻为准。
 *
 * 只在服务端组件里调用：页面在构建时静态生成，结果随之固定；
 * 客户端组件通过属性拿到这份结果，不自己计算，避免两端因时间不同而渲染不一致。
 */
export const recentComponentSlugs = (): string[] => {
  const now = new Date();
  return COMPONENTS.filter((component) => isRecent(component, now)).map(({ slug }) => slug);
};

/** 组件在清单中的前一个与后一个，用于详情页底部的翻页 */
export const neighbours = (slug: string) => {
  const index = COMPONENTS.findIndex((component) => component.slug === slug);
  return { previous: COMPONENTS[index - 1], next: COMPONENTS[index + 1] };
};

/** 同分类的其他组件，最多三个 */
export const relatedComponents = ({ slug, category }: ComponentDoc): ComponentDoc[] =>
  COMPONENTS.filter((other) => other.slug !== slug && other.category === category).slice(0, 3);
