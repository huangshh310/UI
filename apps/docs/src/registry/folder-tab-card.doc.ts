import FolderTabCardBasicDemo from "@/demos/folder-tab-card/basic";
import FolderTabCardReleasesDemo from "@/demos/folder-tab-card/releases";
import type { ComponentDoc } from "./registry.types";

export const FOLDER_TAB_CARD_DOC: ComponentDoc = {
  slug: "folder-tab-card",
  name: "Folder Tab Card",
  description: "立体文件夹标签切换卡片，结合共享 layoutId 弹簧标签页与底部等宽指标区。",
  category: "motion",
  registryName: "folder-tab-card",
  dependencies: ["motion"],
  usage: `import { FolderTabCard } from "@/components/ui/folder-tab-card";

<FolderTabCard tabs={tabs} />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "文件夹标签切换卡片",
      description: "点击顶部文件夹页签丝滑切换内容与等宽统计数字。",
      file: "folder-tab-card/basic.tsx",
      Demo: FolderTabCardBasicDemo,
    },
    {
      slug: "releases",
      name: "版本亮点文件夹标签卡",
      description: "通过立体标签页切换不同模块更新摘要，带 NEW 徽章与平滑布局过渡。",
      file: "folder-tab-card/releases.tsx",
      Demo: FolderTabCardReleasesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "tabs",
      type: "FolderTabItem[]",
      defaultValue: "必填",
      description: "标签页配置与统计指标",
    },
    {
      name: "defaultTabId",
      type: "string",
      defaultValue: "第一项",
      description: "默认选中标签 id",
    },
  ],
  accessibility: ['采用标准 role="tablist" / role="tab" / role="tabpanel" 与 aria-selected 语义。'],
};
