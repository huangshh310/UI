"use client";

/**
 * 示例：SpringSelect 的弹性展开、键盘导航与外部重置。
 */
import { Button, SpringSelect } from "@matt-ui/ui";
import { useState } from "react";

const REGIONS = [
  { value: "tokyo", label: "Tokyo", description: "ap-northeast-1 · 18ms" },
  { value: "singapore", label: "Singapore", description: "ap-southeast-1 · 32ms" },
  { value: "frankfurt", label: "Frankfurt", description: "eu-central-1 · 95ms" },
  { value: "oregon", label: "Oregon", description: "us-west-2 · 128ms" },
];

export const SpringSelectBasic = () => {
  const [region, setRegion] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <SpringSelect
        label="部署区域"
        placeholder="选择一个节点"
        options={REGIONS}
        value={region}
        onValueChange={setRegion}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span data-testid="select-value">当前节点：{region ?? "未选择"}</span>
        <Button variant="ghost" size="sm" onClick={() => setRegion(null)}>
          重置
        </Button>
      </div>
    </div>
  );
};
