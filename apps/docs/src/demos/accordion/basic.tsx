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
          title: "如何保证交互组件的键盘与无障碍一致性？",
          subtitle: "单一交互底座策略",
          content:
            "每个交互组件的键盘导航、焦点陷阱与 ARIA 属性只由单一无样式交互底座提供，并通过端到端测试持续守护。",
        },
        {
          value: "registry",
          title: "源码分发会影响升级吗？",
          content:
            "通过源码分发 Registry 安装后代码完全归项目所有，同时支持从 npm 包按版本整体升级。",
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
