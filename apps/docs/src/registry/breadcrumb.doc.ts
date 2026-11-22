import BreadcrumbBasicDemo from "@/demos/breadcrumb/basic";
import BreadcrumbFullDemo from "@/demos/breadcrumb/full";
import type { ComponentDoc } from "./registry.types";

export const BREADCRUMB_DOC: ComponentDoc = {
  slug: "breadcrumb",
  name: "Breadcrumb",
  description: "语义化面包屑导航，支持深层级自动折叠省略号点击展开与当前页标记。",
  category: "navigation",
  registryName: "breadcrumb",
  dependencies: ["lucide-react"],
  usage: `import { Breadcrumb } from "@/components/ui/breadcrumb";

<Breadcrumb maxItems={3} items={items} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "折叠省略与完整路径",
      description: "超出 maxItems 时自动折叠中间节点，点击省略按钮展开完整层级。",
      file: "breadcrumb/basic.tsx",
      Demo: BreadcrumbBasicDemo,
    },
    {
      slug: "full",
      name: "完整层级链接路径",
      description: "展示带可点击上级链接与当前页高亮的标准面包屑导航。",
      file: "breadcrumb/full.tsx",
      Demo: BreadcrumbFullDemo,
      directory: false,
    },
  ],
  api: [
    { name: "items", type: "BreadcrumbItem[]", defaultValue: "必填", description: "路径节点列表" },
    {
      name: "maxItems",
      type: "number",
      defaultValue: "—",
      description: "超过该数量时折叠中间节点",
    },
    {
      name: "ariaLabel",
      type: "string",
      defaultValue: '"面包屑导航"',
      description: "导航区域标签",
    },
  ],
  accessibility: ['使用原生 <nav> 与有序列表 <ol>，末级自动设置 aria-current="page"。'],
};
