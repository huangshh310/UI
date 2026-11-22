"use client";

import { Accordion } from "@matt-ui/ui";

export default function AccordionBasicDemo() {
  return (
    <Accordion
      variant="boxed"
      className="max-w-md"
      defaultValue={["engine"]}
      items={[
        {
          value: "engine",
          title: "为什么区分 Base UI 与 UI SDK？",
          subtitle: "ADR-001 交互底座策略",
          content:
            "通用交互组件统一由 Base UI 驱动，Base UI 缺失的 Tree、排序、命令与分栏由精确锁版本的 UI SDK 补齐。",
        },
        {
          value: "registry",
          title: "源码分发会影响升级吗？",
          content: "通过 shadcn Registry 安装后源码归你所有，同时支持从 npm 包按版本整体升级。",
        },
        {
          value: "motion",
          title: "动效组件为何独立分包？",
          content: "@matt-ui/ui 零动画库依赖，仅在引入 @matt-ui/motion 时加载弹簧物理与布局过渡。",
        },
      ]}
    />
  );
}
