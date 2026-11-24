import { ReorderList } from "@matt-ui/motion";
import {
  Accordion,
  Breadcrumb,
  NumberInput,
  Pagination,
  ResizablePanels,
  Slider,
  Tabs,
  Tree,
} from "@matt-ui/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta = {
  title: "Navigation/导航与复杂原语",
};

export default meta;

export const ControlsAndNavigation: StoryObj = {
  render: () => {
    const [page, setPage] = useState(3);
    return (
      <div className="flex max-w-lg flex-col gap-6">
        <Breadcrumb
          maxItems={3}
          items={[
            { label: "首页", href: "#home" },
            { label: "设计系统", href: "#ds" },
            { label: "导航", href: "#nav" },
            { label: "当前页" },
          ]}
        />
        <Tabs
          items={[
            { value: "a", label: "概览", content: "概览内容" },
            { value: "b", label: "设置", badge: "3", content: "设置内容" },
          ]}
        />
        <Accordion
          variant="boxed"
          items={[
            {
              value: "1",
              title: "交互底座",
              content: "单一无样式交互底座，内置完整键盘与 ARIA 支持。",
            },
            { value: "2", title: "双通道分发", content: "支持 npm 包与单文件源码 Registry。" },
          ]}
        />
        <Slider label="阈值区间" defaultValue={[25, 75]} showValue />
        <NumberInput label="并发数" defaultValue={8} min={1} max={32} />
        <Pagination page={page} totalPages={10} onPageChange={setPage} />
      </div>
    );
  },
};

export const UiSdkPrimitives: StoryObj = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-6">
      <Tree
        defaultExpanded={["src"]}
        nodes={[
          {
            id: "src",
            label: "src",
            children: [
              { id: "index.ts", label: "index.ts" },
              { id: "styles.css", label: "styles.css" },
            ],
          },
        ]}
      />
      <ReorderList
        items={[
          { id: "1", title: "步骤一" },
          { id: "2", title: "步骤二" },
          { id: "3", title: "步骤三" },
        ]}
      />
      <ResizablePanels
        panels={[
          { id: "l", defaultSize: 40, content: <div className="p-4 text-xs">左侧面板</div> },
          { id: "r", defaultSize: 60, content: <div className="p-4 text-xs">右侧面板</div> },
        ]}
      />
    </div>
  ),
};
