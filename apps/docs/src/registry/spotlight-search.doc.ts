import SpotlightSearchBasicDemo from "@/demos/spotlight-search/basic";
import SpotlightSearchRecentDemo from "@/demos/spotlight-search/recent";
import type { ComponentDoc } from "./registry.types";

export const SPOTLIGHT_SEARCH_DOC: ComponentDoc = {
  slug: "spotlight-search",
  name: "Spotlight Search",
  description: "聚焦搜索弹层，支持分类胶囊筛选、最近搜索快捷回填与右侧分栏实时预览。",
  category: "overlays",
  registryName: "spotlight-search",
  dependencies: ["@base-ui/react", "lucide-react", "motion"],
  usage: `import { SpotlightSearch } from "@/components/ui/spotlight-search";

<SpotlightSearch items={items} recentQueries={["Button"]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "分类筛选与分栏预览",
      description: "桌面端右侧随当前高亮条目联动展示摘要预览与快捷键提示。",
      file: "spotlight-search/basic.tsx",
      Demo: SpotlightSearchBasicDemo,
    },
    {
      slug: "recent",
      name: "含历史检索与分栏预览",
      description: "展示最近搜索关键词胶囊，支持点选填充与右侧实时摘要预览。",
      file: "spotlight-search/recent.tsx",
      Demo: SpotlightSearchRecentDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "SpotlightSearchItem[]",
      defaultValue: "必填",
      description: "可搜索条目列表",
    },
    {
      name: "recentQueries",
      type: "string[]",
      defaultValue: "[]",
      description: "输入为空时展示的最近搜索",
    },
    { name: "onSelect", type: "(item) => void", defaultValue: "—", description: "选中条目回调" },
  ],
  accessibility: ["采用 Base UI Dialog 管理焦点与 Escape 退出，搜索输入框带有明确 aria-label。"],
};
