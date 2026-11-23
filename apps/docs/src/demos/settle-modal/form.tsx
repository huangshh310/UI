"use client";

import { Button, SettleModal, SpringSelect } from "@matt-ui/ui";
import { useId, useState } from "react";

const REGIONS = [
  { value: "tokyo", label: "东京节点（ap-northeast-1）" },
  { value: "sg", label: "新加坡节点（ap-southeast-1）" },
];

export default function SettleModalFormDemo() {
  const nameId = useId();
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState("tokyo");

  return (
    <SettleModal
      open={open}
      onOpenChange={setOpen}
      size="md"
      trigger={<Button variant="signal">新建边缘项目</Button>}
      title="创建边缘站点"
      description="配置项目名称与默认分发节点，创建后即可关联 Git 仓库。"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button variant="signal" size="sm" onClick={() => setOpen(false)}>
            立即创建
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="text-xs font-medium text-foreground">
            项目标识
          </label>
          <input
            id={nameId}
            placeholder="matt-ui-docs"
            className="h-9 rounded-lg border border-solid border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring focus:ring-inset dark:bg-card"
          />
        </div>
        <SpringSelect
          label="默认节点"
          options={REGIONS}
          value={region}
          onValueChange={(v) => v && setRegion(v)}
        />
      </div>
    </SettleModal>
  );
}
