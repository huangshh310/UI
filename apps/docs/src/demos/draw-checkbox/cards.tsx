"use client";

/**
 * 示例：C 端服务卡片与订阅加购（卡片变体 + 圆形勾选 + 右侧控件 + 价格汇总）。
 */
import { DrawCheckbox } from "@matt-ui/ui";
import { Cloud, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

const ADDONS = [
  {
    id: "ai",
    label: "AI 智能创作助手",
    description: "不限量生成界面草图、文案润色与动效建议。",
    badge: "推荐",
    price: 28,
    icon: <Sparkles className="size-4" />,
  },
  {
    id: "cloud",
    label: "100GB 云端版本快照",
    description: "保留 90 天历史记录，随时一键回滚任意节点。",
    badge: "新功能",
    price: 12,
    icon: <Cloud className="size-4" />,
  },
  {
    id: "guard",
    label: "企业级 SSO 与审计日志",
    description: "支持 SAML 单点登录与成员操作安全追踪。",
    price: 18,
    icon: <ShieldCheck className="size-4" />,
  },
];

export const DrawCheckboxCards = () => {
  const [selected, setSelected] = useState<string[]>(["ai", "cloud"]);
  const total = ADDONS.filter((item) => selected.includes(item.id)).reduce(
    (sum, item) => sum + item.price,
    0,
  );

  const toggle = (id: string, next: boolean) =>
    setSelected((prev) => (next ? [...prev, id] : prev.filter((item) => item !== id)));

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {ADDONS.map((addon) => (
        <DrawCheckbox
          key={addon.id}
          variant="card"
          shape="circle"
          size="lg"
          tone="signal"
          controlPosition="right"
          label={addon.label}
          description={addon.description}
          badge={addon.badge}
          icon={addon.icon}
          trailing={`￥${addon.price}/月`}
          checked={selected.includes(addon.id)}
          onCheckedChange={(next) => toggle(addon.id, next)}
        />
      ))}
      <div className="mt-1 flex items-center justify-between rounded-xl bg-secondary/70 px-4 py-2.5 text-xs">
        <span className="text-muted-foreground">已选 {selected.length} 项增值服务</span>
        <span className="font-mono font-semibold text-foreground tabular-nums">
          合计 ￥{total}/月
        </span>
      </div>
    </div>
  );
};
