import FolderTabCardBasicDemo from "@/demos/folder-tab-card/basic";
import FolderTabCardReleasesDemo from "@/demos/folder-tab-card/releases";
import FolderTabCardVariantsDemo from "@/demos/folder-tab-card/variants";
import type { ComponentDoc } from "./registry.types";

export const FOLDER_TAB_CARD_DOC: ComponentDoc = {
  slug: "folder-tab-card",
  name: "Folder Tab Card",
  description:
    "Apple / Linear 风格的立体多层文件夹标签切换卡片，结合共享 layoutId 弹簧页签、顶部微指示条、标签图标徽标与底部等宽指标区。",
  category: "motion",
  registryName: "folder-tab-card",
  dependencies: ["motion", "clsx", "tailwind-merge"],
  usage: `import { FolderTabCard } from "@/components/ui/folder-tab-card";

<FolderTabCard variant="elevated" tabs={tabs} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "带图标与徽标的文件夹标签卡",
      description: "点击顶部文件夹页签或按左右方向键，丝滑切换内容与等宽统计数字。",
      file: "folder-tab-card/basic.tsx",
      Demo: FolderTabCardBasicDemo,
    },
    {
      slug: "releases",
      name: "钴蓝微染版本亮点标签卡",
      description: '使用 variant="tinted" 与图标徽标呈现模块更新摘要。',
      file: "folder-tab-card/releases.tsx",
      Demo: FolderTabCardReleasesDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "三种文件夹材质切换对比",
      description: "交互预览 default / elevated / tinted 三套外框层级与激活指示条风格。",
      file: "folder-tab-card/variants.tsx",
      Demo: FolderTabCardVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "tabs",
      type: "FolderTabItem[]",
      defaultValue: "必填",
      description: "标签页配置，支持 label / icon / badge / metric / caption / content。",
    },
    {
      name: "variant",
      type: '"default" | "elevated" | "tinted"',
      defaultValue: '"default"',
      description: "文件夹外框层级与指示条材质变体。",
    },
    {
      name: "defaultTabId",
      type: "string",
      defaultValue: "第一项",
      description: "非受控模式的默认选中标签 id。",
    },
    {
      name: "activeTabId",
      type: "string",
      defaultValue: "—",
      description: "受控模式的当前选中标签 id。",
    },
    {
      name: "onTabChange",
      type: "(tabId: string) => void",
      defaultValue: "—",
      description: "切换标签时触发的回调。",
    },
  ],
  accessibility: [
    '完整遵循 WAI-ARIA Tabs 语义：role="tablist" / role="tab" / role="tabpanel"、aria-selected、aria-controls 与 aria-labelledby。',
    "支持键盘左右方向键、Home 与 End 在页签间快速跳转并同步管理焦点。",
  ],
};
