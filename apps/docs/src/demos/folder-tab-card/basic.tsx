"use client";

import { FolderTabCard } from "@matt-ui/motion";

export default function FolderTabCardBasicDemo() {
  return (
    <FolderTabCard
      tabs={[
        {
          id: "ui",
          label: "核心原语",
          metric: "46",
          caption: "@matt-ui/ui · 零动画依赖",
          content: "覆盖按钮、表单、表格、浮层、展示反馈、导航与布局区块，统一遵循中性钴蓝 Token。",
        },
        {
          id: "motion",
          label: "动效套件",
          metric: "18",
          caption: "@matt-ui/motion · 弹簧物理",
          content: "按需引入的物理微交互、共享元素弹窗、滚轮数字与拖拽重排列表。",
        },
      ]}
    />
  );
}
