import SpotlightSearchBasicDemo from "@/demos/spotlight-search/basic";
import SpotlightSearchMediaDemo from "@/demos/spotlight-search/media";
import SpotlightSearchRecentDemo from "@/demos/spotlight-search/recent";
import type { ComponentDoc } from "./registry.types";

export const SPOTLIGHT_SEARCH_DOC: ComponentDoc = {
  slug: "spotlight-search",
  name: "Spotlight Search",
  description:
    "磨砂聚焦搜索弹层，支持分类胶囊筛选、最近搜索快捷回填、↑↓ 键盘导航、右侧分栏实时预览与键帽提示。",
  category: "overlays",
  registryName: "spotlight-search",
  dependencies: ["@base-ui/react", "lucide-react", "motion"],
  usage: `import { SpotlightSearch } from "@/components/ui/spotlight-search";

<SpotlightSearch items={items} shortcutHint="⌘K" recentQueries={["Button"]} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "分类筛选与分栏预览",
      description: "桌面端右侧随当前高亮条目联动展示图标、摘要预览与快捷键键帽。",
      file: "spotlight-search/basic.tsx",
      Demo: SpotlightSearchBasicDemo,
    },
    {
      slug: "recent",
      name: "含历史检索与分栏预览",
      description: "展示触发器键帽提示与最近搜索胶囊，支持点选填充与右侧实时摘要预览。",
      file: "spotlight-search/recent.tsx",
      Demo: SpotlightSearchRecentDemo,
      directory: false,
    },
    {
      slug: "media",
      name: "宽幅工作区资源检索",
      description: '采用 size="lg" 宽幅分栏，结合文件图标、元信息与键盘 ↑↓/回车导航。',
      file: "spotlight-search/media.tsx",
      Demo: SpotlightSearchMediaDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "items",
      type: "SpotlightSearchItem[]",
      defaultValue: "必填",
      description: "可搜索条目列表（支持 icon、meta、shortcut 与右侧 preview 摘要）",
    },
    {
      name: "size / showFooter",
      type: '"md" | "lg" / boolean',
      defaultValue: '"md" / true',
      description: "搜索面板宽度预设与底部键盘导航/结果计数栏开关",
    },
    {
      name: "shortcutHint / enableGlobalShortcut / shortcutKey",
      type: "string / boolean / string",
      defaultValue: '— / false / "k"',
      description: "触发按钮右侧快捷键键帽、全局快捷键监听开关与监听按键",
    },
    {
      name: "recentQueries",
      type: "string[]",
      defaultValue: "[]",
      description: "输入为空时展示的最近搜索关键词胶囊",
    },
    { name: "onSelect", type: "(item) => void", defaultValue: "—", description: "选中条目回调" },
  ],
  accessibility: [
    "内置模态焦点陷阱与 Escape 退出，搜索输入框支持上下方向键切换高亮与 Enter 确认。",
  ],
};
