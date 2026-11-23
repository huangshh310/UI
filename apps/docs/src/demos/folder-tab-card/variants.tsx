"use client";

import { FolderTabCard } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { Cpu, Gauge } from "lucide-react";
import { useState } from "react";

const VARIANT_OPTIONS = [
  { id: "default" as const, label: "Default" },
  { id: "elevated" as const, label: "Elevated" },
  { id: "tinted" as const, label: "Tinted" },
];

export default function FolderTabCardVariantsDemo() {
  const [variant, setVariant] = useState<"default" | "elevated" | "tinted">("elevated");

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="flex items-center gap-1.5">
        {VARIANT_OPTIONS.map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant={variant === item.id ? "primary" : "outline"}
            onClick={() => setVariant(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <FolderTabCard
        variant={variant}
        tabs={[
          {
            id: "perf",
            label: "帧率表现",
            icon: <Gauge />,
            badge: "60fps",
            metric: "11.8ms",
            caption: "端到端交互响应 P95",
            content: "采用合成层 transform 与弹簧阻尼曲线，在桌面与移动端均维持稳定帧率。",
          },
          {
            id: "bundle",
            label: "按需裁剪",
            icon: <Cpu />,
            badge: "ESM",
            metric: "4.2 kB",
            caption: "单组件 Tree-Shaking 增量",
            content: "每个组件独立扁平化分发，仅在引入动效组件时才加载 motion/react 运行时。",
          },
        ]}
      />
    </div>
  );
}
