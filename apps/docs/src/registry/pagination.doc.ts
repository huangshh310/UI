import PaginationBasicDemo from "@/demos/pagination/basic";
import PaginationWideDemo from "@/demos/pagination/wide";
import type { ComponentDoc } from "./registry.types";

export const PAGINATION_DOC: ComponentDoc = {
  slug: "pagination",
  name: "Pagination",
  description: "语义化分页导航，自动计算省略号区间、当前页高亮与边界按钮禁用。",
  category: "navigation",
  registryName: "pagination",
  dependencies: ["lucide-react"],
  usage: `import { Pagination } from "@/components/ui/pagination";

<Pagination page={4} totalPages={12} onPageChange={setPage} />`,
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
      name: "siblingCount",
      type: "number",
      defaultValue: "1",
      description: "当前页两侧保留页码数",
    },
  ],
  accessibility: ['每个页码按钮带有清晰 aria-label，当前页自动标记 aria-current="page"。'],
};
