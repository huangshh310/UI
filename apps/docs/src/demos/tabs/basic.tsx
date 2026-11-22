"use client";

import { Tabs } from "@matt-ui/ui";
import { Layers, Palette, ShieldCheck } from "lucide-react";

export default function TabsBasicDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Tabs
        variant="pill"
        items={[
          {
            value: "tokens",
            label: "Token",
            icon: <Palette className="size-3.5" />,
            content: "中性灰阶打底 + 钴蓝信号色，浅色与深色自动满足 WCAG AA 对比度。",
          },
          {
            value: "registry",
            label: "Registry",
            icon: <Layers className="size-3.5" />,
            badge: "54",
            content: "通过 shadcn CLI 将扁平单文件源码直接安装到你的项目中。",
          },
          {
            value: "a11y",
            label: "无障碍",
            icon: <ShieldCheck className="size-3.5" />,
            content: "每页均在亮/暗双主题下通过 axe-core 自动化审计。",
          },
        ]}
      />
      <Tabs
        variant="underline"
        items={[
          { value: "day", label: "按日", content: "过去 24 小时请求稳定在 14ms P95。" },
          { value: "week", label: "按周", badge: "7d", content: "过去 7 天可用率 99.98%。" },
        ]}
      />
    </div>
  );
}
