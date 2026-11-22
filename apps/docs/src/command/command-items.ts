/**
 * 命令面板可以跳转到的条目：站点页面，以及清单中的全部组件。
 */
import { COMPONENTS } from "@/registry/registry";

export interface CommandItem {
  id: string;
  label: string;
  /** 右侧的分组标注 */
  group: string;
  href: string;
  /** 参与搜索的文本 */
  keywords: string;
}

const PAGES: CommandItem[] = [
  { id: "page-home", label: "首页", group: "页面", href: "/", keywords: "首页 home" },
  {
    id: "page-components",
    label: "组件目录",
    group: "页面",
    href: "/components",
    keywords: "组件 目录 components",
  },
  {
    id: "page-docs",
    label: "快速开始",
    group: "页面",
    href: "/docs",
    keywords: "文档 快速开始 安装 docs",
  },
];

export const COMMAND_ITEMS: CommandItem[] = [
  ...COMPONENTS.map(({ slug, name, description }) => ({
    id: `component-${slug}`,
    label: name,
    group: "组件",
    href: `/components/${slug}`,
    keywords: `${name} ${description}`,
  })),
  ...PAGES,
];

/** 条目是否匹配关键字；关键字为空时全部匹配 */
export const matchesCommand = ({ keywords }: CommandItem, query: string): boolean =>
  keywords.toLowerCase().includes(query.trim().toLowerCase());
