import PaginationBasicDemo from "@/demos/pagination/basic";
import PaginationVariantsDemo from "@/demos/pagination/variants";
import PaginationWideDemo from "@/demos/pagination/wide";
import type { ComponentDoc } from "./registry.types";

export const PAGINATION_DOC: ComponentDoc = {
  slug: "pagination",
  name: "Pagination",
  description:
    "语义化分页导航，支持 default / minimal / pills 三种视觉变体、三档尺寸、省略号计算与首尾页快捷跳转。",
  category: "navigation",
  registryName: "pagination",
  dependencies: ["class-variance-authority", "lucide-react"],
  usage: `import { Pagination } from "@/components/ui/pagination";

<Pagination variant="pills" showEdges page={4} totalPages={12} onPageChange={setPage} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "省略号分页器",
      description: "等宽数字页码在翻页时不产生横向跳动，边界页自动禁用上一页或下一页。",
      file: "pagination/basic.tsx",
      Demo: PaginationBasicDemo,
    },
    {
      slug: "variants",
      name: "胶囊实底与极简紧凑分页",
      description: "展示 pills 胶囊高亮配首尾页跳转按钮，以及 minimal 紧凑页码读数模式。",
      file: "pagination/variants.tsx",
      Demo: PaginationVariantsDemo,
      directory: false,
    },
    {
      slug: "wide",
      name: "宽表页脚分页器（含记录统计）",
      description: "搭配 siblingCount={1} 与当前条目区间读数，适合数据表格底栏。",
      file: "pagination/wide.tsx",
      Demo: PaginationWideDemo,
      directory: false,
    },
  ],
  api: [
    { name: "page", type: "number", defaultValue: "必填", description: "当前页码（1 起）" },
    { name: "totalPages", type: "number", defaultValue: "必填", description: "总页数" },
    {
      name: "onPageChange",
      type: "(page: number) => void",
      defaultValue: "必填",
      description: "页码切换回调",
    },
    {
      name: "variant / size",
      type: '"default" | "minimal" | "pills" / "sm" | "md" | "lg"',
      defaultValue: '"default" / "md"',
      description: "外观变体与按钮尺寸",
    },
    {
      name: "showEdges",
      type: "boolean",
      defaultValue: "false",
      description: "是否显示跳至第一页与最后一页按钮",
    },
    {
      name: "siblingCount",
      type: "number",
      defaultValue: "1",
      description: "当前页两侧保留页码数",
    },
  ],
  accessibility: ['每个页码按钮带有清晰 aria-label，当前页自动标记 aria-current="page"。'],
};
