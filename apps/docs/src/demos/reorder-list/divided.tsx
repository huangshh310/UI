"use client";

import { ReorderList } from "@matt-ui/motion";
import { Cpu, Globe, ShieldCheck } from "lucide-react";

const ROUTERS = [
  {
    id: "primary",
    title: "主推理集群（Tokyo）",
    subtitle: "P95 延迟 42ms · 自动扩缩",
    icon: <Cpu className="size-3.5" />,
    badge: "首选",
  },
  {
    id: "fallback",
    title: "灾备边缘节点（Singapore）",
    subtitle: "P95 延迟 68ms · 只读缓存",
    icon: <Globe className="size-3.5" />,
    badge: "备选",
  },
  {
    id: "audit",
    title: "合规审计代理",
    subtitle: "敏感字段脱敏与日志落盘",
    icon: <ShieldCheck className="size-3.5" />,
    badge: "兜底",
  },
];

export default function ReorderListDividedDemo() {
  return (
    <div className="w-full max-w-sm">
      <ReorderList
        ariaLabel="推理路由优先级"
        variant="divided"
        density="compact"
        showIndex
        items={ROUTERS}
      />
    </div>
  );
}
