"use client";

/**
 * 示例：SpringSelect 主展示。极简发丝边框与轻盈磨砂弹层，支持方向键、首字母跳转与外部重置。
 */
import { Button, SpringSelect } from "@matt-ui/ui";
import { Globe } from "lucide-react";
import { useState } from "react";

const REGIONS = [
  { value: "tokyo", label: "Tokyo", badge: "18ms", dot: "success" as const },
  { value: "singapore", label: "Singapore", badge: "32ms", dot: "success" as const },
  { value: "frankfurt", label: "Frankfurt", badge: "95ms", dot: "warning" as const },
  { value: "oregon", label: "Oregon", badge: "128ms", dot: "muted" as const },
];

export const SpringSelectBasic = () => {
  const [region, setRegion] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-72 flex-col gap-3">
      <SpringSelect
        label="部署区域"
        placeholder="选择一个节点"
        tone="signal"
        prefix={<Globe className="size-3.5" />}
        options={REGIONS}
        value={region}
        onValueChange={setRegion}
        className="max-w-none"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span data-testid="select-value" className="font-mono">
          当前节点：{region ?? "未选择"}
        </span>
        <Button variant="ghost" size="sm" onClick={() => setRegion(null)}>
          重置
        </Button>
      </div>
    </div>
  );
};
