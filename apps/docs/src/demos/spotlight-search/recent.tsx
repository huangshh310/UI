"use client";

import { SpotlightSearch } from "@matt-ui/motion";
import { FolderTree, PanelRight, Receipt } from "lucide-react";
import { useState } from "react";

const DOC_ITEMS = [
  {
    id: "sheet",
    title: "Sheet 悬浮抽屉",
    description: "四周圆角与留白间距",
    category: "浮层",
    shortcut: "S",
    meta: "Base UI Dialog",
    icon: <PanelRight className="size-3.5" />,
    preview: "支持 right/left/top/bottom 四方向与 inset 切换。",
  },
  {
    id: "pricing",
    title: "Pricing Block",
    description: "按月/按年切换三档定价",
    category: "区块",
    shortcut: "B",
    meta: "Blocks",
    icon: <Receipt className="size-3.5" />,
    preview: "组合 StretchSwitch 与 NumberFlow 平滑滚轮定价。",
  },
  {
    id: "tree",
    title: "Tree 文件树",
    description: "键盘方向键展开折叠",
    category: "导航",
    shortcut: "F",
    meta: "UI SDK Tree",
    icon: <FolderTree className="size-3.5" />,
    preview: "基于锁版本 @ui-sdk/react/tree 提供完整无障碍树语义。",
  },
];

export default function SpotlightSearchRecentDemo() {
  const [picked, setPicked] = useState("尚未选择条目");
  return (
    <div className="flex flex-col items-center gap-2.5">
      <SpotlightSearch
        triggerLabel="检索组件与区块…"
        shortcutHint="⌘/"
        placeholder="输入 Sheet、Pricing 或 Tree…"
        items={DOC_ITEMS}
        recentQueries={["Sheet", "Pricing", "Tree"]}
        onSelect={(item) => setPicked(`已定位：${item.title}`)}
      />
      <span className="font-mono text-xs text-muted-foreground">{picked}</span>
    </div>
  );
}
